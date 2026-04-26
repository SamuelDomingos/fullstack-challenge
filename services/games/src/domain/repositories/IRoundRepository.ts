import { Round } from "../entities/Round";

export abstract class IRoundRepository {
  abstract findHistory(): Promise<Round[]>;
  abstract findActiveRound(): Promise<Round | null>;
  abstract saveRound(round: Round): Promise<void>;
  abstract findCurrentNonce(): Promise<number>;
}

export interface RoundProps {
  id: string;
  status: "BETTING" | "RUNNING" | "CRASHED";
  crashPoint: number;
  startTime: Date;
  endTime: Date | null;
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}
