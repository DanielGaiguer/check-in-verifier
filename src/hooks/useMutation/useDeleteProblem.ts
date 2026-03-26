import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deleteProblem(data: { id: string; }) {
  const response = await fetch(`/api/problems/${data.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao deletar usuário')
  }

  return response.json()
}


export function useDeleteProblem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
    },
  })
}