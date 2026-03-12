'use client'

import Link from 'next/link'

type Checkin = {
  id: string
  name: string
  date: string
}

type Props = {
  checkins: Checkin[]
  hrefBase: string
}

export function LastCheckins({ checkins, hrefBase }: Props) {
  return (
    <div className="rounded-xl border bg-muted/40 p-6 mt-5">
      <h2 className="text-lg font-semibold mb-6">Últimos Check-ins</h2>

      <div className="flex flex-col gap-6">
        {checkins.map((checkin) => {
          const initial = checkin.name.charAt(0).toUpperCase()

          return (
            <Link
              key={checkin.id}
              href={`${hrefBase}/${checkin.id}`}
              className="flex items-center gap-4 hover:bg-muted/60 rounded-lg p-2 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-blue-500 bg-[#87cfeb39]">
                {initial}
              </div>

              <div className="flex flex-col">
                <span className="font-medium">{checkin.name}</span>
                <span className="text-sm text-muted-foreground">
                  {checkin.date}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}