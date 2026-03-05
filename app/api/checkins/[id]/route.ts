import { NextResponse } from "next/server";
import { db } from "@/db";
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
} from "@/db/schema";
import { eq } from "drizzle-orm";

interface CheckinPlaceFormatted {
  id: string;
  checkinId: string;
  place: string;
  lab: string;
  status: string;
  observation?: string | null;
  issues: string[];
  photos: string[];
  lastActions: string[];
  lastReasons: string[];
  auditCreatedAt: Date[];
}

type CheckinData = {
  userName: string;
  date: string; 
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do check-in não informado" },
      { status: 400 }
    );
  }

  // 1️⃣ Buscar dados do check-in e usuário
  const checkinArray = await db
    .select({
      userName: users.name,
      date: checkins.date,
    })
    .from(checkins)
    .innerJoin(users, eq(users.id, checkins.userId))
    .where(eq(checkins.id, id))
    .limit(1) // garante apenas 1 registro
    .execute(); // ✅ tipagem correta


  const checkinData = checkinArray[0] as CheckinData | undefined;
  if (!checkinData) {
    return NextResponse.json(
      { error: "Check-in não encontrado" },
      { status: 404 }
    );
  }

  // 2️⃣ Buscar os locais, issues, fotos e auditoria
  const checkinsPlacesRows = await db
    .select({
      id: checkinPlaces.id,
      checkinId: checkinPlaces.checkinId,
      place: places.name,
      lab: lab.name,
      status: checkinPlaces.status,
      observation: checkinPlaces.observation,
      issues: issues.description,
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
    .leftJoin(checkinPlaceIssues, eq(checkinPlaceIssues.checkinPlaceId, checkinPlaces.id))
    .leftJoin(issues, eq(checkinPlaceIssues.issueId, issues.id))
    .leftJoin(checkinAuditLogs, eq(checkinAuditLogs.checkinId, id))
    .execute(); // você pode criar um tipo mais detalhado se quiser

  // 3️⃣ Formatar locais e arrays únicos
  const formattedPlaces: CheckinPlaceFormatted[] = [];
  checkinsPlacesRows.forEach((row) => {
    let existing = formattedPlaces.find((p) => p.id === row.id);
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
      };
      formattedPlaces.push(existing);
    } else {
      const pushUnique = <T>(arr: T[], val: T | null | undefined) => {
        if (val != null && !arr.includes(val)) arr.push(val);
      };
      pushUnique(existing.issues, row.issues);
      pushUnique(existing.photos, row.photos);
      pushUnique(existing.lastActions, row.lastActions);
      pushUnique(existing.lastReasons, row.lastReasons);
      pushUnique(existing.auditCreatedAt, row.auditCreatedAt);
    }
  });

  // 4️⃣ Retornar JSON final
  return NextResponse.json({
    checkin: {
      user: checkinData.userName,
      date: checkinData.date,
    },
    places: formattedPlaces,
  });
}