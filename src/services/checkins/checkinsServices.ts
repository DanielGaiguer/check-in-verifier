'use server'
import { GetDataForCheckinProtocol } from "@/types/dataForCheckinProtocol"

type CreateCheckinInput = {
  date: string
  userId: string
  places: {
    placeId: string
    status: 'organized' | 'disorganized'
    issues?: string[]
    photos?: string[]
    observation?: string
  }[]
}


export async function getDataForCheckin(): Promise<GetDataForCheckinProtocol> {
	const response = await fetch(`${process.env.URL}/api/checkins/init`, {cache: 'no-store'})
	return response.json()	
}

export async function postDataForCheckin(
  data: CreateCheckinInput
) {
  const response = await fetch(`${process.env.URL}/api/checkins/`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error('Erro ao salvar check-in')
  }

  return response.json()
}
