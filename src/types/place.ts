export interface Place {
  id: string
  labId: string
  name: string
  sortOrder: number
  createdAt: string
	labName: string
  problems: {id: string, name: string}[]
}