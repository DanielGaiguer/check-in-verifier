'use client'

import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { addDays, format } from 'date-fns'
import { AlertCircle, CalendarIcon, ChevronRightIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { ptBR } from 'date-fns/locale'
import { TodayCheckinResponse } from '@/types/checkin'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { getCheckinClient } from '@/services/checkins.client'

type DateFilter = 'today' | 'week' | 'month' | 'customDate'

const SelectDateForm = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  const [customDateState, openCustomDate] = useState<boolean>(false)

  const [checkins, setCheckins] = useState<TodayCheckinResponse[]>([])

  const handleChangeDate = async (value: DateFilter) => {
    if (value === 'customDate') {
      openCustomDate(true)
      return
    }

    const data = await getCheckinClient({ defaultDate: value })
    setCheckins(data)
    openCustomDate(false)
  }

  const handleClickCustomDate = async () => {
    const data = await getCheckinClient({ customDate: date })
    setCheckins(data)
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await getCheckinClient({ defaultDate: 'today' })
        setCheckins(data)
      }
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <>
      {/* <h1>{checkins ? JSON.stringify(checkins) : 'Carregando...'}</h1> */}
      <div className="flex w-[75%] flex-row justify-between p-5">
        <h1 className="mt-1 mr-[22%] text-lg">Histórico de Check-ins</h1>
        <Select onValueChange={handleChangeDate} defaultValue="today">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
          // position={alignItemWithTrigger ? "item-aligned" : "popper"}
          >
            <SelectGroup>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">7 Dias</SelectItem>
              <SelectItem value="month">30 Dias</SelectItem>
              <SelectItem value="customDate">Personalizado</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {customDateState && (
        <div className="flex flex-row">
          <Field className="mx-auto w-60">
            <FieldLabel htmlFor="date-picker-range">Escolha a Data</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker-range"
                  className="justify-start px-2.5 font-normal"
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'dd/MM/y', { locale: ptBR })} -{' '}
                        {format(date.to, 'dd/MM/y', { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, 'dd MMM, y', { locale: ptBR })
                    )
                  ) : (
                    <span>Pick a date</span> //
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Button
            className="m-3 mt-8"
            variant="default"
            onClick={handleClickCustomDate}
          >
            Confirmar
          </Button>
        </div>
      )}
      {checkins && (
        <div className="flex w-[90%] flex-col items-center">
          {checkins.map(({ checkins, users }) => (
            <div key={checkins.id} className="flex w-full flex-col gap-2">
              <div className='w-[90%] self-center'>
                <Badge variant="ghost" className="w-fit">
                  {checkins.date}
                </Badge>
              </div>
              <div className="flex justify-center gap-6 border-b">
                <Item
                  asChild
                  className="w-[90%] border-yellow-400 bg-yellow-50"
                >
                  <Link href="#">
                    <ItemMedia>
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Visit our documentation</ItemTitle>
                      <ItemDescription>
                        Learn how to get started with our components.
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ChevronRightIcon className="size-4" />
                    </ItemActions>
                  </Link>
                </Item>
              </div>
              <p>Usuário: {users.name}</p>
              <p>Data: {checkins.date}</p>
              <p>Status: {checkins.overallStatus ? 'Ok' : 'Problema'}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default SelectDateForm
