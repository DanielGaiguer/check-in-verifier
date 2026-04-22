import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createLab(data: { name: string, unitId: string }) {
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

export function useCreateLab() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratories'] })
    },
  })
} 