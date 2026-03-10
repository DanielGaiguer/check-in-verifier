import { db } from "@/db"
import { laboratories } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, context: { params: Promise<{id: string}> }) {
	const { id } = await context.params
	const body = await req.json()

	if (!id) {
		return NextResponse.json({
			success: false,
			error: "ID do laboratório não informado."
		}, {status: 400})
	}

	try{
		await db.update(laboratories).set({name: body.name}).where(eq(laboratories.id, id)).returning()
	}catch(e) {
		NextResponse.json({
			success: false,
			error: e
		}, { status: 400})
	}

	return NextResponse.json({
		success: true,
		data: `Laboratório ${id} alterado com sucesso.`
	})

}

export async function DELETE(req: Request, context: { params: Promise<{id: string}> }) {
	const { id } = await context.params

	if (!id) {
		NextResponse.json({
			success: false,
			error: "ID do laboratório não informado."
		}, { status: 400 })
	}

	try{
		await db.delete(laboratories).where(eq(laboratories.id, id))
	}catch(e) {
		return NextResponse.json({
			success: false, 
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: `Laboratório ${id} deletado com sucesso.`
	})
}