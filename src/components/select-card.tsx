'use client'
import { usePeople } from '@/hooks/useQuerys/usePeoples'
import { Card, CardHeader } from './ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface selectCardProps {
  textHeader: string
  placeHolder: string
  options?: string[]
}

export default function SelectCard({
  textHeader,
  placeHolder,
  options,
}: selectCardProps) {
  const { people, isLoading, error } = usePeople()

  
  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar os pessoas.</p>
  
  return (
    <Card className="mt-5">
      <CardHeader>
        <h6 className="text-sm font-semibold">{textHeader}</h6>
        <Select>
          <SelectTrigger className="w-full max-w-80">
            <SelectValue placeholder={placeHolder} className="text-sm" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectLabel>Fruits</SelectLabel> */}
              {people.map((people) => (
                <SelectItem value={people.name} key={people.id}>{people.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
    </Card>
  )
}
