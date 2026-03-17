import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlacesOrder } from '@/services/placesService'
import { Place } from '@/types/place'

export function useUpdatePlacesOrder() {
  const queryClient = useQueryClient()

// 	No useMutation você tem esses callbacks:

// onMutate → roda antes de enviar para o servidor

// onError → roda se a mutation falhar

// onSettled → roda sempre (sucesso ou erro)

// O problema: se você atualizou o cache no onMutate (optimistic update) e depois a mutation falhar, você precisa saber qual era o estado antigo para restaurar.

// 	mutation.mutate()
// mutation.mutateAsync()
// mutation.isLoading
// mutation.error
  return useMutation({
		//Essa é a função que será executada quando a mutation rodar.
		//Ou seja, quando você fizer: updateOrder.mutate(updatedPlaces)
		//O React Query vai executar: updatePlacesOrder(updatedPlaces) que faz o POST para o servidor.
    mutationFn: updatePlacesOrder, //Essa é a função que será executada quando a mutation rodar.

    // Esse código roda ANTES da mutation ir para o servidor.
		//É aqui que fazemos o optimistic update.

    onMutate: async (newPlaces: Place[]) => {
      await queryClient.cancelQueries({ queryKey: ['places'] }) //Isso cancela qualquer requisição ativa de: useQuery(['places'])
			// Para evitar que uma resposta antiga sobrescreva o optimistic update.

			//Salvar estado anterior
      const previousPlaces = queryClient.getQueryData(['places']) //Isso é salvo para rollback se der erro.

			//Aqui você atualiza o cache imediatamente.
      queryClient.setQueryData(['places'], newPlaces) //A interface atualiza instantaneamente, sem esperar o servidor.

      return { previousPlaces } //Retornar contexto
			//Esse valor será enviado para: onError()
			// como context.
    },

    // rollback se der erro
    onError: (err, newPlaces, context) => {
      queryClient.setQueryData(['places'], context?.previousPlaces)
    },
		//Esse código roda se a mutation falhar.
		//Exemplo:
		//erro de rede
		//erro no backend

    // Esse código roda sempre, independente de sucesso ou erro.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] }) //Isso faz o React Query refazer a query.
			//Ou seja:
			// useQuery(['places'])
			// é executado novamente.
			// Isso garante que os dados estejam sincronizados com o servidor.
    },
  })
}