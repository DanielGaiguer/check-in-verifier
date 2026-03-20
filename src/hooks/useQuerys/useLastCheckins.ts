import { useQuery } from '@tanstack/react-query'

export interface Checkin {
  id: string
  name: string
  date: string
  observation: string
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: Checkin[]
  count: number
}

export function useLastCheckins() {
	const { data, isLoading, error } = useQuery<Checkin[]>({
		queryKey: ['lastCheckins'],
		queryFn: async () => {
			const res = await fetch('/api/checkins?range=week')
			if (!res.ok) throw new Error("Erro ao buscar check-in")
			const json: ApiResponse = await res.json()
			return json.data
		},
	})

	const checkinData: Checkin[] = Array.isArray(data) ? data: []

	return { checkinData, isLoading, error}
}