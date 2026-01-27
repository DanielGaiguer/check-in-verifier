import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../ui/item'
import { Button } from '../ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getCheckinServer } from '@/services/checkins.server'
import SelectDateForm from './selectDateForm'
import CardCheckin from './cardCheckin'

export async function TodayCheckin() {
  const data = await getCheckinServer({ defaultDate: 'today' })

  return (
    <>
      {data.length ? (
        <>
          <h2>Check-in de Hoje: </h2>
          <div className="flex w-[90%] flex-col items-center">
            <div className="flex w-[75%] flex-row justify-between p-5">
              <CardCheckin checkins={data} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full max-w-md flex-col gap-6">
            <Item variant="outline" className="border-yellow-400 bg-yellow-50">
              <ItemMedia>
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg text-shadow-lg">
                  Check-in diário pendente
                </ItemTitle>
                <ItemDescription>Realizar Check-in de Hoje</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Link href="checkins/create">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-yellow-400 bg-yellow-100"
                  >
                    Check-In
                  </Button>
                </Link>
              </ItemActions>
            </Item>
          </div>
        </>
      )}
    </>
  )
}
