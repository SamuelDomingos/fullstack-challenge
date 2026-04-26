import { Injectable } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";

@Injectable()
export class WalletClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://guest:guest@localhost:5672"],
        queue: "wallet_queue",
      },
    });
  }

  async emitBetPlaced(userId: string, amount: bigint) {
    return this.client.emit("bet_placed", {
      userId,
      amount: amount.toString(),
    });
  }

  async emitBetWon(userId: string, amount: bigint) {
    return this.client.emit("bet_won", {
      userId,
      amount: amount.toString(),
    });
  }
}
