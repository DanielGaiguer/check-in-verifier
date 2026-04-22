import { useMutation, useQueryClient } from '@tanstack/react-query'

async function updateLab(data: { id: string; name: string, unitId: string}) {
  const response = await fetch(`/api/laboratories/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: data.name, unitId: data.unitId }),
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar laboratório.')
  }

  return response.json()
}

export function useUpdateLab() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateLab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratories'] })
    },
  })
}
