import { db } from '@/db'
import {
  laboratories,
  places,
  people,
  problems,
  checkins,
  checkinItems,
  checkinItemsProblems,
  checkinItemPhotos,
} from '@/db/schema'
import { v4 as uuid } from 'uuid'

async function seed() {
  // --- LABORATÓRIOS ---
  const labs = [
    { id: uuid(), name: 'Laboratório A' },
    { id: uuid(), name: 'Laboratório B' },
    { id: uuid(), name: 'Laboratório C' },
  ]

  for (const lab of labs) {
    await db.insert(laboratories).values(lab)
  }

  // --- LUGARES ---
  const placesData = []
  let sort = 1
  for (const lab of labs) {
    for (let i = 1; i <= 3; i++) {
      placesData.push({
        id: uuid(),
        labId: lab.id,
        name: `Lugar ${i} do ${lab.name}`,
        sortOrder: sort++,
      })
    }
  }

  for (const place of placesData) {
    await db.insert(places).values(place)
  }

  // --- PESSOAS ---
  const peopleData = [
    { id: uuid(), name: 'Daniel' },
    { id: uuid(), name: 'Ana' },
    { id: uuid(), name: 'João' },
    { id: uuid(), name: 'Maria' },
    { id: uuid(), name: 'Lucas' },
  ]

  for (const person of peopleData) {
    await db.insert(people).values(person)
  }

  // --- PROBLEMAS ---
  const problemsData = [
    { id: uuid(), name: 'Monitor quebrado' },
    { id: uuid(), name: 'Teclado sem tecla' },
    { id: uuid(), name: 'Cadeira quebrada' },
    { id: uuid(), name: 'Mesa instável' },
    { id: uuid(), name: 'Computador desligando' },
  ]

  for (const prob of problemsData) {
    await db.insert(problems).values(prob)
  }

  // --- CHECKINS ---
  const statusOptions = ['organized', 'disorganized', 'not_checked'] as const

  for (let i = 0; i < 20; i++) {
    const checkinId = uuid()
    const person = peopleData[Math.floor(Math.random() * peopleData.length)]

    // Converte Date para string YYYY-MM-DD
    const randomDate = new Date(
      Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
    )
    const checkinDate = randomDate.toISOString().split('T')[0]

    await db.insert(checkins).values({
      id: checkinId,
      peopleId: person.id,
      date: checkinDate,
      observation: `Observação do checkin ${i + 1}`,
    })

    // --- ITENS DE CHECKIN ---
    const placesForCheckin = placesData
      .sort(() => 0.5 - Math.random()) // randomiza
      .slice(0, Math.floor(Math.random() * 3) + 1) // 1 a 3 lugares por checkin

    for (const place of placesForCheckin) {
      const checkinItemId = uuid()
      const status =
        statusOptions[Math.floor(Math.random() * statusOptions.length)]

      await db.insert(checkinItems).values({
        id: checkinItemId,
        checkinId,
        placeId: place.id,
        status,
        observation: `Status ${status} no ${place.name}`,
      })

      // --- PROBLEMAS DO ITEM ---
      const hasProblem = Math.random() < 0.5
      if (hasProblem) {
        const problem =
          problemsData[Math.floor(Math.random() * problemsData.length)]
        const checkinItemProblemId = uuid()

        await db.insert(checkinItemsProblems).values({
          id: checkinItemProblemId,
          checkinItemId,
          problemId: problem.id,
        })

        // --- FOTOS ---
        const photoCount = Math.floor(Math.random() * 3) // até 2 fotos
        for (let p = 0; p < photoCount; p++) {
          await db.insert(checkinItemPhotos).values({
            id: uuid(),
            checkinItemProblemId,
            photoUrl: `https://picsum.photos/200/200?random=${Math.floor(
              Math.random() * 1000
            )}`,
          })
        }
      }
    }
  }

  console.log('Seed completa!')
}

seed()