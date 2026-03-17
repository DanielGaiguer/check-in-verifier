import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PlaceProtocol {
  id: number
  labId: string
  name: string
  sortOrder: number
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: PlaceProtocol[]
  count: number
}

export function usePlaces() {
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['places'],
    queryFn: async () => {
      const res = await fetch('/api/places')
      if (!res) throw new Error('Erro ao buscar lugares')
      const json = await res.json()
      return json.data
    },
  })

  const places: PlaceProtocol[] = Array.isArray(data) ? data : []

  places.map((place) => {
    return [
      (place.createdAt = format(new Date(place.createdAt), 'dd/MM/yyyy', {
        locale: ptBR,
      })),
      ...places,
    ]
  })

  return { places, isLoading, error }
}
