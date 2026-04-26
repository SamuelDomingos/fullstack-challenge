import { expect, test, describe } from "bun:test";
import { Bet } from "../../src/domain/entities/Bet";
import { Multiplier } from "../../src/domain/value-objects/Multiplier";

describe("Entidade Bet", () => {
  test("deve criar uma aposta com valores válidos", () => {
    const bet = new Bet({
      id: "bet-1",
      userId: "user-1",
      roundId: "round-1",
      amount: 100n,
      multiplierAtCashout: null,
      status: "PENDING",
    });

    expect(bet.toJSON().id).toBe("bet-1");
    expect(bet.toJSON().status).toBe("PENDING");
    expect(bet.toJSON().amount).toBe(100n);
  });

  test("deve transitar para WON após cashout", () => {
    const bet = new Bet({
      id: "bet-1",
      userId: "user-1",
      roundId: "round-1",
      amount: 100n,
      multiplierAtCashout: null,
      status: "PENDING",
    });

    bet.cashout(Multiplier.fromValue(2.5));

    expect(bet.toJSON().status).toBe("WON");
    expect(bet.toJSON().multiplierAtCashout).toBe(2.5);
  });

  test("deve marcar aposta como perdida", () => {
    const bet = new Bet({
      id: "bet-1",
      userId: "user-1",
      roundId: "round-1",
      amount: 100n,
      multiplierAtCashout: null,
      status: "PENDING",
    });

    bet.markAsLost();
    expect(bet.toJSON().status).toBe("LOST");
  });

  test("não deve permitir cashout se não estiver PENDING", () => {
    const bet = new Bet({
      id: "bet-1",
      userId: "user-1",
      roundId: "round-1",
      amount: 100n,
      multiplierAtCashout: null,
      status: "LOST",
    });

    expect(() => bet.cashout(Multiplier.fromValue(2.0))).toThrow(
      "Aposta já foi finalizada ou não está pendente",
    );
  });
});
