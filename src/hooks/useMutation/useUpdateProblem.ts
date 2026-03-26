import { useMutation, useQueryClient } from '@tanstack/react-query'

async function updateProblem(data: { id: string; name: string }) {
  const response = await fetch(`/api/problems/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: data.name }),
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar problema.')
  }

  return response.json()
}


export function useUpdateProblem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
    },
  })
} 