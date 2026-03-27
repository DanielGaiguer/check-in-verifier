import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deleteLab(data: { id: string; }) {
  const response = await fetch(`/api/laboratories/${data.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao deletar laboratório.')
  }

  return response.json()
}


export function useDeleteLab() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratories'] })
    },
  })
}