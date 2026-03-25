import { db } from "@/db"
import { people } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, context: {params: Promise<{id: string}> }) {
	const { id } = await context.params
	const body = await req.json()

	if (!id) {
		return NextResponse.json({
			success: false, 
			error: "ID da pessoa não informado."
		}, {status: 400})
	}

	if (!body.name) {
		return NextResponse.json({
			success: false, 
			error: "Novo nome da pessoa não informado."
		}, {status: 400})
	}

	try{
		await db.update(people).set({name: body.name}).where(eq(people.id, id))
	}catch(e) {
		return NextResponse.json({
			success: false,
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: `Pessoa ID ${id} alterada com sucesso`
	})
}

export async function DELETE(req: Request, context: {params: Promise<{id: string}>}) {
	const { id } = await context.params

	if (!id) {
		return NextResponse.json({
			success: false, 
			error: "ID da pessoa não informado."
		}, {status: 400})
	}

	try{
		await db.update(people).set({ active: false}).where(eq(people.id, id))
	}catch(e) {
		return NextResponse.json({
			success: false, 
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: `Pessoa ${id} deletada com sucesso`
	})
}