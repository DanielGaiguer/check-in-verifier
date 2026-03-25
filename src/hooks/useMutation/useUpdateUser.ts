import { useMutation, useQueryClient } from '@tanstack/react-query'

async function updateUser(data: { id: string; name: string }) {
  const response = await fetch(`/api/people/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: data.name }),
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar usuário')
  }

  return response.json()
}


export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] })
    },
  })
}