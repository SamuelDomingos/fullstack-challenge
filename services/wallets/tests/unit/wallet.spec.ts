import { expect, test, describe } from "bun:test";
import { Wallet } from "../../src/domain/entities/wallet";
import { Money } from "../../src/domain/value-objects/money";

describe("Entidade Wallet", () => {
  test("deve depositar dinheiro com sucesso", () => {
    const wallet = new Wallet({
      userId: "user-1",
      balance: Money.fromCents(1000n),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const depositAmount = Money.fromCents(500n);

    wallet.deposit(depositAmount);

    expect(wallet.balance.cents).toBe(1500n);
  });

  test("deve lançar erro ao sacar mais do que o saldo disponível", () => {
    const wallet = new Wallet({
      userId: "user-1",
      balance: Money.fromCents(1000n),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const withdrawAmount = Money.fromCents(2000n);

    expect(() => wallet.withdraw(withdrawAmount)).toThrow(
      "Operação resultaria em valor negativo",
    );
  });

  test("deve sacar dinheiro com sucesso", () => {
    const wallet = new Wallet({
      userId: "user-1",
      balance: Money.fromCents(1000n),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const withdrawAmount = Money.fromCents(400n);

    wallet.withdraw(withdrawAmount);

    expect(wallet.balance.cents).toBe(600n);
  });
});
