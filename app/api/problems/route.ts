import { db } from "@/db"
import { problems } from "@/db/schema"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
	try{
		const result =  await db.select().from(problems)

		return NextResponse.json({
			success: true,
			data: result,
			count: result.length
		})
	}catch(e) {
		return NextResponse.json({
			success: false,
			error: e
		}, {status: 400})
	}
}

export async function POST(req: Request) {
	const body = await req.json()

	let result

	try{
		result = await db.insert(problems).values({name: body.name}).returning()
	}catch(e) {
		return NextResponse.json({
			success: false,
			error: e
		}, { status: 400})		
	}

	return NextResponse.json({
		success: true,
		data: result[0]
	})
}