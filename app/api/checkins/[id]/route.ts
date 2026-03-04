import { NextResponse } from 'next/server'
import { db } from '@/db'
import { checkinPlaceIssues, checkinPlaces, checkins, issues, lab, photos, places, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ error: 'ID do check-in não informado' }, { status: 400 })
  }

  const data = await db
				.select({
					checkinId: checkins.id,
					date: checkins.date,
					userId: users.id,
					userName: users.name,
				})
				.from(checkins)
				.innerJoin(users, eq(users.id, checkins.userId))
				.where(eq(checkins.id, id))
		
		
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
				})
				.from(checkinPlaces)
				.where(eq(checkinPlaces.checkinId, id))
				.innerJoin(places, eq(places.id, checkinPlaces.placeId))
				.innerJoin(lab, eq(lab.id, places.labId))
				.leftJoin(photos, eq(photos.checkinPlaceId, checkinPlaces.id))
				.leftJoin(checkinPlaceIssues, eq(checkinPlaceIssues.checkinPlaceId, checkinPlaces.id))
				.leftJoin(issues, eq(checkinPlaceIssues.issueId, issues.id))

			const formatted = data.map((checkin) => {

				return {
					id: checkin.checkinId,
					date: checkin.date,
					user: {
						id: checkin.userId,
						name: checkin.userName,
					},
					checkinsPlaces
				}
			})
		
			return NextResponse.json(formatted)
}