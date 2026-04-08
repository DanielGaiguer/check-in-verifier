'use client'

import SelectCard from '@/components/select-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useDetailsCheckin } from '@/hooks/useQuerys/useDetailsCheckin'
import { usePeople } from '@/hooks/useQuerys/usePeoples'
import { format } from 'date-fns'
import {
  CircleCheckIcon,
  CircleXIcon,
  HistoryIcon,
  PencilIcon,
  ArrowLeftIcon,
} from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function DetailsCheckin() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState<string>('')
  const [reason, setReason] = useState<string>('')

  const params = useParams()
  const router = useRouter()
  const id =
    params?.id && !Array.isArray(params.id) ? params.id : params?.id?.[0]

  const { data: checkin, isLoading, error } = useDetailsCheckin(id || '')
  const {
    people: peopleList,
    isLoading: isLoadingPeople,
    error: errorPeople,
  } = usePeople()

  // UseEffect para preencher os dados do check-in no formulário e na modal
  useEffect(() => {
    if (!checkin) return

    // Inicializa responsável e observação geral
    setSelectedPersonId(checkin.people.id)
    setReason('') // Se quiser inicializar com a última alteração, poderia pegar do checkin.edits
  }, [checkin])

  if (isLoading || isLoadingPeople) return <p>Carregando checkins...</p>
  if (error || errorPeople) return <p>Erro ao carregar checkins</p>

  async function handleEditCheckin() {
    try {
      if (!selectedPersonId || !reason) {
        toast.error('É necessário preencher todos os campos.')
        return
      }

      const responseEdit = await fetch('/api/checkin-edits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkinId: id,
          editedBy: selectedPersonId,
          reason: reason,
        }),
      })

      const data = await responseEdit.json()

      if (!data.success) {
        toast.error('Erro ao editar check-in: ' + data.error)
        return
      }

      toast.success('Alteração registrada com sucesso!')
    } catch (e) {
      console.log('Erro ao tentar enviar edição: ', e)
      toast.error('Erro ao enviar alteração.')
    }

    setDialogOpen(false)
    router.push(`/checkins/${id}/edit`)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <div className="mb-3 flex h-12 items-center">
              <Button
                className="mr-3 flex cursor-pointer items-center gap-2 border-0 bg-gray-50 hover:bg-gray-50"
                onClick={() => window.history.back()}
              >
                <ArrowLeftIcon
                  className="h-6 w-6 bg-gray-50 text-black hover:bg-gray-200"
                  size={20}
                />
              </Button>
              <div>
                <h1 className="font-sans text-2xl font-semibold tracking-tight">
                  Detalhes do Check-in
                </h1>
                <h4 className="text-sm text-gray-500">
                  {checkin?.createdAt
                    ? format(
                        new Date(checkin?.createdAt),
                        "dd/MM/yyyy 'às' HH:mm"
                      )
                    : 'Sem data'}{' '}
                  — {checkin?.people.name}
                </h4>
              </div>
            </div>
          </div>
          <div>
            <Button
              variant={'ghost'}
              onClick={() => setDialogOpen(true)}
              className="cursor-pointer border border-gray-300 p-5 font-normal text-shadow-2xs"
            >
              <PencilIcon className="mr-2" />
              Registrar Alteração
            </Button>
          </div>
        </div>

        <div className="mt-5">
          {checkin?.observation && (
            <Card className="mb-3">
              <div className="ml-5 flex flex-col">
                <CardTitle className="mb-2 font-semibold">
                  Observação Geral
                </CardTitle>
                <CardDescription>{checkin.observation}</CardDescription>
              </div>
            </Card>
          )}

          {checkin?.items
            .slice()
            .sort((a, b) => (a.place.order ?? 0) - (b.place.order ?? 0))
            .map((item) => (
              <Card
                key={item.itemId}
                className={`mt-2 hover:shadow-md ${
                  item.status === 'organized'
                    ? 'border-green-400'
                    : item.status === 'disorganized'
                      ? 'border-red-400'
                      : 'border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="ml-4 flex items-center">
                    {item.status === 'organized' ? (
                      <CircleCheckIcon className="text-green-400" />
                    ) : item.status === 'disorganized' ? (
                      <CircleXIcon className="text-red-400" />
                    ) : (
                      <CircleXIcon className="text-gray-400" />
                    )}
                    <div className="ml-3">
                      <CardTitle className="font-normal">
                        {item.place.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {item.place.labName}
                      </CardDescription>
                    </div>
                  </div>
                  <div>
                    {item.status === 'organized' ? (
                      <Badge className="mr-5 bg-green-100 text-green-600">
                        Organizado
                      </Badge>
                    ) : item.status === 'disorganized' ? (
                      <Badge className="mr-5 bg-red-100 text-red-600">
                        Desorganizado
                      </Badge>
                    ) : (
                      <Badge className="mr-5 bg-gray-100 text-gray-600">
                        Não checado
                      </Badge>
                    )}
                  </div>
                </div>
                {item.status === 'disorganized' && (
                  <CardContent>
                    <p className="text-sm">Problemas:</p>
                    {item.problems.map((problem) => (
                      <div key={problem.problemId} className="mt-1 ml-2">
                        <Badge className="mr-5 h-5 bg-red-100 text-red-600">
                          {problem.name}
                        </Badge>
                      </div>
                    ))}
                    <p className="mt-4 text-sm">Observação:</p>
                    <p className="text-sm">{item.observation}</p>
                    <p className="mt-4 text-sm">Fotos Anexadas:</p>
                    <div className="mt-2 flex flex-row gap-3 overflow-x-auto">
                      {item.photos?.map((photo) => (
                        <Image
                          key={photo.photoId}
                          src={photo.url}
                          alt="Foto do problema"
                          width={130}
                          height={130}
                          className="shrink-0 rounded-xl"
                        />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

          {checkin?.edits?.length ? (
            <Card className="mt-3">
              <CardTitle className="ml-3 flex items-center gap-2">
                <HistoryIcon />
                Histórico de alterações
              </CardTitle>
              {checkin.edits.map((edit, index) => {
                const personName =
                  peopleList?.find((p) => p.id === edit.editedBy)?.name ??
                  edit.editedBy

                return (
                  <blockquote
                    key={edit.id ?? index}
                    className="ml-5 border-l-2 border-yellow-400 pl-6"
                  >
                    <p className="text-sm font-semibold">{personName}</p>

                    <p className="text-sm font-semibold text-gray-400">
                      {edit.editedCreatedAt
                        ? format(
                            new Date(edit.editedCreatedAt),
                            'dd/MM/yyyy HH:mm'
                          )
                        : 'Sem data'}
                    </p>

                    <p className="text-sm font-semibold text-gray-400">
                      Motivo:
                      <span className="text-sm font-semibold text-gray-800">
                        {' '}
                        {edit.editedReason}
                      </span>
                    </p>
                  </blockquote>
                )
              })}
            </Card>
          ) : null}
        </div>

        {dialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="animate-fadeIn absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setDialogOpen(false)}
            />
            <div className="animate-modalIn relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
              <h1 className="font-sans text-2xl font-semibold tracking-tight">
                Registrar Alteração
              </h1>
              <SelectCard
                textHeader="Responsável pela alteração *"
                placeHolder="Selecione a pessoa"
                value={selectedPersonId}
                onChange={setSelectedPersonId}
              />
              <div className="mt-3 ml-1.5">
                <Field>
                  <FieldLabel htmlFor="">
                    Qual o motivo da alteração?
                  </FieldLabel>
                  <Textarea
                    onChange={(e) => setReason(e.target.value)}
                    value={reason}
                    placeholder="Motivo da alteração"
                  />
                </Field>
              </div>
              <div className="mt-5 flex justify-end">
                <Button
                  onClick={() => setDialogOpen(false)}
                  className="w-25"
                  variant={'outline'}
                >
                  Cancelar
                </Button>
                <Button
                  className="ml-5 w-25 bg-green-400 text-gray-800 hover:bg-green-300"
                  onClick={handleEditCheckin}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
