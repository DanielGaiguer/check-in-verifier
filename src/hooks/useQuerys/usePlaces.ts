import { Place } from '@/types/place'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ApiResponse {
  success: boolean
  data: Place[]
  count: number
}

export function usePlaces() {
  const { data, isLoading, error } = useQuery<
    ApiResponse,
    Error,
    { places: Place[]; count: number }
  >({
    queryKey: ['places'],
    queryFn: async () => {
      const res = await fetch('/api/places')

      if (!res.ok) throw new Error('Erro ao buscar lugares')

      return res.json()
    },

    select: (response) => ({
      count: response.count,
      places: response.data.map((place) => ({
        ...place,
        createdAt: format(new Date(place.createdAt), 'dd/MM/yyyy', {
          locale: ptBR,
        }),
      })),
    }),
  })

  return {
    places: data?.places ?? [],
    placeCount: data?.count ?? 0,
    isLoading,
    error,
  }
}
