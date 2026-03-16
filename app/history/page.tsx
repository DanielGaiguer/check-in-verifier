'use client'
import CardCheckin from '@/components/card-checkins'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClipboardCheckIcon } from 'lucide-react'
import { useState } from 'react'

const data = [
	{
		isOK: true,
		people: 'Daniel',
		date: '07/03/2026 às 11:29',
		countPlaces: 4
	},
		{
		isOK: false,
		people: 'Joao',
		date: '06/03/2026 às 11:29',
		countPlaces: 4
	},
		{
		isOK: true,
		people: 'Daniel',
		date: '05/03/2026 às 11:29',
		countPlaces: 4
	},
		{
		isOK: false,
		people: 'Isis',
		date: '04/03/2026 às 11:29',
		countPlaces: 4
	}
]

export default function HistoryPage() {
  const [dateSelect, setDateSelect] = useState('7days')

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Histórico de Check-ins
            </h1>
            <h4 className="text-gray-500 text-sm">
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
                  className="text-gray-600 font-sans font-stretch-150% font-extralight"
                />
              </SelectTrigger>
              <SelectContent sideOffset={0}>
                <SelectGroup className="text-gray-800 font-sans font-stretch-150% font-extralight">
                  <SelectItem
                    value="7days"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200 "
                  >
                    Últimos 7 dias
                  </SelectItem>
                  <SelectItem
                    value="1Month"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200 "
                  >
                    Últimos mês
                  </SelectItem>
                  <SelectItem
                    value="3Month"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200 "
                  >
                    Últimos 3 meses
                  </SelectItem>
                  <SelectItem
                    value="6Month"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200 "
                  >
                    Últimos 6 meses
                  </SelectItem>
                  <SelectItem
                    value="lastYear"
                    className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200 "
                  >
                    Último ano
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
				<div className='mt-5'>
					{data.length > 0 ? (
						data.map((oneData) => (
							<CardCheckin data={oneData} key={oneData.date}/>
						))
					): (
            <Card className='flex justify-center items-center'>
              <ClipboardCheckIcon className='text-gray-300 mt-5' size={55}/>
              <h4 className='text-gray-500 font-light mb-5'>Nenhum check-in encontrado neste período.</h4>
            </Card>
          )}
				</div>
      </div>
    </main>
  )
}
