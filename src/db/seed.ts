import { db } from "./index";
import {
  users,
  places,
  issues,
} from "./schema";

async function seed() {
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
    { name: "Bancada 1" },
    { name: "Bancada 2" },
    { name: "Bancada 3" },
    { name: "Gaveteiro A" },
    { name: "Gaveteiro B" },
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