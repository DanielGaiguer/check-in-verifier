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

export async function POST(req: Request) {
	const body = await req.json()

	try{
		const values = body.problemId.map((problemId: string) => ({
      placeId: body.placeId,
      problemId
    }))

    await db.insert(placeProblems).values(values)

    return NextResponse.json({
      success: true
    })
		
	}catch(e) {
		return NextResponse.json({
			success: false,
			error: e 
		}, {status: 400})
	}
}