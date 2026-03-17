import { useQuery } from "@tanstack/react-query";

export async function usePlaces() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['places'],
		queryFn: async () => {
			const res = await fetch('/api/places')
			if (!res) throw new Error('Erro ao buscar lugares')
			const json = await res.json()
			return json.data
		}
	}) 

	const places = Array.isArray(data) ? data: []

	return {places, isLoading, error}
}