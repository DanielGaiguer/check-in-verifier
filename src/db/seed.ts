import { db } from './index'
import { users, places, issues, lab } from './schema'

export async function seed() {
  console.log('🌱 Iniciando seed...')

  /* ================================
     LABS
  ================================ */
  const insertedLabs = await db
    .insert(lab)
    .values([
      { name: 'lab 30' },
      { name: 'lab 31' },
    ])
    .returning()

  const lab30 = insertedLabs.find(l => l.name === 'lab 30')!
  const lab31 = insertedLabs.find(l => l.name === 'lab 31')!

  /* ================================
     USERS
  ================================ */
  await db.insert(users).values([
    { name: 'João' },
    { name: 'Maria' },
    { name: 'Carlos' },
  ])

  /* ================================
     PLACES
  ================================ */
  await db.insert(places).values([
    { name: 'Bancada 1', labId: lab30.id },
    { name: 'Bancada 2', labId: lab30.id },
    { name: 'Bancada 3', labId: lab30.id },
    { name: 'Gaveteiro A', labId: lab31.id },
    { name: 'Gaveteiro B', labId: lab31.id },
  ])

  /* ================================
     ISSUES
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
