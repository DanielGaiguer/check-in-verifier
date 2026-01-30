import { db } from './index'
import { users, places, issues, lab } from './schema'
//import {dropTables} from './dropTables';


export async function seed() {
  //await dropTables();
  console.log('🌱 Iniciando seed...')

  /* ================================
     RESPONSÁVEIS
  ================================ */
  await db
    .insert(users)
    .values([{ name: 'João' }, { name: 'Maria' }, { name: 'Carlos' }])

  /* ================================
     SALAS / LABORATORIOS
  ================================ */
  await db.insert(lab).values([
    { name: 'lab 30' },
    { name: 'lab 31' },
  ])

  /* ================================
     places (BANCADAS + GAVETEIROS)
  ================================ */
  await db.insert(places).values([
    { name: 'Bancada 1', lab: 1 },
    { name: 'Bancada 2', lab: 1 },
    { name: 'Bancada 3', lab: 1 },
    { name: 'Gaveteiro A', lab: 2 },
    { name: 'Gaveteiro B', lab: 2 },
  ])

  /* ================================
     PROBLEMAS / CHECKS
  ================================ */
  await db.insert(issues).values([
    {
      code: 'FERRAMENTA_FALTANDO',
      description: 'Ferramenta faltando no local',
    },
    {
      code: 'DESORGANIZADO',
      description: 'Local desorganizado',
    },
    {
      code: 'SUJO',
      description: 'Local sujo',
    },
    {
      code: 'FORA_DO_PADRAO',
      description: 'Local fora do padrão definido',
    },
  ])

  console.log('✅ Seed finalizado com sucesso!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Erro ao rodar seed:', err)
  process.exit(1)
})
