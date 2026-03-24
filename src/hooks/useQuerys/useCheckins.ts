import { Checkin } from '@/types/typesPayload'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'


export function useCheckins(range: string) {
  function formattedDate(date: Date) {
    return format(date, 'yyyy-MM-dd')
  }

  const today = new Date()
  const todayFormatted = formattedDate(today)

  let reqParams = ''
  let date: Date

  switch (range) {
    case '7days':
      reqParams = 'range=week'
      break
    case '1Month':
      reqParams = 'range=month'
      break
    case '3Month':
      date = new Date(today)
      date.setMonth(today.getMonth() - 3)
      reqParams = `from=${formattedDate(date)}&to=${todayFormatted}`
      break
    case '6Month':
      date = new Date(today)
      date.setMonth(today.getMonth() - 6)
      reqParams = `from=${formattedDate(date)}&to=${todayFormatted}`
      break
    case 'lastYear':
      date = new Date(today)
      date.setFullYear(today.getFullYear() - 1)
      reqParams = `from=${formattedDate(date)}&to=${todayFormatted}`
      break
    default:
      reqParams = ''
  }

   return useQuery<Checkin[]>({
    queryKey: ['checkins', range],
    queryFn: async () => {
      const res = await fetch(`/api/historyCheckins?${reqParams}`);
      if (!res.ok) throw new Error('Erro ao buscar checkins');
      const json = await res.json();
      return json.data as Checkin[];
    },
    select: (data) =>
  [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ),
    enabled: !!range
  })
}
