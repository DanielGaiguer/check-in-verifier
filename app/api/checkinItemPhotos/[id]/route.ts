import { db } from "@/db"
import { checkinItemPhotos } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

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