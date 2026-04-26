import { expect, test, describe } from "bun:test";
import { Money } from "../../src/domain/value-objects/money";

describe("Value Object Money", () => {
  test("deve criar Money a partir de centavos (BigInt)", () => {
    const money = Money.fromCents(10000n);

    expect(money.cents).toBe(10000n);
    expect(money.toDecimal()).toBe(100.0);
  });

  test("deve criar Money a partir de decimal (número)", () => {
    const money = Money.fromDecimal(100.5);

    expect(money.cents).toBe(10050n);
    expect(money.toDecimal()).toBe(100.5);
  });

  test("deve lançar erro para valores negativos (fromCents)", () => {
    expect(() => Money.fromCents(-100n)).toThrow("Money não pode ser negativo");
  });

  test("deve lançar erro para valores negativos (fromDecimal)", () => {
    expect(() => Money.fromDecimal(-50.0)).toThrow(
      "Money não pode ser negativo",
    );
  });

  test("deve lançar erro para NaN", () => {
    expect(() => Money.fromDecimal(NaN)).toThrow("Valor inválido");
  });

  test("deve somar dois Money corretamente", () => {
    const m1 = Money.fromCents(10000n);
    const m2 = Money.fromCents(5000n);
    const result = m1.add(m2);

    expect(result.cents).toBe(15000n);
  });

  test("deve subtrair dois Money corretamente", () => {
    const m1 = Money.fromCents(10000n);
    const m2 = Money.fromCents(5000n);
    const result = m1.subtract(m2);

    expect(result.cents).toBe(5000n);
  });

  test("deve lançar erro ao subtrair valor maior que disponível", () => {
    const m1 = Money.fromCents(5000n);
    const m2 = Money.fromCents(10000n);

    expect(() => m1.subtract(m2)).toThrow(
      "Operação resultaria em valor negativo",
    );
  });

  test("deve comparar Money com isGreaterThanOrEqual", () => {
    const m1 = Money.fromCents(10000n);
    const m2 = Money.fromCents(5000n);

    expect(m1.isGreaterThanOrEqual(m2)).toBe(true);
    expect(m2.isGreaterThanOrEqual(m1)).toBe(false);
  });

  test("deve comparar Money com equals", () => {
    const m1 = Money.fromCents(10000n);
    const m2 = Money.fromCents(10000n);
    const m3 = Money.fromCents(5000n);

    expect(m1.equals(m2)).toBe(true);
    expect(m1.equals(m3)).toBe(false);
  });

  test("deve comparar Money usando cents", () => {
    const m1 = Money.fromCents(5000n);
    const m2 = Money.fromCents(10000n);

    expect(m1.cents < m2.cents).toBe(true);
  });

  test("deve multiplicar Money por multiplicador (crash point)", () => {
    const bet = Money.fromCents(10000n);
    const multiplier = 2.5;
    const payoutCents = BigInt(Math.round(Number(bet.cents) * multiplier));
    const payout = Money.fromCents(payoutCents);

    expect(payout.cents).toBe(25000n);
  });

  test("deve multiplicar por 1.0 sem alterar", () => {
    const money = Money.fromCents(10000n);
    const payoutCents = BigInt(Math.round(Number(money.cents) * 1.0));
    const result = Money.fromCents(payoutCents);

    expect(result.equals(money)).toBe(true);
  });

  test("deve multiplicar por 0", () => {
    const money = Money.fromCents(10000n);
    const payoutCents = BigInt(Math.round(Number(money.cents) * 0));
    const result = Money.fromCents(payoutCents);

    expect(result.cents).toBe(0n);
  });

  test("deve converter para string formatado", () => {
    const money = Money.fromCents(10050n);
    const formatted = money.toString();

    expect(formatted).toBe("100.50");
  });

  test("deve serializar para JSON corretamente", () => {
    const money = Money.fromCents(10000n);
    const json = JSON.stringify({ amount: money.cents.toString() });

    expect(json).toBe('{"amount":"10000"}');
  });
});
