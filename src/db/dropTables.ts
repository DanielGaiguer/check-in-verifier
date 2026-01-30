import { sql } from 'drizzle-orm';
import { db } from './index';

export async function dropTables() {
  console.log('🧹 Dropando todas as tabelas antigas...');
  await db.execute(sql`
    DROP TABLE IF EXISTS checkin_places_issues CASCADE;
    DROP TABLE IF EXISTS photos CASCADE;
    DROP TABLE IF EXISTS checkins CASCADE;
    DROP TABLE IF EXISTS places CASCADE;
    DROP TABLE IF EXISTS lab CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS issues CASCADE;
  `);

  console.log('✅ Banco limpo. Agora rode migrate e depois seed.');
}

dropTables().catch(console.error);
