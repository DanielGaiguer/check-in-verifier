// src/db/seed.ts

import { db } from "@/db"
import {
  laboratories,
  places,
  people,
  problems,
  placeProblems,
  checkins,
  checkinItems,
  checkinItemsProblems,
  checkinItemPhotos
} from "@/db/schema"

async function seed() {
  console.log("🌱 Iniciando seed...")

  // LABORATÓRIOS
  const [lab] = await db
    .insert(laboratories)
    .values({
      name: "Laboratório Central"
    })
    .returning()

  // PLACES
  const createdPlaces = await db
    .insert(places)
    .values([
      {
        labId: lab.id,
        name: "Bancada A",
        sortOrder: 1
      },
      {
        labId: lab.id,
        name: "Bancada B",
        sortOrder: 2
      }
    ])
    .returning()

  const placeA = createdPlaces[0]
  const placeB = createdPlaces[1]

  // PESSOAS
  const [person] = await db
    .insert(people)
    .values({
      name: "Alice"
    })
    .returning()

  // PROBLEMAS
  const createdProblems = await db
    .insert(problems)
    .values([
      {
        name: "Lâmpada Quebrada",
        description: "Lâmpada não funciona"
      },
      {
        name: "Mesa Suja",
        description: "Mesa com resíduos"
      }
    ])
    .returning()

  const lampProblem = createdProblems[0]
  const tableProblem = createdProblems[1]

  // RELAÇÃO PLACE -> PROBLEMS
  await db.insert(placeProblems).values([
    {
      placeId: placeA.id,
      problemId: lampProblem.id
    },
    {
      placeId: placeB.id,
      problemId: tableProblem.id
    }
  ])

  // CHECKIN
  const [checkin] = await db
    .insert(checkins)
    .values({
      peopleId: person.id,
      date: new Date().toISOString().slice(0, 10),
      observation: "Check-in diário"
    })
    .returning()

  // CHECKIN ITEM
  const [item] = await db
    .insert(checkinItems)
    .values({
      checkinId: checkin.id,
      placeId: placeA.id,
      status: "organized",
      observation: "Tudo organizado"
    })
    .returning()

  // CHECKIN ITEM PROBLEM
  const [itemProblem] = await db
    .insert(checkinItemsProblems)
    .values({
      checkinItemId: item.id,
      problemId: lampProblem.id
    })
    .returning()

  // FOTO DO PROBLEMA
  await db.insert(checkinItemPhotos).values({
    checkinItemProblemId: itemProblem.id,
    photoUrl: "https://placehold.co/600x400",
    sortOrder: 1
  })

  console.log("✅ Seed concluído com sucesso!")
}

seed()
  .catch((error) => {
    console.error("❌ Erro no seed:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })