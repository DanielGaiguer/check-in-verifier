import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface People {
  id: string
  name: string
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: People[]
  count: number
}

export function usePeople() {
  const { data, isLoading, error } = useQuery<
    ApiResponse,
    Error,
    { people: People[]; count: number }
  >({
    queryKey: ['people'],
    queryFn: async () => {
      const res = await fetch('/api/people')

      if (!res.ok) throw new Error('Erro ao buscar Pessoas')

      return res.json()
    },

    select: (response) => ({
      count: response.count,
      people: response.data.map((person) => ({
        ...person,
        createdAt: format(new Date(person.createdAt), 'dd/MM/yyyy', {
          locale: ptBR,
        }),
      })),
    }),
  })

  return {
    people: data?.people ?? [],
    peopleCount: data?.count ?? 0,
    isLoading,
    error,
  }
}