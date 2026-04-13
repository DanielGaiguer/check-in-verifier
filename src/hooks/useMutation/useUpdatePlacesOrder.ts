import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlacesOrder } from '@/services/placesService'
import { Place } from '@/types/place'

export function useUpdatePlacesOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePlacesOrder,

    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['places'] })

      const previous = queryClient.getQueryData(['places'])

      queryClient.setQueryData(['places'], (old: any) => {
        if (!old) return newOrder

        // mantém os dados antigos e só atualiza a ordem
        return newOrder.map((newItem: any) => {
          const oldItem = old.find((o: any) => o.id === newItem.id)
          return {
            ...oldItem,
            ...newItem,
          }
        })
      })

      return { previous }
    },
  })
}
