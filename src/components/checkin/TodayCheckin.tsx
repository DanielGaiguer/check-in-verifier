import { getTodayCheckin } from '@/services/checkins/getTodayCheckin'

export async function TodayCheckin() {
  const data = await getTodayCheckin()

  if (!data.length) {
    return <h1>Nenhum check-in realizado hoje</h1>
  }

  return <h1>Check-in de hoje feito por {data[0].users.name}</h1>
}
