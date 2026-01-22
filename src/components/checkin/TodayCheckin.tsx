import { getTodayCheckin } from '@/services/checkins/getTodayCheckin'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../ui/item'
import { Button } from '../ui/button'
import { AlertCircle, BadgeCheckIcon, ChevronRightIcon } from 'lucide-react'
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
								<AlertCircle className='w-5 h-5 text-yellow-600'/>
							</ItemMedia>
              <ItemContent>
                <ItemTitle className="text-yellow-800">Check-in diário pendente</ItemTitle>
                <ItemDescription>Realizar Check-in de Hoje</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Link href="checkins/create">
                  <Button variant="outline" size="lg" className='border-yellow-400 bg-yellow-100'>
                    Check-In
                  </Button>
                </Link>
              </ItemActions>
            </Item>
            {/* <Item variant="outline" size="sm" asChild>
              <a href="#">
                <ItemMedia>
                  <BadgeCheckIcon className="size-5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Your profile has been verified.</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </a>
            </Item> */}
          </div>
        </>
      )}
    </>
  )
}
