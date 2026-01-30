import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  users,
  places,
  issues,
} from "./schema";

async function resetDatabase() {
  console.log('🧹 Limpando banco de dados...')

  // IMPORTANTE: ordem importa por causa de FK
  await db.execute(sql`TRUNCATE TABLE checkins RESTART IDENTITY CASCADE`)
  await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`)

  console.log('✅ Banco limpo')
}

async function seed() {
  //resetDatabase();
  console.log("🌱 Iniciando seed...");

  /* ================================
     RESPONSÁVEIS
  ================================ */
  await db.insert(users).values([
    { name: "João" },
    { name: "Maria" },
    { name: "Carlos" },
  ]);

  /* ================================
     places (BANCADAS + GAVETEIROS)
  ================================ */
  await db.insert(places).values([
    { name: "Bancada 1", lab: '30' },
    { name: "Bancada 2", lab: '30' },
    { name: "Bancada 3", lab: '31' },
    { name: "Gaveteiro A", lab: '31' },
    { name: "Gaveteiro B", lab: '31' },
  ]);

  /* ================================
     PROBLEMAS / CHECKS
  ================================ */
  await db.insert(issues).values([
    {
      code: "FERRAMENTA_FALTANDO",
      description: "Ferramenta faltando no local",
    },
    {
      code: "DESORGANIZADO",
      description: "Local desorganizado",
    },
    {
      code: "SUJO",
      description: "Local sujo",
    },
    {
      code: "FORA_DO_PADRAO",
      description: "Local fora do padrão definido",
    },
  ]);

  console.log("✅ Seed finalizado com sucesso!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro ao rodar seed:", err);
  process.exit(1);
});