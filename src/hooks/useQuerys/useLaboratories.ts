import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface LaboratoriesProtocol {
  id: string
  name: string
  createdAt: string
}

export function useLaboratories() {
  const { data, isLoading, error } = useQuery<LaboratoriesProtocol[]>({
    queryKey: ['laboratories'],
    queryFn: async () => {
      const res = await fetch('/api/laboratories')

      if (!res.ok) {
        throw new Error('Erro ao buscar laboratórios')
      }

      const json = await res.json()

      return json.data
    },
  })

  const laboratories =
    data?.map((lab) => ({
      ...lab,
      createdAt: format(new Date(lab.createdAt), 'dd/MM/yyyy', {
        locale: ptBR,
      }),
    })) ?? []

  return { laboratories, isLoading, error }
}