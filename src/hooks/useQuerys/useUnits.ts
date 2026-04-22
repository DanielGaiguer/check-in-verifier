import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Unit {
  id: string
  name: string
  createdAt: string
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  count: number
}

interface UseUnitOptions {
  active?: boolean
}

export function useUnits(options?: UseUnitOptions) {
  const queryString =
    options?.active !== undefined ? `?active=${options.active}` : ''

  const queryResult = useQuery({
    queryKey: ['units', options],
    queryFn: async () => {
      const res = await fetch(`/api/units${queryString}`)
      if (!res.ok) throw new Error('Erro ao buscar unidades')
      return res.json() as Promise<ApiResponse<Unit>>
    },
    select: (response) => ({
      units: response.data.map((unit) => ({
        ...unit,
        createdAt: format(new Date(unit.createdAt), 'dd/MM/yyyy', {
          locale: ptBR,
        }),
      })),
      count: response.count,
    }),
  })

  return {
    units: queryResult.data?.units ?? [],
    peopleCount: queryResult.data?.count ?? 0,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
  }
}
