// typesPayload.ts
export interface Photo {
  photoId: string;
  url: string;
}

export interface Problem {
  problemId: string;
  name: string;
  photos: Photo[];
}

export interface Place {
  id: string;
  name: string;
}

export interface Item {
  itemId: string;
  place: Place;
  status: string;
  observation: string;
  problems: Problem[];
}

export interface Person {
  id: string;
  name: string;
}

export interface Checkin {
  checkinId: string;
  date: string; // ou Date, se você fizer parse
  person: Person;
  observation: string;
  placeCount: number;
  items: Item[];
}