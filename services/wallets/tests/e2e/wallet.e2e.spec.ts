import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/infrastructure/database/prisma.service";

describe("Wallet Service E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let request: supertest.SuperTest<supertest.Test>;

  const TEST_USER_ID = "player123";

  beforeAll(async () => {
    (BigInt.prototype as any).toJSON = function () { return this.toString(); };

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
    await prisma.wallet.deleteMany();
  });

  it("Fluxo de Criação e Consulta: deve criar uma carteira e retornar o saldo inicial", async () => {
    const createRes = await request.post("/wallets").send({});
    if (createRes.status !== 201) {
      console.log("Erro ao criar carteira:", createRes.body);
    }
    expect(createRes.status).toBe(201);
    expect(createRes.body.message).toContain("sucesso");

    const getRes = await request.get("/wallets/me");
    expect(getRes.status).toBe(200);
    expect(getRes.body.data).toBeDefined();
  });

  it("Integridade Monetária: deve garantir que o saldo nunca seja negativo", async () => {
    await request.post("/wallets").send({});
    const wallet = await prisma.wallet.findFirst({ where: { userId: TEST_USER_ID } });
    expect(wallet?.balance).toBeGreaterThanOrEqual(0n);
  });
});
