'use client'
import Link from 'next/link'
import { Card, CardDescription, CardTitle } from './ui/card'
import { CircleCheckIcon, CircleXIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Checkin } from '@/types/typesPayload'

interface CardCheckinProps {
  data: Checkin
}

export default function CardCheckin({ data }: CardCheckinProps) {
  const hasProblems = data.items.some(item => item.problems.length > 0);

  return (
    <Link href={'#'}>
      <Card className="hover:shadow-md flex justify-between m-1.5 md:max-h-21.25">
        <div className='flex justify-between w-full'>
          <div className="flex ml-5 items-center">
            {hasProblems ? (
              <CircleXIcon className="text-red-300" />
            ) : (
              <CircleCheckIcon className="text-green-300" />
            )}
            <div className='ml-3'>
              <CardTitle className='mb-1 font-semibold'>{data.people?.name || 'Indefinido'}</CardTitle>
              <CardDescription>
                {data.date} • {data.placeCount} lugares
              </CardDescription>
            </div>
          </div>
          <div className='mr-4'>
            {hasProblems ? (
              <Badge className="bg-red-100 text-red-500 font-bold">Problemas</Badge>
            ) : (
              <Badge className="bg-green-100 text-green-500 font-bold">Tudo OK</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}