import { TodayCheckinResponse } from '@/types/checkin'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

interface DateProtocol {
  defaultDate: 'today' | 'week' | 'month'
  customDate?: DateRange 
}

export async function getTodayCheckin(): Promise<TodayCheckinResponse> {
  const response = await fetch(`${process.env.URL}/api/checkins?range=today`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar check-in de hoje')
  }

  return response.json()
}

export async function getCheckinForDate(
  date: DateProtocol
): Promise<TodayCheckinResponse> {
  let response: Response

  if (date.defaultDate) {
    response = await fetch(
      `${process.env.URL}/api/checkins?range=${date.defaultDate}`,
      { cache: 'no-store' }
    )
  }

  else if (date.customDate?.from && date.customDate?.to) {
    const fromParam = format(date.customDate.from, 'yyyy-MM-dd')
    const toParam = format(date.customDate.to, 'yyyy-MM-dd')

    response = await fetch(
      `${process.env.URL}/api/checkins?from=${fromParam}&to=${toParam}`,
      { cache: 'no-store' }
    )
  }

  else {
    throw new Error('Parâmetros de data inválidos')
  }

  if (!response.ok) {
    throw new Error('Erro ao buscar check-ins')
  }

  return response.json()
}