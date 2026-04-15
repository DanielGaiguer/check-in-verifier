import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
        <DialogHeader className="text-lg font-semibold">
          <DialogTitle>Deletar {title}</DialogTitle>
        </DialogHeader>

        <form className="mt-2 space-y-5">
          <Label>Tem certeza que dejesa deletar {title}?</Label>
          <div className="mt-8 flex flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-4 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="cursor-pointer bg-blue-400 p-4 hover:bg-blue-300"
              onClick={() => {
                handleDelete()
                onOpenChange(false)
              }}
            >
              Deletar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
