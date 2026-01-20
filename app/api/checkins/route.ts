import { NextResponse } from "next/server";
import { db } from "@/db";
import { checkins } from "@/db/schema";

export async function GET() {
  const data = await db.select().from(checkins);
  return NextResponse.json(data);
}
