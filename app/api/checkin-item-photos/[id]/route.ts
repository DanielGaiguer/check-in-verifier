import { db } from "@/db"
import { checkinItemPhotos } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'ID da pasta não informado.' },
      { status: 400 }
    )
  }

  try {
    // Busca todas as fotos do checkinItemProblemId
    const photos = await db
      .select()
      .from(checkinItemPhotos)
      .where(eq(checkinItemPhotos.checkinItemProblemId, id))

    return NextResponse.json({
      success: true,
      data: photos,
      count: photos.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    )
  }
}


export async function DELETE(req: Request, context: { params: Promise<{id: string}>}) {
	const { id } = await context.params

	try {
		await db.delete(checkinItemPhotos).where(eq(checkinItemPhotos.id, id))
	} catch (e) {
		return NextResponse.json({
			success: false, 
			error: e
		}, { status: 400})
	}

	return NextResponse.json({
		success: true,
		data: "Foto deletada com sucesso."
	})
}