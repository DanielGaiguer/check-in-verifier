import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Laboratory {
  id: string
  name: string
  createdAt: string
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  count: number
}

interface UseLaboratoriesOptions {
  active?: boolean
}

export function useLaboratories(options?: UseLaboratoriesOptions) {
  const queryString = options?.active !== undefined ? `?active=${options.active}` : ''

  const queryResult = useQuery({
    queryKey: ['laboratories', options],
    queryFn: async () => {
      const res = await fetch(`/api/laboratories${queryString}`)
      if (!res.ok) throw new Error('Erro ao buscar laboratórios')
      return res.json() as Promise<ApiResponse<Laboratory>>
    },
    select: (response) => ({
      laboratories: response.data.map((lab) => ({
        ...lab,
        createdAt: format(new Date(lab.createdAt), 'dd/MM/yyyy', { locale: ptBR }),
      })),
      count: response.count,
    }),
  })

  return {
    laboratories: queryResult.data?.laboratories ?? [],
    laboratoriesCount: queryResult.data?.count ?? 0,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
  }
}