"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SelectDateTodayProps{
	textLabel: string,
	date: Date | undefined
	setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export function SelectDateToday({textLabel, date, setDate}: SelectDateTodayProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Field className="mx-auto w-44 ">
      <FieldLabel htmlFor="date" className="text-md">{textLabel}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen} >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-start font-normal border-black! border bg-gray-900"
          >
            {date ? date.toLocaleDateString() : "Selecionar data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 " align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
