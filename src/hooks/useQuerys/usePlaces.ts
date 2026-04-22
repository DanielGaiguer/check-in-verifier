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

const placesQueryKey = (active?: boolean) => ['places', active ?? null]

export function usePlaces(options?: UsePlacesOptions) {
  const queryString =
    options?.active !== undefined ? `?active=${options.active}` : ''

  const queryResult = useQuery({
    queryKey: placesQueryKey(options?.active),
    queryFn: async () => {
      const res = await fetch(`/api/places${queryString}`)
      if (!res.ok) throw new Error('Erro ao buscar lugares')
      const data = (await res.json()) as ApiResponse<Place>

      const orderedPlaces = data.data
        .sort((a, b) => a.order - b.order)
        .map((place) => ({
          ...place,
          createdAt: format(new Date(place.createdAt), 'dd/MM/yyyy', {
            locale: ptBR,
          }),
        }))

      return {
        places: orderedPlaces,
        count: data.count,
      }
    },
  })

  return {
    places: queryResult.data?.places ?? [],
    placeCount: queryResult.data?.count ?? 0,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
  }
}
