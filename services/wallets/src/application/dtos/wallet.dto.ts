export interface CreateWalletDTO {
  userId: string;
}

export interface DepositMoneyDTO {
  userId: string;
  amount: number;
}

export interface WithdrawMoneyDTO {
  userId: string;
  amount: number;
}

export interface WalletResponseDTO {
  userId: string;
  balance: number;
  updatedAt: Date;
}