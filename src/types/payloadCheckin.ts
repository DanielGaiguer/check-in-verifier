type UploadedImage = {
	url: string
	tempId: string
}

interface CheckinPlaceSubmit {
	placeId: string
	status: 'organized' | 'disorganized'
	observation?: string | null
	issues?: string[]
	photos?: UploadedImage[]
}

interface CheckinSubmit {
	date: string
	userId: string
	places: CheckinPlaceSubmit[]
}