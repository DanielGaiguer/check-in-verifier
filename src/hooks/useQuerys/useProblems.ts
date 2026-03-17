import { useQuery } from '@tanstack/react-query'

interface Problem {
  id: number
  name: string
}

interface ApiResponse {
  success: boolean
  data: Problem[]
  count: number
}

export function useProblems() {
  const { data, isLoading, error } = useQuery<Problem[]>({
    queryKey: ['problems'],
    queryFn: async () => {
      const res = await fetch('/api/problems')
      if (!res.ok) throw new Error('Erro ao buscar problemas')
      const json: ApiResponse = await res.json()
      return json.data
    },
  })

  const problems: Problem[] = Array.isArray(data) ? data : []
	
	return { problems, isLoading, error}
}	
