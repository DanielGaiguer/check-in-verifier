import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlacesOrder } from '@/services/placesService'
import { Place } from '@/types/place'

export function useUpdatePlacesOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePlacesOrder,

    // roda antes de enviar para o servidor
    onMutate: async (newPlaces: Place[]) => {
      await queryClient.cancelQueries({ queryKey: ['places'] })

      const previousPlaces = queryClient.getQueryData<Place[]>(['places'])

      // Atualiza cache imediatamente
      queryClient.setQueryData(['places'], newPlaces)

      // Retorna contexto para rollback
      return { previousPlaces }
    },

    // rollback se der erro
    onError: (err, newPlaces, context) => {
      if (context?.previousPlaces) {
        queryClient.setQueryData(['places'], context.previousPlaces)
      }
    },

    // roda sempre depois da mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })
}
