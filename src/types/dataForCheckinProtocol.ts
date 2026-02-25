import { users, places, lab, issues } from '@/db/schema'

type User = typeof users.$inferSelect
type Place = typeof places.$inferSelect
type Lab = typeof lab.$inferSelect
type Issue = typeof issues.$inferSelect

export interface GetDataForCheckinProtocol {
  users: User[]
  places: Place[]
  labs: Lab[]
  issues: Issue[]
}
