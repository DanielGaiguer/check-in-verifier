export type User = {
  id: string
  name: string
}

export type Checkin = {
  id: string
  date: string
	overallStatus: boolean
  userId: string
	createdAt: string
}

export type TodayCheckinResponse = {
  checkins: Checkin
  users: User
}[]
