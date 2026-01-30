import { User } from "@/types/checkin"
// import { Places } from "@/types/places"

export async function getUsers(): Promise<User[]> {
	const response = await fetch(`${process.env.URL}/api/users`, {cache: 'no-store'})

	return response.json()
}