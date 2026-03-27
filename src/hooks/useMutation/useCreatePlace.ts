import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createPlace(data: { labId: string, name: string, sortOrder?: number, problemIds: string[]}) {
	const response = await fetch('/api/place', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		throw new Error('Erro ao cadastrar local')
	}

	return response.json()
}

export function useCreatePlace() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createPlace,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['place'] })
		},
	})
}