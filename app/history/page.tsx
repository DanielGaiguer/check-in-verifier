'use client'
import CardCheckin from '@/components/card-checkins'
import ErrorPage from '@/components/error-page'
import { SkeletonHistoryPage } from '@/components/history-skeleton'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCheckins } from '@/hooks/useQuerys/useCheckins'
import { ClipboardCheckIcon } from 'lucide-react'
import { useState } from 'react'


export default function HistoryPage() {
  const [dateSelect, setDateSelect] = useState('7d')

  const { data: checkins, isLoading, error } = useCheckins(dateSelect)

  if (isLoading) return <SkeletonHistoryPage />
  if (error) return  <ErrorPage />

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Histórico de Check-ins
            </h1>
            <h4 className="text-sm text-gray-500">
              Vizualize todos os check-ins realizados
            </h4>
          </div>
          <div>
            <Select
              value={dateSelect}
              onValueChange={(value) => setDateSelect(value)}
            >
              <SelectTrigger className="w-45">
                <SelectValue
                  placeholder="Últimos 7 dias"
                  className="font-sans font-semibold text-gray-600 font-stretch-150%"
                />
              </SelectTrigger>
              <SelectContent sideOffset={0}>
                <SelectGroup className="font-sans font-extralight text-gray-800 font-stretch-150%">
                  <SelectItem
                    value="7d"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200"
                  >
                    Últimos 7 dias
                  </SelectItem>
                  <SelectItem
                    value="1m"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200"
                  >
                    Últimos mês
                  </SelectItem>
                  <SelectItem
                    value="3m"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200"
                  >
                    Últimos 3 meses
                  </SelectItem>
                  <SelectItem
                    value="6m"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200"
                  >
                    Últimos 6 meses
                  </SelectItem>
                  <SelectItem
                    value="12m"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200"
                  >
                    Último ano
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-5">
          {checkins && checkins.length > 0 ? (
            checkins.map((oneData) => (
              <CardCheckin data={oneData} key={oneData.checkinId} />
            ))
          ) : (
            <Card className="flex items-center justify-center">
              <ClipboardCheckIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Nenhum check-in encontrado neste período.
              </h4>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
