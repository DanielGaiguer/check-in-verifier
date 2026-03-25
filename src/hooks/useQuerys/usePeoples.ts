import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface People {
  id: string
  name: string
  createdAt: string
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  count: number
}

interface UsePeopleOptions {
  active?: boolean
}

export function usePeople(options?: UsePeopleOptions) {
  const queryString = options?.active !== undefined ? `?active=${options.active}` : ''

  const queryResult = useQuery({
    queryKey: ['people', options],
    queryFn: async () => {
      const res = await fetch(`/api/people${queryString}`)
      if (!res.ok) throw new Error('Erro ao buscar pessoas')
      return res.json() as Promise<ApiResponse<People>>
    },
    select: (response) => ({
      people: response.data.map((person) => ({
        ...person,
        createdAt: format(new Date(person.createdAt), 'dd/MM/yyyy', { locale: ptBR }),
      })),
      count: response.count,
    }),
  })

  return {
    people: queryResult.data?.people ?? [],
    peopleCount: queryResult.data?.count ?? 0,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
  }
}