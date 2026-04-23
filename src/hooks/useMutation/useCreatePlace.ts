import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createPlace(data: {
  labId: string
  name: string
  sortOrder?: number
  problemIds: string[]
}) {
  const response = await fetch('/api/places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      labId: data.labId,
      name: data.name,
      sortOrder: data.sortOrder ?? 0,
      problemIds: data.problemIds,
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao cadastrar local')
  }

  return response.json()
}

export function useCreatePlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })
}
