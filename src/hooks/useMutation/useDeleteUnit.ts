import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deleteUnit(data: { id: string }) {
  const response = await fetch(`/api/units/${data.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao deletar unidade')
  }

  return response.json()
}

export function useDeleteUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    },
  })
}