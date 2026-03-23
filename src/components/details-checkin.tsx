'use client'
import { useCheckins } from '@/hooks/useQuerys/useCheckins'
import { Checkin } from '@/types/typesPayload'
import { useState } from 'react'
import { Button } from './ui/button'

export default function DetailsCheckin(data : Checkin) {
	const [dateSelect, setDateSelect] = useState('7days')

	const { data: checkins, isLoading, error } = useCheckins(dateSelect)

	if (isLoading) return <p>Carregando checkins...</p>
	if (error) return <p>Erro ao carregar checkins</p>

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
			<div className="m-5 flex-1 rounded-t-xl bg-gray-50">
				<div className="flex flex-row justify-between">
					<div>
						<h1 className="font-sans text-2xl font-semibold tracking-tight">
							Detalhes do Check-in
						</h1>
						<h4 className="text-sm text-gray-500">
							{data.date} - {data.people.name}
						</h4>
					</div>
					<div>
						<Button variant={'ghost'}></Button>
					</div>
				</div>
			</div>
		</main>
	)
}
