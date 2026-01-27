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
import {
  AlertCircle,
  CalendarIcon,
  CalendarX,
  ChevronRightIcon,
  CircleCheckIcon,
} from 'lucide-react'
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
import { Badge } from '../ui/badge'
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
        <h1 className="font-title mt-1 mr-[22%] text-xl font-semibold tracking-tight">
          Histórico de Check-ins
        </h1>
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
        <div className="flex flex-row bg-gray-300 p-3 rounded-lg mb-3">
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
              <div className="w-[90%] self-center">
                <Badge variant="ghost" className="w-fit">
                  {checkins.date}
                </Badge>
              </div>
              <div className="flex justify-center gap-6 border-b">
                <Item
                  asChild
                  className={`w-[90%] rounded-md border transition-colors ${
                    checkins.overallStatus
                      ? 'border-green-400 bg-green-50 hover:border-green-600 hover:bg-green-100'
                      : 'border-red-400 bg-red-50 hover:border-red-600 hover:bg-red-100'
                  }`}
                >
                  <Link href="#">
                    <ItemMedia>
                      {checkins.overallStatus ? (
                        <CircleCheckIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      )}
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Check-in feito por {users.name}</ItemTitle>
                      <ItemDescription>
                        Toque aqui para conferir informações do check-in
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ChevronRightIcon className="size-4" />
                    </ItemActions>
                  </Link>
                </Item>
              </div>
            </div>
          ))}
        </div>
      )}
      {!checkins[0] && (
        <div className="flex w-[90%] flex-col items-center">
          <div className="flex w-full flex-col gap-2">
            <div className="w-[90%] self-center"></div>
            <div className="flex justify-center gap-6 border-b">
              <Item asChild className="w-[90%] border-gray-400 bg-gray-50">
                <Link href="#">
                  <ItemMedia>
                    <CalendarX className="h-6 w-6 text-gray-600" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Check-in não encontrado</ItemTitle>
                    <ItemDescription>
                      Não foi encontrado nenhum Check-in nesta data
                    </ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SelectDateForm
