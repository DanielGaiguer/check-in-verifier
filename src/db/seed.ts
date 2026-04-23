import { db } from './index'
import { units, laboratories, places, checkins } from './schema'

async function seed() {
  const unit = await db
    .insert(units)
    .values({
      name: 'Celso Charuri',
    })
    .returning()

  const unit2 = await db
    .insert(units)
    .values({
      name: 'Belém',
    })
    .returning()

  await db.update(laboratories).set({ unitId: unit[0].id})
  await db.update(checkins).set({ unitId: unit[0].id})
}

seed()
  .then(() => {
    console.log('Seed completo')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
