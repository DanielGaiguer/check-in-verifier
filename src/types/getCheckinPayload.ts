
export interface CheckinPlaceFormatted {
	id: string
	checkinId: string
	place: string
	placeId: string
	lab: string
	status: 'organized' | 'disorganized'
	observation: string | null
	issues: string[]
	photos: string[]
	lastActions: string[]
	lastReasons: string[]
	auditCreatedAt: Date[]
}

export type CreateCheckinInput = {
	date: string
	userId: string
	places: {
		placeId: string
		status: 'organized' | 'disorganized'
		issues?: string[]
		photos?: string[]
		observation?: string
	}[]
}

export type CheckinData = {
	user: string
	userId: string
	date: string
}

export type checkinPayload = {
	checkin: CheckinData
	places: CheckinPlaceFormatted[]
}