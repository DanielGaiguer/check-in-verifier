import { db } from "@/db"
import { checkinEdits } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const checkinId = searchParams.get('checkinId')

  if (!checkinId) {
    return NextResponse.json(
      { success: false, error: 'Dados incompletos' },
      { status: 400 }
    )
  }

  try {
    const result = await db
      .select()
      .from(checkinEdits)
      .where(eq(checkinEdits.checkinId, checkinId))

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e },
      { status: 400 }
    )
  }
}

export async function POST(req: Request) {
	const body = await req.json()

	if (!body.checkinId || !body.editedBy || !body.reason) {
		return NextResponse.json(
			{
				success: false,
				error: 'Dados incompletos',
			},
			{ status: 400 }
		)
	}
	try {
		await db.insert(checkinEdits).values({
			checkinId: body.checkinId,
			editedBy: body.editedBy,
			reason: body.reason,
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

	return NextResponse.json({
		success: true,
		data: 'Alteracao do check-in criado com sucesso.',
	})
}