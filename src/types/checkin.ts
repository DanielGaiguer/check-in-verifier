export type User = {
  id: string
  name: string
}

export type Checkin = {
  id: string
  date: string
	//verallStatus: boolean
  userId: string
	createdAt: string
}

export interface TodayCheckinResponse {
  id: string
  date: string
  user: {
    id: string
    name: string
  }
  overallStatus: boolean
}
