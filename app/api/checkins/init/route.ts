import { db } from "@/db";
import { issues, lab, places, users } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
	const dataUsers = await db.select().from(users)
	const dataLabs = await db.select().from(lab)
	const dataPlaces = await db.select().from(places)
	const dataIssues = await db.select().from(issues)
	
	return NextResponse.json({dataUsers, dataLabs, dataPlaces, dataIssues})
}