import { TodayCheckinResponse } from '@/types/checkin'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

interface DateProtocol {
  defaultDate?: 'today' | 'week' | 'month'
  customDate?: DateRange
}

export async function getCheckinServer(
  date: DateProtocol
): Promise<TodayCheckinResponse[]> {
  let response: Response

  // 🔹 Caso 1: range padrão (today, week, month)
  if (date.defaultDate) {
    response = await fetch(
      `${process.env.URL}/api/checkins?range=${date.defaultDate}`,
      { cache: 'no-store' }
    )
  }

  // 🔹 Caso 2: intervalo customizado
  else if (date.customDate?.from && date.customDate?.to) {
    const fromParam = format(date.customDate.from, 'yyyy-MM-dd')
    const toParam = format(date.customDate.to, 'yyyy-MM-dd')

    response = await fetch(
      `${process.env.URL}/api/checkins?from=${fromParam}&to=${toParam}`,
      { cache: 'no-store' }
    )
  }

  // 🔹 Caso inválido
  else {
    throw new Error('Parâmetros de data inválidos')
  }

  if (!response.ok) {
    throw new Error('Erro ao buscar check-ins')
  }

  return response.json()
}

// export async function getStatusCheckinServer(
//   checkin: TodayCheckinResponse[]
// ): Promise<void> {
//   await Promise.all(
//     checkin.map(async (checkinToday) => {
//       const response = await fetch(
//         `${process.env.URL}/api/checkins/status?id=${checkinToday.id}`,
//         {
//           headers: { 'Content-Type': 'application/json' },
//           cache: 'no-store',
//         }
//       )
//       const json = await response.json()
//       console.log("Response:", json)
//     })
//   )
// }
