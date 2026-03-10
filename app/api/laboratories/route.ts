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