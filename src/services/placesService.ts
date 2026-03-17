import { Place } from '@/types/place'

export async function updatePlacesOrder(places: Place[]) {
  const res = await fetch('/api/places/reorder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ places }),
  })

  if (!res.ok) {
    throw new Error('Erro ao atualizar ordem')
  }

  return res.json()
}