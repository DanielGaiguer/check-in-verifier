import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deletePlace(data: { id: string; }) {
  const response = await fetch(`/api/places/${data.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao deletar local.')
  }

  return response.json()
}


export function useDeletePlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })
}