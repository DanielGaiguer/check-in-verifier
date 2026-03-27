import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createLaboratories(data: { name: string }) {
  const response = await fetch('/api/laboratories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar Laboratório')
  }

  return response.json()
}

export function useCreateLaboratories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLaboratories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratories'] })
    },
  })
} 