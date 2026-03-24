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
	  const { data: people = [], isLoading, error} = useQuery<People[]>({
    queryKey: ['peoples'],
    queryFn: async () => {
      const res = await fetch('api/people')
      if (!res.ok) throw new Error("Erro ao buscar Pessoas")
      const json = await res.json()
      return json.data
    },
    select: (people) => 
      people.map((people) => ({
        ...people,
        createdAt: format(new Date(people.createdAt), 'dd/MM/yyyy', { locale: ptBR } )
      }))
  })

	return { people, isLoading, error}
}