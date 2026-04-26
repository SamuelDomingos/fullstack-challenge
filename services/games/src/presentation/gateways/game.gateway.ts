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
import { IRoundRepository } from "@/domain/repositories/IRoundRepository";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private gameInterval: NodeJS.Timeout | null = null;
  private currentMultiplier: number = 1.0;
  private bettingTimer: number = 10;

  constructor(
    @Inject(forwardRef(() => CrashRoundUseCase))
    private readonly crashRoundUseCase: CrashRoundUseCase,
    private readonly roundRepository: IRoundRepository,
  ) {}

  afterInit(server: Server) {
    console.log("Game Gateway Initialized");
    setTimeout(() => this.startGameLoop(), 5000);
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  private async startGameLoop() {
    if (this.gameInterval) return;

    this.gameInterval = setInterval(async () => {
      const round = await this.roundRepository.findActiveRound();

      if (!round) return;

      const roundStatus = round.status;

      if (roundStatus === "BETTING") {
        this.bettingTimer--;

        this.server.emit("betting_timer", {
          secondsLeft: this.bettingTimer,
        });

        if (this.bettingTimer <= 0) {
          this.bettingTimer = 10;
        }
        return;
      }

      if (roundStatus === "RUNNING") {
        this.currentMultiplier += 0.01;

        this.server.emit("multiplier_update", {
          multiplier: this.currentMultiplier.toFixed(2),
        });

        if (this.currentMultiplier >= round.crashPoint) {
          this.executeCrash();
        }
      }
    }, 100);
  }

  private async executeCrash() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }

    try {
      await this.crashRoundUseCase.execute();

      this.server.emit("game_crash", {
        crashPoint: this.currentMultiplier.toFixed(2),
      });
    } catch (error) {
      console.error("Erro ao processar crash:", error);
    } finally {
      this.currentMultiplier = 1.0;
      this.bettingTimer = 10;
      setTimeout(() => this.startGameLoop(), 5000);
    }
  }
}
