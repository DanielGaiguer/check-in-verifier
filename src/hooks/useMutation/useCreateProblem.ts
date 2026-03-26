import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createProblem(data: { name: string }) {
  const response = await fetch('/api/problems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar problema.')
  }

  return response.json()
}

export function useCreateProblem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem'] })
    },
  })
} 