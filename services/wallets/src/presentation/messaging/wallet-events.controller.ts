import { DepositMoneyUseCase } from "@/application/use-cases/deposit-money.use-case";
import { WithdrawMoneyUseCase } from "@/application/use-cases/withdraw-money.use-case";
import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class WalletEventsController {
  constructor(
    private readonly depositUseCase: DepositMoneyUseCase,
    private readonly withdrawUseCase: WithdrawMoneyUseCase,
  ) {}

  @MessagePattern("bet_placed")
  async handleBetPlaced(@Payload() data: { userId: string; amount: string }) {
    try {
      await this.withdrawUseCase.execute({
        userId: data.userId,
        amount: Number(data.amount),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  @EventPattern("bet_won")
  async handleBetWon(@Payload() data: { userId: string; amount: string }) {
    this.depositUseCase.execute({
      userId: data.userId,
      amount: Number(data.amount),
    });
  }
}
