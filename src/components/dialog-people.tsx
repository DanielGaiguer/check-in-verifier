import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Dispatch, SetStateAction } from 'react'
import { Button } from './ui/button'
import { useCreatePeople } from '@/hooks/useMutation/useCreatePeople'
import { toast } from 'react-toastify'
import { useUpdatePeople } from '@/hooks/useMutation/useUpdatePeople'

interface DialogPeopleProtocol {
  setName: Dispatch<SetStateAction<string>>
  name: string
  forEdit?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  internalOpen?: boolean
  setInternalOpen?: Dispatch<SetStateAction<boolean>>
  id?: string
  setId?: Dispatch<SetStateAction<string>>
}

export default function DialogPeople({
  setName,
  name,
  forEdit = false,
  open,
  onOpenChange,
  internalOpen,
  setInternalOpen,
  id,
  setId,
}: DialogPeopleProtocol) {
  const createUserMutation = useCreatePeople()
  const updateUserMutation = useUpdatePeople()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (id && id.trim()) {
      updateUserMutation.mutate({ id, name })
      toast.success('Pessoa atualizada com sucesso.')
    } else {
      createUserMutation.mutate({ name })
      toast.success('Pessoa cadastrada com sucesso.')
    }

    setInternalOpen?.(false)
    setName('')
    setId?.('') 
  }
  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogContent className="z-9999 max-h-[85vh] w-[80%] max-w-[80%] overflow-y-auto p-6 md:w-full md:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {name ? 'Editar Pessoa' : 'Nova Pessoa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="name"
              placeholder="Nome da Pessoa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:border-2.5 flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-300 bg-gray-100! px-3 focus:border-blue-400!"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (forEdit) {
                  onOpenChange?.(false)
                } else {
                  setInternalOpen?.(false)
                }
              }}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !name}
              className="cursor-pointer bg-blue-400 hover:bg-blue-300"
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
