// hooks/useQuerys/useCheckins.ts
import { Checkin } from '@/types/typesPayload'
import { useQuery } from '@tanstack/react-query'
import { format, subDays, subMonths } from 'date-fns'

function getQueryParams(range: string) {
  const today = new Date()
  let reqParams = ''

  switch (range) {
    case '7d':
      reqParams = 'range=week'
      break
    case '1m':
      reqParams = 'range=month'
      break
    case '3m':
      const date3 = subMonths(today, 3)
      reqParams = `from=${format(date3, 'yyyy-MM-dd')}&to=${format(today, 'yyyy-MM-dd')}`
      break
    case '6m':
      const date6 = subMonths(today, 6)
      reqParams = `from=${format(date6, 'yyyy-MM-dd')}&to=${format(today, 'yyyy-MM-dd')}`
      break
    case '12m':
      const date12 = subMonths(today, 12)
      reqParams = `from=${format(date12, 'yyyy-MM-dd')}&to=${format(today, 'yyyy-MM-dd')}`
      break
    default:
      reqParams = ''
  }

  return reqParams
}

export function useCheckins(range: string) {
  const reqParams = getQueryParams(range)

  return useQuery<Checkin[]>({
    queryKey: ['checkins', range],
    queryFn: async () => {
      const res = await fetch(`/api/historyCheckins?${reqParams}`)
      if (!res.ok) throw new Error('Erro ao buscar checkins')
      const json = await res.json()
      // Garantir que 'date' seja do tipo Date
      return (json.data as Checkin[]).map((c) => ({
        ...c,
        date: new Date(c.date).toISOString(), // mantém string mas parseável
      }))
    },
    select: (data) =>
      [...data].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    enabled: !!range,
  })
}