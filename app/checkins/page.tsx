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
import { EventHandler, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { ptBR } from 'date-fns/locale'

type DateFilter = 'today' | 'week' | 'mount' | 'customDate'

export default function Checkins() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  const [customDateState, openCustomDate] = useState<boolean>(false)

  const handleChangeDate = (value: DateFilter) => {
    if (value === 'customDate') openCustomDate(true)
  }

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <div className="flex w-[30%] flex-row justify-between p-5">
        <h1 className="mt-1 text-lg">Histórico de Check-ins</h1>
        <Select onValueChange={handleChangeDate} defaultValue="week">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
          // position={alignItemWithTrigger ? "item-aligned" : "popper"}
          >
            <SelectGroup>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">7 Dias</SelectItem>
              <SelectItem value="mount">30 Dias</SelectItem>
              <SelectItem value="customDate">Personalizado</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {customDateState && (
        <div>
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
                    <span>Pick a date</span>
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
        </div>
      )}
    </main>
  )
}
