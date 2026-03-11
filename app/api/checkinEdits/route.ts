import { db } from "@/db"
import { checkinEdits } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
	const body = await req.json()
	if (!body.checkinId) {
		return NextResponse.json(
			{
				success: false,
				error: 'Dados incompletos',
			},
			{ status: 400 }
		)
	}
	let result
	try {
		result = await db
			.select()
			.from(checkinEdits)
			.where(
				eq(checkinEdits.checkinId, body.checkinId)
			)
	} catch (e) {
		return NextResponse.json(
			{
				success: false,
				error: e,
			},
			{ status: 400 }
		)
	}

	return NextResponse.json({
		success: true,
		data: result,
	})
}

