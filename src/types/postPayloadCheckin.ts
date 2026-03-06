export type UploadedImage = {
	url: string
	tempId: string
}

export interface CheckinPlaceSubmit {
	placeId: string
	status: 'organized' | 'disorganized'
	observation?: string | null
	issues?: string[]
	photos?: UploadedImage[]
}

export interface CheckinSubmit {
	date: string
	userId: string
	places: CheckinPlaceSubmit[]
}