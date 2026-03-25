import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Place } from '@/types/place'

interface ApiResponse<T> {
  success: boolean
  data: T[]
  count: number
}

interface UsePlacesOptions {
  active?: boolean
}

export function usePlaces(options?: UsePlacesOptions) {
  const queryString = options?.active !== undefined ? `?active=${options.active}` : ''

  const queryResult = useQuery({
    queryKey: ['places', options],
    queryFn: async () => {
      const res = await fetch(`/api/places${queryString}`)
      if (!res.ok) throw new Error('Erro ao buscar lugares')
      return res.json() as Promise<ApiResponse<Place>>
    },
    select: (response) => ({
      places: response.data.map((place) => ({
        ...place,
        createdAt: format(new Date(place.createdAt), 'dd/MM/yyyy', { locale: ptBR }),
      })),
      count: response.count,
    }),
  })

  return {
    places: queryResult.data?.places ?? [],
    placeCount: queryResult.data?.count ?? 0,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
  }
}