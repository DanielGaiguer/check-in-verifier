import { db } from "@/db";
import { places } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context:{ params: Promise<{id: string}>}) {
	const {id: placeId} = await context.params

	const data = await db.select().from(places).where(eq(places.id, placeId))

	if (data.length === 0) {
		return NextResponse.json({ message: "Local não encontrado" }, { status: 404 });
	}

	await db.delete(places).where(eq(places.id, placeId))

	return NextResponse.json({ message: `Local ${data[0].name} deletado com sucesso` }, { status: 200 });
}

export async function GET(req: NextRequest, context: {params: Promise<{id: string}>}) {
	const {id: placeId} = await context.params
	const data = await db.select().from(places).where(eq(places.id, placeId))

	return NextResponse.json(data)
}