import { useMutation, useQueryClient } from '@tanstack/react-query'

export async function updatePlaceWithProblems(data: {
  id: string
  labId: string
  name: string
  sortOrder: number
  toAdd: string[]
  toRemove: string[]
}) {
  await fetch(`/api/places/${data.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      labId: data.labId,
      name: data.name,
      sortOrder: data.sortOrder,
    }),
  })

  // 2 add problems
  if (data.toAdd.length > 0) {
    await fetch(`/api/place-problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeId: data.id,
        problemIds: data.toAdd, // ✅ agora o backend espera "problemIds"
      }),
    })
  }

  // remove problems
  if (data.toRemove.length > 0) {
    await fetch(`/api/place-problems`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeId: data.id,
        problemIds: data.toRemove,
      }),
    })
  }
}

export function useUpdatePlaces() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePlaceWithProblems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })
}
