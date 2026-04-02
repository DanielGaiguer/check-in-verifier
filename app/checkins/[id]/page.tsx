'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { useDetailsCheckin } from '@/hooks/useQuerys/useDetailsCheckin'
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

export default function DetailsCheckin() {
  const params = useParams()

  // Garante que seja uma string
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const { data: checkin, isLoading, error } = useDetailsCheckin(id || '')
  console.log(checkin)

  if (isLoading) return <p>Carregando checkins...</p>
  if (error) return <p>Erro ao carregar checkins</p>

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
                    ? format(checkin?.createdAt, "dd/MM/yyyy 'às' HH:mm")
                    : 'Sem data'}{' '}
                  — {checkin?.people.name}
                </h4>
              </div>
            </div>
          </div>
          <div>
            <Button
              variant={'ghost'}
              className="cursor-pointer border border-gray-300 p-5 font-normal text-shadow-2xs"
            >
              <PencilIcon className="mr-2" />
              Registar Alteração
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

          {checkin?.items.map((item) => (
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
                  <div className="mt-2 flex flex-row gap-3 overflow-x-auto">
                    {item.photos.map((photo) => (
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
              {checkin.edits.map((edit) => (
                <blockquote
                  key={edit.id}
                  className="ml-5 border-l-2 border-yellow-400 pl-6"
                >
                  <p className="text-sm font-semibold">{edit.editedBy}</p>
                  <p className="text-sm font-semibold text-gray-400">
                    {format(new Date(edit.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                  <p className="text-sm font-semibold">{edit.reason}</p>
                </blockquote>
              ))}
            </Card>
          ) : null}
        </div>
      </div>
    </main>
  )
}
