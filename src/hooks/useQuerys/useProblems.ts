import { useQuery } from '@tanstack/react-query'

export interface Problem {
  id: string
  name: string
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  count: number
}

interface UseProblemsOptions {
  active?: boolean
}

export function useProblems(options?: UseProblemsOptions) {
  const queryString = options?.active !== undefined ? `?active=${options.active}` : ''

  const queryResult = useQuery({
    queryKey: ['problems', options],
    queryFn: async () => {
      const res = await fetch(`/api/problems${queryString}`)
      if (!res.ok) throw new Error('Erro ao buscar problemas')
      return res.json() as Promise<ApiResponse<Problem>>
    },
    select: (response) => ({
      problems: response.data,
      count: response.count,
    }),
  })

  return {
    problems: queryResult.data?.problems ?? [],
    problemsCount: queryResult.data?.count ?? 0,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
  }
}