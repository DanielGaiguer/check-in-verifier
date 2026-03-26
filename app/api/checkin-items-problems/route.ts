import { db } from "@/db"
import { checkinItemsProblems } from "@/db/schema"
import { NextResponse } from "next/server"

export async function GET() {
	let result
	try {
		result = await db.select().from(checkinItemsProblems)
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

export async function POST(req: Request) {
	const body = await req.json()

	if (!body.checkinItemId || !body.problemId) {
		return NextResponse.json(
			{
				success: false,
				error: 'Dados incompletos',
			},
			{ status: 400 }
		)
	}
	try {
		await db.insert(checkinItemsProblems).values({
			checkinItemId: body.checkinId,
			problemId: body.problemId
		})
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
		data: 'Dados do item do check-in criado com sucesso.',
	})
}
