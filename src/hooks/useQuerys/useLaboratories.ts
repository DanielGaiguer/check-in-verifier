import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface LaboratoriesProtocol {
  id: string
  name: string
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: LaboratoriesProtocol[]
  count: number
}

export function useLaboratories() {
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['laboratories'],
    queryFn: async () => {
      const res = await fetch('api/laboratories')
      if (!res) throw new Error('Erro ao buscar laboratórios')
      const json = await res.json()
      return json.data
    },
  })

  const laboratories: LaboratoriesProtocol[] = Array.isArray(data) ? data : []

  laboratories.map((lab) => {
    return [
      (lab.createdAt = format(new Date(lab.createdAt), 'dd/MM/yyyy', {
        locale: ptBR,
      })),
    ]
  })

	return { laboratories, isLoading, error }
}
