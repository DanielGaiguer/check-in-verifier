import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Dispatch, SetStateAction } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'

interface DialogDeleteProtocol {
  title: string
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  handleDelete: () => void
}

export default function DialogDelete({
  title,
  open,
  onOpenChange,
  handleDelete,
}: DialogDeleteProtocol) {
  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    console.log('enviou')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Deletar {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Tem certeza que dejesa deletar {title}?</Label>
          <div className='flex flex-row justify-end'>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-blue-400 hover:bg-blue-300"
              onClick={() => handleDelete()}
            >
              Deletar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
