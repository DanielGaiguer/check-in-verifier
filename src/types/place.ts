export interface Place {
  id: string
  labId: string
  unitId: string
  name: string
  order: number
  createdAt: string
  labName: string
  problems: { id: string; name: string }[]
}
