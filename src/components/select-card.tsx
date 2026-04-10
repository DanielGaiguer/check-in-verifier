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

interface selectCardProps {
  textHeader: string
  placeHolder: string
  onChange: Dispatch<SetStateAction<string>>
  value?: string
}

export default function SelectCard({
  textHeader,
  placeHolder,
  onChange,
  value,
}: selectCardProps) {
  const { people, isLoading, error } = usePeople({ active: true })

  if (isLoading) return <SelectCardSkeleton />
  if (error) return <ErrorPage />


  return (
    <Card className="mt-5">
      <CardHeader>
        <h6 className="text-sm font-semibold">{textHeader}</h6>
        <Select
          value={value}
          onValueChange={(value) => onChange(value)}
          onOpenChange={(open) => {
            if (open && people.length === 0) {
              toast.error('Nenhuma pessoa cadastrada.')
            }
          }}
        >
          <SelectTrigger className="w-full max-w-80">
            <SelectValue placeholder={placeHolder} className="text-sm" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {people.map((person) => (
                <SelectItem value={person.id} key={person.id}>
                  {person.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
    </Card>
  )
}
