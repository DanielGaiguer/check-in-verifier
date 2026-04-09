import { db } from '@/db'
import { checkinItemPhotos } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  context: { params: Record<string, string> }
) {
  const id = context.params.id

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'ID da pasta não informado.' },
      { status: 400 }
    )
  }

  try {
    const photos = await db
      .select()
      .from(checkinItemPhotos)
      .where(eq(checkinItemPhotos.checkinItemId, id))

    return NextResponse.json({
      success: true,
      data: photos,
      count: photos.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Record<string, string> }
) {
  const id = context.params.id

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'ID da foto não informado.' },
      { status: 400 }
    )
  }

  try {
    await db.delete(checkinItemPhotos).where(eq(checkinItemPhotos.id, id))
    return NextResponse.json({
      success: true,
      data: 'Foto deletada com sucesso.',
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}