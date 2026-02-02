import { db } from "@/db";
import { issues as schemaIssues, lab as schemaLab, places as schemaPlaces, users as schemaUsers } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
	const users = await db.select().from(schemaUsers)
	const labs = await db.select().from(schemaLab)
	const places = await db.select().from(schemaPlaces)
	const issues = await db.select().from(schemaIssues)
	
	return NextResponse.json({users, labs, places, issues})
}