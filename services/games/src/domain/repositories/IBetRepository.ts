import { Bet } from "../entities/Bet";

export abstract class IBetRepository {
  abstract saveBet(bet: Bet): Promise<void>;
  abstract findBetsRoundId(id: string): Promise<Bet[]>;
}

export interface BetProps {
  id: string;
  userId: string;
  roundId: string;
  amount: bigint;
  multiplierAtCashout: number | null;
  status: "PENDING" | "WON" | "LOST";
}
