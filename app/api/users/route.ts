import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
	const data = await db.select().from(users)

	return NextResponse.json(data)
}