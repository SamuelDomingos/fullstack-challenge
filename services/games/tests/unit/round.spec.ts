import { expect, test, describe } from "bun:test";
import { Round } from "../../src/domain/entities/Round";

describe("Entidade Round", () => {
  const clientSeed = "test-client-seed";
  const nonce = 1;

  test("deve criar uma rodada no estado BETTING", () => {
    const round = Round.create(clientSeed, nonce);
    expect(round.status).toBe("BETTING");
    expect(round.canAcceptBets()).toBe(true);
  });

  test("deve transitar de BETTING para RUNNING", () => {
    const round = Round.create(clientSeed, nonce);
    round.startRound();
    expect(round.status).toBe("RUNNING");
    expect(round.canAcceptBets()).toBe(false);
  });

  test("deve transitar de RUNNING para CRASHED", () => {
    const round = Round.create(clientSeed, nonce);
    round.startRound();
    round.crash();
    expect(round.status).toBe("CRASHED");
  });

  test("não deve permitir startRound se não estiver em BETTING", () => {
    const round = Round.create(clientSeed, nonce);
    round.startRound();
    expect(() => round.startRound()).toThrow("A rodada só pode começar se estiver na fase de apostas (BETTING)");
  });

  test("não deve permitir crash se não estiver em RUNNING", () => {
    const round = Round.create(clientSeed, nonce);
    expect(() => round.crash()).toThrow("A rodada não está ativa para sofrer crash");
  });

  test("não deve permitir revelar seed antes do crash", () => {
    const round = Round.create(clientSeed, nonce);
    expect(() => round.revealSeed()).toThrow("O serverSeed só pode ser revelado após o crash");

    round.startRound();
    expect(() => round.revealSeed()).toThrow("O serverSeed só pode ser revelado após o crash");

    round.crash();
    expect(() => round.revealSeed()).not.toThrow();
  });

  test("deve gerar um crash point válido", () => {
    const round = Round.create(clientSeed, nonce);
    expect(round.crashPoint).toBeGreaterThanOrEqual(1.0);
  });
});
