import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createPlace(data: {
  labId: string
  name: string
  sortOrder?: number
  problemIds: string[]
}) {
  const response = await fetch('/api/place', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      labId: data.labId,
      name: data.name,
      sortOrder: data.sortOrder ?? [],
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error('Erro ao cadastrar local')
  }

  const placeId = result.data.id

  if (data.problemIds.length > 0) {
    const responseProblems = await fetch('/api/place-problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        placeId,
        problemIds: data.problemIds,
      }),
    })

    if (!responseProblems.ok) {
      throw new Error('Erro ao cadastrar problemas do local')
    }
  }

  return result
}

export function useCreatePlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['place'] })
    },
  })
}
