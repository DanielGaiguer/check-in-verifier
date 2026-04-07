export interface Photo {
  photoId: string
  url: string
}

export interface Problem {
  problemId: string
  name: string
}

export interface Place {
  id: string
  name: string
  order: number
  labId: string
  labName: string
}

export interface Item {
  itemId: string
  place: Place
  status: 'organized' | 'disorganized'
  observation: string
  problems: Problem[]
  photos: Photo[]
}

export interface People {
  id: string
  name: string
}

export interface Edits {
  id: string
  editedBy: string
  reason: string
  createdAt: string
}

export interface Checkin {
  checkinId: string
  date: string // ou Date, se você fizer parse
  createdAt: string
  people: People
  observation: string
  placeCount: number
  items: Item[]
  edits: Edits[]
}
