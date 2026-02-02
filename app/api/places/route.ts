import { db } from "@/db"
import { places } from "@/db/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request){
	const body = await req.json()

	await db.insert(places).values({ 
		name: body.name,
		labId: body.labId,
	}).returning()

	return NextResponse.json({ok: true})
}

export async function GET() {
	const response = await db.select().from(places)

	return NextResponse.json(response)
}

