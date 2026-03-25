import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createPeople(data: { name: string }) {
  const response = await fetch('/api/people', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar usuário')
  }

  return response.json()
}

export function useCreatePeople() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPeople,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] })
    },
  })
}