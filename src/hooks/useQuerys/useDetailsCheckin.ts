import { Checkin } from '@/types/typesPayload'
import { useQuery } from '@tanstack/react-query'


export function useDetailsCheckin(id: string) {
	 return useQuery<Checkin>({
		queryKey: ['checkins', id],
		queryFn: async () => {
			const res = await fetch(`/api/history-checkins/${id}`);
			if (!res.ok) throw new Error('Erro ao buscar checkins');
			const json = await res.json();
			return json.data as Checkin;
		},
		enabled: !!id
	})
}
