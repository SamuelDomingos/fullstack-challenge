import { IRoundRepository } from "../../domain/repositories/IRoundRepository";
import { IBetRepository } from "../../domain/repositories/IBetRepository";

export class CrashRoundUseCase {
  constructor(
    private roundRepository: IRoundRepository,
    private betRepository: IBetRepository,
  ) {}

  async execute(): Promise<void> {
    const round = await this.roundRepository.findActiveRound();

    if (!round || round.status !== "RUNNING") {
      throw new Error("Não há rodada ativa para sofrer crash");
    }

    round.crash();
    await this.roundRepository.saveRound(round);

    const bets = await this.betRepository.findBetsRoundId(round.id);

    if (bets && Array.isArray(bets)) {
      round.settle(bets);
      for (const bet of bets) {
        await this.betRepository.saveBet(bet);
      }
    }
  }
}
