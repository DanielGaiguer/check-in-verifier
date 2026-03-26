// app/api/places/reorder/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db' // seu client do Drizzle ORM ou Prisma
import { places } from '@/db/schema' // tabela de lugares
import { Place } from '@/types/place'
import { eq } from 'drizzle-orm'


export async function POST(req: Request) {
  try {
    const { places: updatedPlaces } = await req.json() as { places: Place[] }

    for (const place of updatedPlaces) {
      await db.update(places)
        .set({ sortOrder: place.sortOrder })
        .where(eq(places.id, place.id))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Erro ao atualizar ordem' }, { status: 400 })
  }
}