import { NextResponse } from 'next/server'
import { db } from '@/db'
import {
  checkinAuditLogs,
  checkinPlaceIssues,
  checkinPlaces,
  checkins,
  issues,
  lab,
  photos,
  places,
  users,
} from '@/db/schema'
import { eq } from 'drizzle-orm'

interface CheckinPlaceFormatted {
  id: string
  checkinId: string
  place: string
  lab: string
  status: string
  observation: string | null
  issues: string[]
  photos: string[]
  lastActions: string[]
  lastReasons: string[]
  auditCreatedAt: Date[]
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json(
      { error: 'ID do check-in não informado' },
      { status: 400 }
    )
  }
	const formatted: CheckinPlaceFormatted[] = []

  const checkinsPlaces = await db
    .select({
      id: checkinPlaces.id,
      checkinId: checkinPlaces.checkinId,
      place: places.name,
      lab: lab.name,
      status: checkinPlaces.status,
      issues: issues.description,
      observation: checkinPlaces.observation,
      photos: photos.url,
      lastActions: checkinAuditLogs.action,
      lastReasons: checkinAuditLogs.reason,
      auditCreatedAt: checkinAuditLogs.createdAt,
    })
    .from(checkinPlaces)
    .where(eq(checkinPlaces.checkinId, id))
    .innerJoin(places, eq(places.id, checkinPlaces.placeId))
    .innerJoin(lab, eq(lab.id, places.labId))
    .leftJoin(photos, eq(photos.checkinPlaceId, checkinPlaces.id))
    .leftJoin(
      checkinPlaceIssues,
      eq(checkinPlaceIssues.checkinPlaceId, checkinPlaces.id)
    )
    .leftJoin(issues, eq(checkinPlaceIssues.issueId, issues.id))
    .leftJoin(checkinAuditLogs, eq(checkinAuditLogs.checkinId, id))

		
  checkinsPlaces.forEach((row) => {
    // Verifica se o lugar já existe no array
    let existing = formatted.find((p) => p.id === row.id)
    if (!existing) {
      existing = {
        id: row.id,
        checkinId: row.checkinId,
        place: row.place,
        lab: row.lab,
        status: row.status,
        observation: row.observation,
        issues: row.issues ? [row.issues] : [],
        photos: row.photos ? [row.photos] : [],
        lastActions: row.lastActions ? [row.lastActions] : [],
        lastReasons: row.lastReasons ? [row.lastReasons] : [],
        auditCreatedAt: row.auditCreatedAt ? [row.auditCreatedAt] : [],
      }
      formatted.push(existing)
    } else {
      // Adiciona novas issues/fotos se ainda não estiverem
      if (row.issues && !existing.issues.includes(row.issues)) {
        existing.issues.push(row.issues)
      }
      if (row.photos && !existing.photos.includes(row.photos)) {
        existing.photos.push(row.photos)
      }
    }
  })

  return NextResponse.json(formatted)
}
