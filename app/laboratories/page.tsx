'use client'

import DialogDelete from '@/components/dialog-delete'
import DialogLaboratories from '@/components/dialog-laboratories'
import ErrorPage from '@/components/error-page'
import { SkeletonLaboratoriesPage } from '@/components/laboratories-skeleton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDeleteLab } from '@/hooks/useMutation/useDeleteLab'
import { useLaboratories } from '@/hooks/useQuerys/useLaboratories'
import { useUnits } from '@/hooks/useQuerys/useUnits'
import {
  FlaskConicalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LaboratoriesPage() {
  const { laboratories, isLoading, error } = useLaboratories()
  const { units, isLoading: isLoadingUnits, error: errorUnits } = useUnits()

  const deleteLabMutation = useDeleteLab()

  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [internalOpen, setInternalOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [unitSelect, setUnitSelect] = useState('')
  const [unitSelectDialog, setUnitSelectDialog] = useState('')

  useEffect(() => {
    if (units?.length && !unitSelect) {
      setUnitSelect(units[0].id)
    }
  }, [units, unitSelect])

  function handleDelete() {
    deleteLabMutation.mutate({ id })
    toast.success('Laboratório deletado com sucesso.')
  }

  if (isLoading || isLoadingUnits) return <SkeletonLaboratoriesPage />
  if (error || errorUnits) return <ErrorPage />

  const filteredLabs = unitSelect
    ? laboratories.filter((lab) => lab.unitId === unitSelect)
    : laboratories

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        {/* HEADER */}
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Laboratórios
            </h1>
            <h4 className="text-sm text-gray-500">
              Gerencie os laboratórios cadastrados
            </h4>
          </div>

          <div className="space-y-3">
            <Button
              className="w-38 rounded-md bg-blue-400 p-5 text-white hover:bg-blue-300 text-sm"
              onClick={() => {
                setInternalOpen(true)
                setName('')
                setId('')
              }}
            >
              <PlusIcon className="mb-0.5" />
              Novo Laboratório
            </Button>
            <Select value={unitSelect} onValueChange={setUnitSelect}>
              <SelectTrigger className="w-38">
                <SelectValue placeholder="Todas as unidades" />
              </SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5">
          {filteredLabs.length > 0 ? (
            filteredLabs.map((lab) => (
              <Card
                key={lab.id}
                className="mt-2 flex h-20 w-full flex-row gap-3 shadow-xs transition hover:shadow-md"
              >
                <CardHeader className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <FlaskConicalIcon className="text-blue-400 w-40" size={22} />
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 items-center justify-between">
                  <div>
                    <CardTitle className="text-md font-sans font-normal">
                      {lab.name}
                    </CardTitle>

                    {lab.createdAt && (
                      <CardDescription>
                        Criado em {lab.createdAt}
                      </CardDescription>
                    )}
                  </div>

                  <div className="flex gap-2 ">
                    <Button
                    className='bg-white hover:bg-blue-50'
                      onClick={() => {
                        setInternalOpen(true)
                        setName(lab.name)
                        setId(lab.id)
                        setUnitSelectDialog(lab.unitId)
                      }}
                    >
                      <PencilIcon className='text-black' size={25} />
                    </Button>

                    <Button
                    className='bg-white hover:bg-blue-50'
                      onClick={() => {
                        setOpenDelete(true)
                        setName(lab.name)
                        setId(lab.id)
                      }}
                    >
                      <Trash2Icon className="text-red-400" size={25} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="flex items-center justify-center">
              <FlaskConicalIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Nenhum laboratório nesta unidade.
              </h4>
            </Card>
          )}
        </div>

        <DialogLaboratories
          setName={setName}
          name={name}
          setUnitId={setUnitSelectDialog}
          unitId={unitSelect}
          forEdit={!!id}
          setInternalOpen={setInternalOpen}
          internalOpen={internalOpen}
          id={id}
        />

        {openDelete && (
          <DialogDelete
            title={name}
            open={openDelete}
            onOpenChange={setOpenDelete}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </main>
  )
}
