import { db } from "@/db";
import { issue, lab, place, user } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
	const users = await db.select().from(user)
	const labs = await db.select().from(lab)
	const places = await db.select().from(place)
	const issues = await db.select().from(issue)
	
	return NextResponse.json({users, labs, places, issues})
}