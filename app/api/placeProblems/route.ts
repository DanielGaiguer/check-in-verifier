import { db } from "@/db";
import { placeProblems } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(){
	let result
	try{
		result = await db.select().from(placeProblems)
	}catch(e) {
		return NextResponse.json({
			success: false,
			error: e 
		}, {status: 400})
	}

	return NextResponse.json({
		success: true,
		data: result
	})
}

