'use client'
import CardCheckin from '@/components/card-checkins'
import { InfoCard } from '@/components/info-card'
import { LabCard } from '@/components/lab-card'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ClipboardCheckIcon,
  FlaskConical,
  FlaskConicalIcon,
	PlusIcon,
} from 'lucide-react'
import { useState } from 'react'

const data = [
  {
    id: '342343',
    name: 'Lab 30',
    createdAt: '07/03/2026',
  },
  {
    id: '342343e',
    name: 'Lab 31',
    createdAt: '07/03/2026',
  },
]

export default function LaboratoriesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Laboratórios
            </h1>
            <h4 className="text-sm text-gray-500">
              Gerencie os laboratórios cadastrados
            </h4>
          </div>
					<div>
						<Button className='bg-blue-400 text-white p-5.5 font-sans rounded-md hover:bg-blue-500'>
							<PlusIcon className='mr-1 mb-0.5'/>
							Novo Laboratório
						</Button>
					</div>
        </div>
        <div className="mt-5">
          {data.length > 0 ? (
            data.map((lab) => (
              <div className="mt-2">
                <LabCard
                  title={lab.name}
                  description={`Criado em ${lab.createdAt}`}
                  iconName="FlaskConicalIcon"
                />
              </div>
            ))
          ) : (
            <Card className="flex items-center justif y-center">
              <FlaskConicalIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Ainda não foi cadastrado nenhum laboratório.
              </h4>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
