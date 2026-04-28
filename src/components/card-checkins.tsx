'use client'
import Link from 'next/link'
import { Card, CardDescription, CardTitle } from './ui/card'
import { CircleCheckIcon, CircleXIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Checkin } from '@/types/typesPayload'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CardCheckinProps {
  data: Checkin
}

export default function CardCheckin({ data }: CardCheckinProps) {
  let status: 'organized' | 'disorganized' | 'not_checked' = 'not_checked'

  if (data.items.every((item) => item.status === 'organized')) {
    status = 'organized'
  } else if (data.items.some((item) => item.status === 'not_checked')) {
    status = 'not_checked'
  } else {
    status = 'disorganized'
  }

  const ICONS = {
    organized: <CircleCheckIcon className="text-green-400" />,
    disorganized: <CircleXIcon className="text-red-400" />,
    not_checked: <CircleXIcon className="text-gray-400" />,
  }

  const BADGES = {
    organized: (
      <Badge className="bg-green-100 font-bold text-green-500">Tudo OK</Badge>
    ),
    disorganized: (
      <Badge className="bg-red-100 font-bold text-red-500">Problemas</Badge>
    ),
    not_checked: (
      <Badge className="bg-gray-100 font-bold text-gray-500">
        Não Verificado
      </Badge>
    ),
  }

  return (
    <Link href={`/checkins/${data.checkinId}`}>
      <Card className="m-1.5 flex justify-between hover:shadow-md md:max-h-21.25">
        <div className="flex w-full justify-between">
          <div className="ml-5 flex items-center">
            {ICONS[status]}
            <div className="ml-3">
              <CardTitle className="mb-1 font-semibold">
                {data.people?.name || 'Indefinido'}
              </CardTitle>
              <CardDescription>
                {format(parseISO(data.createdAt), 'dd/MM/yyyy', {
                  locale: ptBR,
                })}{' '}
                • {data.placeCount} lugares
              </CardDescription>
            </div>
          </div>
          <div className="mr-4">{BADGES[status]}</div>
        </div>
      </Card>
    </Link>
  )
}
