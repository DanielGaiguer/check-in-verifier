import { useMutation, useQueryClient } from '@tanstack/react-query'

async function updateUnit(data: { id: string; name: string }) {
  const response = await fetch(`/api/units/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: data.name }),
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar unidade')
  }

  return response.json()
}

export function useUpdateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    },
  })
}