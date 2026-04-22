import { db } from '@/db'
import { laboratories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

//Formato da requisição:
//http://localhost:3000/api/laboratories/9bffbb93-4c45-47cc-ab33-e6bd96fcb5ce

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
        error: 'ID do laboratório não informado.',
      },
      { status: 400 }
    )
  }

  if (!body.name || !body.unitId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Novo nome do laboratório não informado.',
      },
      { status: 400 }
    )
  }

  try {
    await db
      .update(laboratories)
      .set({ name: body.name, unitId: body.unitId})
      .where(eq(laboratories.id, id))
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
    data: `Laboratório ${id} alterado com sucesso.`,
  })
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    NextResponse.json(
      {
        success: false,
        error: 'ID do laboratório não informado.',
      },
      { status: 400 }
    )
  }

  try {
    await db
      .update(laboratories)
      .set({ active: false })
      .where(eq(laboratories.id, id))
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
    data: `Laboratório ${id} deletado com sucesso.`,
  })
}
