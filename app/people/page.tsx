'use client'
import { EditCard } from '@/components/edit-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FlaskConicalIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { Icons } from 'react-toastify'

const data = [
  {
    id: '342343',
    name: 'Isis',
    createdAt: '16/03/2026',
  },
  {
    id: '342343e',
    name: 'Daniel',
    createdAt: '16/03/2026',
  },
  {
    id: '34234a',
    name: 'Joao',
    createdAt: '16/03/2026',
  },
]

export default function PeoplePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Pessoas
            </h1>
            <h4 className="text-sm text-gray-500">
              Cadastre as pessoas que realizam check-ins
            </h4>
          </div>
          <div>
            <Button className="w-40 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300">
              <PlusIcon className="mr-1 mb-0.5" />
              Nova Pessoa
            </Button>
          </div>
        </div>
        <div className="mt-5">
          {data.length > 0 ? (
            data.map((people) => {
              const initial = people.name.charAt(0).toUpperCase()
              return (
                <Card className="flex w-full flex-row gap-3 shadow-xs transition hover:shadow-md md:flex-row mt-2 h-20" key={people.id}>
                  <CardHeader className="flex items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50`}
                    >
                      <span className={`text-blue-400`} >{initial}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 items-center justify-between">
                    <div>
                      <CardTitle className="text-md font-sans font-normal">
                        {people.name}
                      </CardTitle>

                      {people.createdAt && (
                        <CardDescription className="font-sans text-sm">
                          Criado em {people.createdAt}
                        </CardDescription>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="bg-white hover:bg-blue-50">
                        <PencilIcon className="text-black" size={25} />
                      </Button>
                      <Button className="bg-white hover:bg-blue-50">
                        <Trash2Icon className="text-red-400" size={25} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="flex items-center justify-center">
              <FlaskConicalIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Ainda não foi cadastrado nenhum problema.
              </h4>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
