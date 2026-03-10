import { db } from "@/db";
import { people } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	let response
	try{
		response = await db.select().from(people)
	}catch(e) {
		return NextResponse.json({
			success: false,
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: response,
		count: response.length
	})
}