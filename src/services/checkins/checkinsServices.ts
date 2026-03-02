'use server'
import { GetDataForCheckinProtocol } from "@/types/dataForCheckinProtocol"

export async function getDataForCheckin(): Promise<GetDataForCheckinProtocol> {
	const response = await fetch(`${process.env.URL}/api/checkins/init`, {cache: 'no-store'})
	return response.json()	
}

export async function postDataForCheckin(
  data: Partial<CheckinSubmit>
) {
  const response = await fetch(`${process.env.URL}/api/checkins/`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  return response.json()
}