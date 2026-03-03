import { db } from "@/db"
import { checkinPlaces } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

	const checkinId = searchParams.get("id")

	const data = await db.select().from(checkinPlaces).where(eq(checkinPlaces.checkinId, checkinId??""))

	return NextResponse.json(data)
}