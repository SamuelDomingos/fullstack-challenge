import type {
  BetCashoutUseCaseDTO,
  CreateBetUseCaseDTO,
} from "@/application/dtos/bet.dto";
import { CashoutBetUseCase } from "@/application/use-cases/cashout-bet.use-case";
import { CreateBetUseCase } from "@/application/use-cases/create-bet.use-case";
import { IRoundRepository } from "@/domain/repositories/IRoundRepository";
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Controller("games")
export class GameController {
  constructor(
    private readonly createBetUseCase: CreateBetUseCase,
    private readonly cashoutBetUseCase: CashoutBetUseCase,
    private readonly roundRepository: IRoundRepository,
  ) {}

  @Post("bet")
  async createBet(@Body() dto: CreateBetUseCaseDTO, @Request() req: any) {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        throw new HttpException(
          "Usuário não autenticado",
          HttpStatus.UNAUTHORIZED,
        );
      }

      const finalDto = { ...dto, userId };
      const bet = await this.createBetUseCase.execute(finalDto);

      return {
        message: "Aposta realizada com sucesso",
        data: bet.toJSON(),
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("bet/cashout")
  async cashout(@Body() dto: BetCashoutUseCaseDTO, @Request() req: any) {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        throw new HttpException(
          "Usuário não autenticado",
          HttpStatus.UNAUTHORIZED,
        );
      }

      const finalDto = { ...dto, userId };
      await this.cashoutBetUseCase.execute(finalDto);

      return {
        message: "Cashout realizado com sucesso!",
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get("rounds/current")
  async getCurrentRound() {
    const round = await this.roundRepository.findActiveRound();
    if (!round) {
      throw new HttpException("Nenhuma rodada ativa", HttpStatus.NOT_FOUND);
    }
    return {
      data: round.toPublicJSON(),
    };
  }

  @Get("rounds/history")
  async getHistory() {
    const history = await this.roundRepository.findHistory();
    return {
      data: history.map((r) => r.toPublicJSON()),
    };
  }
}
