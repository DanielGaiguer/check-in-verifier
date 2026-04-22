'use client'
import { usePeople } from '@/hooks/useQuerys/usePeoples'
import { Card, CardHeader } from './ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Dispatch, SetStateAction } from 'react'
import ErrorPage from './error-page'
import SelectCardSkeleton from './skeleton-select-card'
import { toast } from 'react-toastify'
import { useUnits } from '@/hooks/useQuerys/useUnits'

interface selectCardProps {
  textHeader: string
  placeHolder: string
  onChange: Dispatch<SetStateAction<string>>
  value?: string
  param: 'people' | 'unit'
}

export default function SelectCard({
  textHeader,
  placeHolder,
  onChange,
  value,
  param,
}: selectCardProps) {
  const { units, isLoading, error } = useUnits({ active: true })
  const {
    people,
    isLoading: isLoadingPeople,
    error: errorPeople,
  } = usePeople({ active: true })

  if (isLoading || isLoadingPeople) return <SelectCardSkeleton />
  if (error || errorPeople) return <ErrorPage />

  return (
    <Card className="mt-5">
      <CardHeader>
        <h6 className="text-sm font-semibold">{textHeader}</h6>
        <Select
          value={value}
          onValueChange={(value) => onChange(value)}
          onOpenChange={(open) => {
            if (param == 'people') {
              if (open && people.length === 0) {
                toast.error('Nenhuma pessoa cadastrada.')
              }
            }
            if (param == 'unit') {
              if (open && units.length === 0) {
                toast.error('Nenhuma unidade cadastrada.')
              }
            }
          }}
        >
          <SelectTrigger className="w-full max-w-80">
            <SelectValue placeholder={placeHolder} className="text-sm" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {param == 'people' &&
                people.map((person) => (
                  <SelectItem value={person.id} key={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              {param == 'unit' &&
                units.map((unit) => (
                  <SelectItem value={unit.id} key={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
    </Card>
  )
}
