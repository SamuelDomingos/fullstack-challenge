import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/infrastructure/database/prisma.service";
import { ProvablyFair } from "../../src/domain/entities/ProvablyFair";

describe("Game Service E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let request: any;

  const TEST_USER_ID = "player123";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use((req: any, res: any, next: any) => {
      req.user = { sub: TEST_USER_ID };
      next();
    });

    await app.init();
    prisma = app.get(PrismaService);
    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.bet.deleteMany();
    await prisma.round.deleteMany();
  });

  it("Fluxo de Aposta: deve aceitar a aposta e colocá-la como PENDING", async () => {
    const seed = ProvablyFair.createSeed("test-client-seed", 1);
    const crashPoint = ProvablyFair.calculateCrashPoint(seed);

    await prisma.round.create({
      data: {
        status: "BETTING",
        crashPoint: crashPoint,
        startTime: new Date(),
        serverSeed: seed.serverSeed,
        serverSeedHash: seed.serverSeedHash,
        clientSeed: seed.clientSeed,
        nonce: seed.nonce,
      },
    });

    const response = await request.post("/games/bet").send({
      amount: "100",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("PENDING");
  });

  it("Validação de Regras: não deve permitir aposta se a rodada não estiver em BETTING", async () => {
    const seed = ProvablyFair.createSeed("test-client-seed", 1);
    const crashPoint = ProvablyFair.calculateCrashPoint(seed);

    await prisma.round.create({
      data: {
        status: "RUNNING",
        crashPoint: crashPoint,
        startTime: new Date(),
        serverSeed: seed.serverSeed,
        serverSeedHash: seed.serverSeedHash,
        clientSeed: seed.clientSeed,
        nonce: seed.nonce,
      },
    });

    const response = await request.post("/games/bet").send({
      amount: "100",
    });

    expect(response.status).not.toBe(201);
  });

  it("Fluxo de Cashout: deve permitir sacar durante a rodada RUNNING", async () => {
    const seed = ProvablyFair.createSeed("test-client-seed", 1);
    const crashPoint = ProvablyFair.calculateCrashPoint(seed);

    const round = await prisma.round.create({
      data: {
        status: "RUNNING",
        crashPoint: crashPoint,
        startTime: new Date(),
        serverSeed: seed.serverSeed,
        serverSeedHash: seed.serverSeedHash,
        clientSeed: seed.clientSeed,
        nonce: seed.nonce,
      },
    });

    await prisma.bet.create({
      data: {
        userId: TEST_USER_ID,
        roundId: round.id,
        amount: 10000n,
        status: "PENDING",
      },
    });

    const response = await request.post("/games/bet/cashout").send({
      roundId: round.id,
      cashoutAmount: "100",
    });

    if (response.status !== 201) {
      console.log("DEBUG - Erro no Cashout:", JSON.stringify(response.body, null, 2));
    }
    expect(response.status).toBe(201);
  });
});
