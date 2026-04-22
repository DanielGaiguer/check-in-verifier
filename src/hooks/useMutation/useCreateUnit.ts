import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createUnit(data: { name: string }) {
  const response = await fetch('/api/units', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar unidade')
  }

  return response.json()
}

export function useCreateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    },
  })
}