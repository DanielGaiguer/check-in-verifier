import { db } from "@/db"
import { places } from "@/db/schema"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
	let response

	try{
		response = await db.select().from(places)
	}catch(e){
		NextResponse.json({
			success: false,
			error: e
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: response
	})
} 