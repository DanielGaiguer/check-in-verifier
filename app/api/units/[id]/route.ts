import { db } from '@/db'
import { units } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: 'ID da unidade não informado.',
      },
      { status: 400 }
    )
  }

  if (!body.name) {
    return NextResponse.json(
      {
        success: false,
        error: 'Novo nome da unidade não informado.',
      },
      { status: 400 }
    )
  }

  try {
    await db.update(units).set({ name: body.name }).where(eq(units.id, id))
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    data: `Unidade ID ${id} alterada com sucesso`,
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
        error: 'ID da pessoa não informado.',
      },
      { status: 400 }
    )
  }

  try {
    await db.update(units).set({ active: false }).where(eq(units.id, id))
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    data: `Unidade ${id} deletada com sucesso`,
  })
}
