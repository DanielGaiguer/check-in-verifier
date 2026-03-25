import { db } from '@/db'
import { places } from '@/db/schema'
import { and, eq, gte, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  if (!id || !body.labId || !body.name || !body.sortOrder) {
    return NextResponse.json(
      {
        success: false,
        error: 'Falta de informações do local não informado.',
      },
      { status: 400 }
    )
  }

  try {
    await db
      .update(places)
      .set({ sortOrder: sql`${places.sortOrder} + 1` })
      .where(
        and(eq(places.labId, body.labId), gte(places.sortOrder, body.sortOrder))
      )

    await db
      .update(places)
      .set({ name: body.name, sortOrder: body.sortOrder, labId: body.labId })
      .where(eq(places.id, id))
  } catch (e) {
    NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    data: `Local ${body.name} atualizado com sucesso.`,
  })
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: 'ID do local não informado.',
      },
      { status: 400 }
    )
  }
  try {
    await db.update(places).set({ active: false }).where(eq(places.id, id))
  } catch (e) {
    NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    data: `Local ${id} deletado com sucesso.`,
  })
}
