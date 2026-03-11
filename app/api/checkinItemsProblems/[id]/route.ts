import { db } from "@/db"
import { checkinItemsProblems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request, context:{ params: Promise<{id: string}>}) {
	const { id } = await context.params
	let result
		try {
			result = await db.select().from(checkinItemsProblems).where(eq(checkinItemsProblems.checkinItemId, id))
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