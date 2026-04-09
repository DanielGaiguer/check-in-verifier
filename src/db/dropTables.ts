import { sql } from "drizzle-orm"
import { db } from "./index"

export async function dropTables() {
  console.log("🧹 Limpando banco de dados...")

  await db.execute(sql`
    DROP TABLE IF EXISTS checkin_item_photos CASCADE;
    DROP TABLE IF EXISTS checkin_items_problems CASCADE;
    DROP TABLE IF EXISTS checkin_items CASCADE;
    DROP TABLE IF EXISTS checkin_edits CASCADE;
    DROP TABLE IF EXISTS checkins CASCADE;
    DROP TABLE IF EXISTS place_problems CASCADE;
    DROP TABLE IF EXISTS places CASCADE;
    DROP TABLE IF EXISTS problems CASCADE;
    DROP TABLE IF EXISTS people CASCADE;
    DROP TABLE IF EXISTS laboratories CASCADE;
  `)

  // remover enum
  await db.execute(sql`
    DROP TYPE IF EXISTS checkin_status;
  `)

  // recriar schema public
  await db.execute(sql`
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
  `)

  console.log("✅ Banco limpo.")
  console.log("➡ Agora rode:")
  console.log("   1. npx drizzle-kit push  (ou migrate)")
  console.log("   2. npm run seed")
}

dropTables().catch((err) => {
  console.error("Erro ao limpar banco:", err)
})