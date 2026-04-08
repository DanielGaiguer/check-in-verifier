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
  // --- LABORATÓRIOS REALISTAS ---
  const labs = [
    { id: uuid(), name: 'Laboratório de Informática' },
    { id: uuid(), name: 'Laboratório de Química' },
    { id: uuid(), name: 'Laboratório de Física' },
  ]

  for (const lab of labs) {
    await db.insert(laboratories).values(lab)
  }

  // --- LUGARES (Salas / Bancadas) ---
  const placesData = []
  const labPlacesMap: Record<string, string[]> = {
    'Laboratório de Informática': [
      'Bancada 1',
      'Bancada 2',
      'Bancada 3',
      'Sala de Servidores',
    ],
    'Laboratório de Química': [
      'Bancada A',
      'Bancada B',
      'Bancada C',
      'Sala de Reagentes',
    ],
    'Laboratório de Física': [
      'Mesa X',
      'Mesa Y',
      'Mesa Z',
      'Sala de Experimentos',
    ],
  }

  let sort = 1
  for (const lab of labs) {
    for (const placeName of labPlacesMap[lab.name]) {
      placesData.push({
        id: uuid(),
        labId: lab.id,
        name: `${placeName} do ${lab.name}`,
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

  // --- PROBLEMAS LIGADOS A LABORATÓRIOS ---
  const problemsData = [
    // Informática
    { id: uuid(), name: 'Monitor quebrado' },
    { id: uuid(), name: 'Teclado com tecla faltando' },
    { id: uuid(), name: 'Mouse não funcionando' },
    // Química
    { id: uuid(), name: 'Reagente vencido' },
    { id: uuid(), name: 'Bancada suja' },
    { id: uuid(), name: 'Vidraria quebrada' },
    // Física
    { id: uuid(), name: 'Equipamento descalibrado' },
    { id: uuid(), name: 'Cabo solto' },
    { id: uuid(), name: 'Sensor com defeito' },
  ]

  for (const prob of problemsData) {
    await db.insert(problems).values(prob)
  }

  // --- CHECKINS ---
  const statusOptions = ['organized', 'disorganized', 'not_checked'] as const

  for (let i = 0; i < 15; i++) {
    const checkinId = uuid()
    const person = peopleData[Math.floor(Math.random() * peopleData.length)]

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
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 1) // 1 a 4 lugares por checkin

    for (const place of placesForCheckin) {
      const checkinItemId = uuid()
      const status =
        statusOptions[Math.floor(Math.random() * statusOptions.length)]

      await db.insert(checkinItems).values({
        id: checkinItemId,
        checkinId,
        placeId: place.id,
        status,
        observation: `Status ${status} em ${place.name}`,
      })

      // --- PROBLEMAS DO ITEM ---
      const labName = labs.find((lab) => lab.id === place.labId)?.name
      const relatedProblems = problemsData.filter((p) =>
        labName?.includes('Informática')
          ? [
              'Monitor quebrado',
              'Teclado com tecla faltando',
              'Mouse não funcionando',
            ].includes(p.name)
          : labName?.includes('Química')
            ? [
                'Reagente vencido',
                'Bancada suja',
                'Vidraria quebrada',
              ].includes(p.name)
            : labName?.includes('Física')
              ? [
                  'Equipamento descalibrado',
                  'Cabo solto',
                  'Sensor com defeito',
                ].includes(p.name)
              : []
      )

      const hasProblem = Math.random() < 0.5
      if (hasProblem && relatedProblems.length > 0) {
        const problem =
          relatedProblems[Math.floor(Math.random() * relatedProblems.length)]
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
            checkinItemId,
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
