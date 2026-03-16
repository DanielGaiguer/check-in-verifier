import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface People{
  id: string
  name: string
  createdAt: string
}

interface ApiResponse{
  success: boolean
  data: People[]
  count: number
}

export function usePeople() {
	  const { data, isLoading, error} = useQuery<ApiResponse>({
    queryKey: ['peoples'],
    queryFn: async () => {
      const res = await fetch('api/people')
      if (!res.ok) throw new Error("Erro ao buscar Pessoas")
      const json = await res.json()
      return json.data
    }
  })

	 const peoples: People[] = Array.isArray(data) ? data : []

  peoples.map((people) => {
    return [people.createdAt = format(new Date(people.createdAt), 'dd/MM/yyyy', {locale: ptBR}), ...peoples]
  })

	return { peoples, isLoading, error}
}