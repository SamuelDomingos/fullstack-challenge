import { Injectable } from "@nestjs/common";
import { IBetRepository } from "@/domain/repositories/IBetRepository";
import { RoundStatistics } from "@/domain/value-objects/RoundStatistics";
import { GetRoundStatisticsUseCaseDTO } from "../dtos/round.dto";

@Injectable()
export class GetRoundStatisticsUseCase {
  constructor(private readonly betRepository: IBetRepository) {}

  async execute(dto: GetRoundStatisticsUseCaseDTO): Promise<RoundStatistics> {
    const bets = await this.betRepository.findBetsRoundId(dto.roundId);

    const totalAmount = bets.reduce((sum, bet) => {
      return sum + bet.toJSON().amount;
    }, 0n);

    return RoundStatistics.create(totalAmount);
  }
}
