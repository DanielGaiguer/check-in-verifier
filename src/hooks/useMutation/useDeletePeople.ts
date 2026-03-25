import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deletePeople(data: { id: string; }) {
  const response = await fetch(`/api/people/${data.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar usuário')
  }

  return response.json()
}


export function useDeletePeople() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePeople,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] })
    },
  })
}