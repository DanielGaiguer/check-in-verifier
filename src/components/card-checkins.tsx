import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { CircleCheck, CircleCheckIcon, CircleXIcon } from 'lucide-react'
import { Badge } from './ui/badge'

interface CardCheckinProps {
  data: {
    isOK: boolean
    people: string
    date: string
    countPlaces: number
  }
}

export default function CardCheckin({ data }: CardCheckinProps) {
  return (
    <Link href={'#'}>
      <Card className="hover:shadow-md flex justify-between m-2 md:max-h-21.25">
        <div className='flex justify-between'>
          <div className="flex ml-5 items-center">
            {data.isOK ? (
              <CircleCheckIcon className="text-green-400" />
            ) : (
              <CircleXIcon className="text-red-400" />
            )}
            <div className='ml-3'>
              <CardTitle className='mb-1'>{data.people}</CardTitle>
              <CardDescription>
                {data.date} • {data.countPlaces} lugares
              </CardDescription>
            </div>
          </div>
          <div className='mr-4'>
            {data.isOK ? (
              <Badge className="bg-green-100 text-green-500 font-bold">Tudo OK</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-500 font-bold">Problemas</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
