import { GetDataForCheckinProtocol } from "@/types/dataForCheckinProtocol"

export async function getDataForCheckin(): Promise<GetDataForCheckinProtocol> {
	const response = await fetch(`${process.env.URL}/api/checkins/init`, {cache: 'no-store'})
	return response.json()	
}
