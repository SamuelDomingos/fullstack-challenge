import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Inject, forwardRef } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { CrashRoundUseCase } from "@/application/use-cases/crash-round.use-case";
import { CreateRoundUseCase } from "@/application/use-cases/create-round.use-case";
import { IRoundRepository } from "@/domain/repositories/IRoundRepository";
import { Round } from "@/domain/entities/Round";
import * as crypto from "crypto";

@WebSocketGateway({
  cors: { origin: "*" },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private gameInterval: NodeJS.Timeout | null = null;
  private bettingTimer = 50;
  private isCrashing = false;

  constructor(
    @Inject(forwardRef(() => CrashRoundUseCase))
    private readonly crashRoundUseCase: CrashRoundUseCase,
    @Inject(forwardRef(() => CreateRoundUseCase))
    private readonly createRoundUseCase: CreateRoundUseCase,
    private readonly roundRepository: IRoundRepository,
  ) {}

  afterInit() {
    this.startGameLoop();
  }

  handleConnection(client: Socket) {
    client.emit("betting_timer", { secondsLeft: this.bettingTimer });
  }

  handleDisconnect(_client: Socket) {}

  startGameLoop() {
    if (this.gameInterval || this.isCrashing) return;

    this.gameInterval = setInterval(async () => {
      try {
        const round = await this.roundRepository.findActiveRound();

        if (!round) {
          const clientSeed = crypto.randomBytes(16).toString("hex");
          await this.createRoundUseCase.execute(clientSeed);
          this.bettingTimer = 50;
          this.server.emit("betting_timer", { secondsLeft: this.bettingTimer, status: "BETTING" });
          
          return;
        }

        const status = round.status;

        if (status === "BETTING") {
          this.bettingTimer--;
          this.server.emit("betting_timer", { secondsLeft: this.bettingTimer, status: "BETTING" });

          if (this.bettingTimer <= 0) {
            round.startRound();
            await this.roundRepository.saveRound(round);
            this.server.emit("round_started", {
              roundId: round.id,
              serverSeedHash: round.getPublicSeedInfo().serverSeedHash,
            });
          }
        } else if (status === "RUNNING") {
          this.server.emit("betting_timer", { secondsLeft: 0, status: "RUNNING" });
          const multiplier = round.getCurrentMultiplier().toDecimal();
          this.server.emit("multiplier_update", {
            multiplier: multiplier.toFixed(2),
          });

          if (multiplier >= round.crashPoint) {
            await this.executeCrash(round);
          }
        }
      } catch (err) {
        console.error("Erro no loop do jogo:", err);
      }
    }, 1000);
  }

  private async executeCrash(round: Round) {
    if (this.isCrashing) return;
    this.isCrashing = true;

    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }

    try {
      await this.crashRoundUseCase.execute();
      this.server.emit("game_crash", {
        crashPoint: round.crashPoint.toFixed(2),
        roundId: round.id,
        status: "CRASHED"
      });
    } catch (err) {
      console.error("Erro ao processar crash:", err);
    }

    this.bettingTimer = 50;

    setTimeout(() => {
      this.isCrashing = false;
      this.startGameLoop();
    }, 5000);
  }
}