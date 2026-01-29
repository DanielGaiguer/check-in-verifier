import { User } from "@/types/checkin"

export async function getUsers(): Promise<User[]> {
	const response = await fetch(`${process.env.URL}/api/users`, {cache: 'no-store'})

	return response.json()
}