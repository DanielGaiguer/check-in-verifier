import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlacesOrder } from '@/services/placesService'
import { Place } from '@/types/place'
export function useUpdatePlacesOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePlacesOrder,

    onMutate: async (newOrder) => {
      const queryKey = ['places', null]

      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old

        return {
          ...old,
          places: newOrder,
        }
      })

      return { previous, queryKey }
    },

    onError: (_, __, context) => {
      if (context?.previous && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
    },

    onSettled: (_, __, ___, context) => {
      queryClient.invalidateQueries({
        queryKey: context?.queryKey ?? ['places'],
      })
    },
  })
}
