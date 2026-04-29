import { apiFetch } from "@/lib/api"
import { WalletBalance, DepositMoneyDTO } from "../_types/Wallet"

export const walletService = {
  async getBalance(token: string): Promise<WalletBalance> {
    return apiFetch<WalletBalance>("/wallets/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  async createWallet(token: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>("/wallets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  async deposit(
    token: string,
    dto: DepositMoneyDTO
  ): Promise<{ message: string }> {
    console.log(token);
    
    return apiFetch<{ message: string }>("/wallets/deposit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })
  },
}
