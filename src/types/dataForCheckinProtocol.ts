import { user, place, lab, issue } from '@/db/schema'

type User = typeof user.$inferSelect
type Place = typeof place.$inferSelect
type Lab = typeof lab.$inferSelect
type Issue = typeof issue.$inferSelect

export interface GetDataForCheckinProtocol {
  users: User[]
  places: Place[]
  labs: Lab[]
  issues: Issue[]
}
