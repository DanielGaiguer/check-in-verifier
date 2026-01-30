import { User,  } from "@/types/checkin"

export async function getDataForCheckin() {
	
}


export async function getUsers(): Promise<User[]> {
	const response = await fetch(`${process.env.URL}/api/users`, {cache: 'no-store'})

	return response.json()
}

// async function getPlaces(): Promise<places