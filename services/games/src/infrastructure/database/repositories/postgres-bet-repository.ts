import { Bet } from "@/domain/entities/Bet";
import {
  BetProps,
  IBetRepository,
} from "@/domain/repositories/IBetRepository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PostgresBetRepository implements IBetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveBet(bet: Bet): Promise<void> {
    const data = bet.toJSON();

    await this.prisma.bet.upsert({
      where: { id: data.id },
      update: {
        status: data.status,
        cashoutMultiplier: data.multiplierAtCashout,
      },
      create: {
        id: data.id,
        userId: data.userId,
        amount: data.amount,
        roundId: (data as any).roundId,
        status: data.status,
        cashoutMultiplier: data.multiplierAtCashout,
      },
    });
  }

  async findBetsRoundId(roundId: string): Promise<Bet[]> {
    const betsData = await this.prisma.bet.findMany({
      where: { roundId: roundId },
    });

    return betsData.map((betData) =>
      new Bet({
        id: betData.id,
        userId: betData.userId,
        amount: betData.amount,
        roundId: betData.roundId,
        multiplierAtCashout: Number(betData.cashoutMultiplier),
        status: betData.status as BetProps["status"],
      }),
    );
  }
}
