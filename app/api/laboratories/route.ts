import { db } from "@/db";
import { laboratories } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const labs = await db.select().from(laboratories)

	return NextResponse.json({
		success: true,
		data: labs,
		count: labs.length
	})
}

export async function POST(req: Request) {
	const body = await req.json()

	if (!body.name) {
		return NextResponse.json({success: false, error: "Nome do laboratório não informado"}, {status: 400})
	}

	try{
		await db.insert(laboratories).values({
			name: body.name
		}).returning()
	}catch(e) {
		console.log(e)
	}

	return NextResponse.json({ success: true })
}