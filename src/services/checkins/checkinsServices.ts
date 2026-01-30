export async function getDataForCheckin() {
	const response = await fetch(`${process.env.URL}/api/checkins/init`, {cache: 'no-store'})

	return response.json()
}
