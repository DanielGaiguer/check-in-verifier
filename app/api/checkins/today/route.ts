import { NextResponse } from 'next/server'
import { db } from '@/db'
import { checkins, users } from '@/db/schema'
import { eq } from 'drizzle-orm'


export async function GET() {
	const today = new Date().toISOString().split("T")[0];

  const isChecked = await db.select().from(checkins).innerJoin(users, eq(users.id, checkins.userId)).where(eq(checkins.date, today))

  return NextResponse.json(isChecked)
}
