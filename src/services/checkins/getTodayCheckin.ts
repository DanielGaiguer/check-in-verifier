import { TodayCheckinResponse } from '@/types/checkin'

export async function getTodayCheckin(): Promise<TodayCheckinResponse> {
  const response = await fetch(
    `${process.env.URL}/api/checkins/today`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar check-in de hoje')
  }

  return response.json()
}
