import { db } from "@/db"
import { problems } from "@/db/schema"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

//GET /api/problems?active=true 
//GET /api/problems
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const activeOnly = url.searchParams.get("active") === "true"

    const result = await db
      .select()
      .from(problems)
      .where(activeOnly ? eq(problems.active, true) : undefined) // filtra ativos se pedido

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    })
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }
}

export async function POST(req: Request) {
  const body = await req.json()

  try {
    const result = await db
      .insert(problems)
      .values({ name: body.name })
      .returning()

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e,
      },
      { status: 400 }
    )
  }
}