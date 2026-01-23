import { getTodayCheckin } from '@/services/apiCheckinService'
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

export async function TodayCheckin() {
  const data = await getTodayCheckin()

  return (
    <>
      {data.length ? (
        <h1>Check-in de hoje feito por {data[0].users.name}</h1>
      ) : (
        <>
          <div className="flex w-full max-w-md flex-col gap-6">
            <Item variant="outline" className='border-yellow-400 bg-yellow-50'>
							<ItemMedia>
								<AlertCircle className='w-6 h-6 text-yellow-600'/>
							</ItemMedia>
              <ItemContent>
                <ItemTitle className="text-yellow-800 text-lg">Check-in diário pendente</ItemTitle>
                <ItemDescription className=''>Realizar Check-in de Hoje</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Link href="checkins/create">
                  <Button variant="outline" size="lg" className='border-yellow-400 bg-yellow-100'>
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
