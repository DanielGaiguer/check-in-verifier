import { db } from "@/db"
import { problems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, context:{ params: Promise<{id: string}>}) {
	const { id } = await context.params
	const body = await req.json()

	if (!body.name || !body.description) {
		NextResponse.json({
			success: false,
			error: "Dados para atualização estão faltando."
		})
	}
	try{
		await db.update(problems).set({name: body.name, description: body.description}).where(eq(problems.id, id))
	}catch(e) {
		NextResponse.json({
			success: false,
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: `Problema ${body.name} atualizado com sucesso`
	})
}

export async function DELETE(req: Request, context:{ params: Promise<{ id: string}> }) {
	const { id } = await context.params
	
	try{
		await db.delete(problems).where(eq(problems.id, id))
	}catch(e) {
		NextResponse.json({
			success: false,
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: `Problema id ${id} deletado com sucesso.`
	})
}