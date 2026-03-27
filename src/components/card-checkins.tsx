'use client'
import Link from 'next/link'
import { Card, CardDescription, CardTitle } from './ui/card'
import { CircleCheckIcon, CircleXIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Checkin } from '@/types/typesPayload'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CardCheckinProps {
  data: Checkin
}

export default function CardCheckin({ data }: CardCheckinProps) {
  let status: 'organized' | 'disorganized' | 'not_checked' = 'not_checked'

  if (data.items.every(item => item.status === 'organized')) {
    status = 'organized'
  } else if (data.items.some(item => item.status === 'not_checked')) {
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
    organized: <Badge className="bg-green-100 text-green-500 font-bold">Tudo OK</Badge>,
    disorganized: <Badge className="bg-red-100 text-red-500 font-bold">Problemas</Badge>,
    not_checked: <Badge className="bg-gray-100 text-gray-500 font-bold">Não Verificado</Badge>,
  }

  return (
    <Link href={`/checkins/${data.checkinId}`}>
      <Card className="hover:shadow-md flex justify-between m-1.5 md:max-h-21.25">
        <div className='flex justify-between w-full'>
          <div className="flex ml-5 items-center">
            {ICONS[status]}
            <div className='ml-3'>
              <CardTitle className='mb-1 font-semibold'>{data.people?.name || 'Indefinido'}</CardTitle>
              <CardDescription>
                {format(new Date(data.date), 'dd/MM/yyyy', {locale: ptBR})} • {data.placeCount} lugares
              </CardDescription>
            </div>
          </div>
          <div className='mr-4'>
            {BADGES[status]}
          </div>
        </div>
      </Card>
    </Link>
  )
}