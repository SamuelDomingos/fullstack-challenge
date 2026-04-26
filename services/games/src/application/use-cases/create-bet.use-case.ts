import { IBetRepository } from "../../domain/repositories/IBetRepository";
import { IRoundRepository } from "../../domain/repositories/IRoundRepository";
import { Bet } from "../../domain/entities/Bet";
import { BetAmount } from "../../domain/value-objects/BetAmount";
import { CreateBetUseCaseDTO } from "../dtos/bet.dto";
import { WalletClient } from "@/infrastructure/messaging/wallet-client";

export class CreateBetUseCase {
  constructor(
    private betRepository: IBetRepository,
    private roundRepository: IRoundRepository,
    private walletClient: WalletClient,
  ) {}

  async execute(dto: CreateBetUseCaseDTO): Promise<Bet> {
    const round = await this.roundRepository.findActiveRound();

    if (!round) {
      throw new Error("Não há rodada ativa no momento");
    }

    if (!round.canAcceptBets()) {
      throw new Error("As apostas estão fechadas para esta rodada");
    }

    const amount = BetAmount.fromCents(dto.amount);

    const bet = new Bet({
      id: crypto.randomUUID(),
      userId: dto.userId,
      amount: amount.cents,
      roundId: round.id,
      multiplierAtCashout: null,
      status: "PENDING",
    });

    await this.betRepository.saveBet(bet);
    await this.walletClient.emitBetPlaced(dto.userId, amount.cents);

    return bet;
  }
}
