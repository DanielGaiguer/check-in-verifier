'use client'
import { InitialDataCheckin } from '@/hooks/useQuerys/useLastCheckins'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'

type Props = {
  checkins: InitialDataCheckin[]
  hrefBase: string
}

export function LastCheckins({ checkins, hrefBase }: Props) {
  // Ordena os checkins do mais recente para o mais antigo
  const sortedCheckins = [...checkins].sort((a, b) => {
    const dateA = parseISO(a.checkinsDate).getTime()
    const dateB = parseISO(b.checkinsDate).getTime()
    return dateB - dateA
  })

  return (
    <div className="bg-muted/40 mt-5 rounded-xl border p-6">
      <h2 className="mb-6 text-lg font-semibold">Últimos Check-ins</h2>

      <div className="flex flex-col gap-6">
        {sortedCheckins.map((checkin) => {
          const initial = checkin.peopleName?.charAt(0)?.toUpperCase() || '?'

          return (
            <Link
              key={checkin.id}
              href={`${hrefBase}/${checkin.id}`}
              className="hover:bg-muted/60 flex items-center gap-4 rounded-lg p-2 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#87cfeb39] text-sm font-medium text-blue-500">
                {initial}
              </div>

              <div className="flex flex-col">
                <span className="font-medium">{checkin.peopleName}</span>
                <span className="text-muted-foreground text-sm">
                  {format(parseISO(checkin.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}