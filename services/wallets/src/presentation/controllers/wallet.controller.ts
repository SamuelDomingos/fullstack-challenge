import { CreateWalletUseCase } from "@/application/use-cases/create-wallet.use-case";
import { GetWalletBalanceUseCase } from "@/application/use-cases/get-wallet-balance.use-case";
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { CreateWalletDTO } from "@/application/dtos/wallet.dto";

@Controller("wallets")
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly getWalletBalanceUseCase: GetWalletBalanceUseCase,
  ) {}

  @Post()
  async create(@Request() req: any) {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", HttpStatus.UNAUTHORIZED);
      }

      const wallet = await this.createWalletUseCase.execute({ userId });
      return {
        message: "Carteira criada com sucesso",
        data: wallet.toJSON(),
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get("me")
  async getMe(@Request() req: any) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new HttpException(
        "Usuário não autenticado",
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const balance = await this.getWalletBalanceUseCase.execute(userId);
      return {
        data: balance,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
