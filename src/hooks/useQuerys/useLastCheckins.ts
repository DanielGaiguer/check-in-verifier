import { useQuery } from '@tanstack/react-query'
import { count } from 'console'

export interface InitialDataCheckin {
  id: string
  peopleId: string
  peopleName: string
  checkinsDate: string
  observation: string
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: InitialDataCheckin[]
  count: number
}

export function useLastCheckins() {
	const { data, isLoading, error } = useQuery<ApiResponse>({
		queryKey: ['lastCheckins'],
		queryFn: async () => {
			const res = await fetch('/api/checkins?range=month')
			if (!res.ok) throw new Error("Erro ao buscar check-in")
			const json: ApiResponse = await res.json()
			const count = json.count
			return json
		},
	})

	const checkinData: InitialDataCheckin[] = Array.isArray(data) ? data: []

	return { checkinData, checkinsCount: data?.count, isLoading, error}
}