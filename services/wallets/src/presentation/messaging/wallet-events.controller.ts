import { DepositMoneyUseCase } from "@/application/use-cases/deposit-money.use-case";
import { WithdrawMoneyUseCase } from "@/application/use-cases/withdraw-money.use-case";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class WalletEventsController {
  constructor(
    private readonly depositUseCase: DepositMoneyUseCase,
    private readonly withdrawUseCase: WithdrawMoneyUseCase,
  ) {}

  @EventPattern("bet_placed")
  async handleBetPlaced(@Payload() data: { userId: string; amount: string }) {
    this.withdrawUseCase.execute({
      userId: data.userId,
      amount: Number(data.amount),
    });
  }

  @EventPattern("bet_won")
  async handleBetWon(@Payload() data: { userId: string; amount: string }) {
    this.depositUseCase.execute({
      userId: data.userId,
      amount: Number(data.amount),
    });
  }
}
