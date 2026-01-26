import { TodayCheckinResponse } from '@/types/checkin'
import { DateRange } from 'react-day-picker'

interface dateProtocol {
  defaultDate: 'today' | 'week' | 'month',
  customDate?: DateRange | undefined
}

export async function getTodayCheckin(): Promise<TodayCheckinResponse> {
  const response = await fetch(
    `${process.env.URL}/api/checkins?range=today`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar check-in de hoje')
  }

  return response.json()
}

export async function getCheckinForDate(): Promise<TodayCheckinResponse> {
  const response = await fetch(
    `${process.env.URL}/api/checkins?range=today`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar check-in de hoje')
  }

  return response.json()
}
