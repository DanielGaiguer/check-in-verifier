import { db } from "@/db";
import { people } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	let response
	try{
		response = await db.select().from(people)
	}catch(e) {
		return NextResponse.json({
			success: false,
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: response,
		count: response.length
	})
}

export async function POST(req: Request) {
	const body = await req.json()
	
	if (!body.name) {
		return NextResponse.json({
			success: false,
			error: "Nome da pessoa não informado"
		}, {status: 400})
	}

	try{
		await db.insert(people).values({name: body.name})
	}catch(e) {
		NextResponse.json({
			success: false,
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: `Pessoa ${body.name} criada com sucesso`
	})
}