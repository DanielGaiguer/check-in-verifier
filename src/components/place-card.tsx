'use client'
import { CircleCheckIcon, CircleXIcon } from 'lucide-react'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { useState } from 'react'
import { Checkbox } from './ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from './ui/field'
import { FileUploadCircularProgress } from './drop-files'

interface placeCardProps {
  title: string
  subTitle: string
  arrayProblems: string[]
}

//TODO: Deixar interativo, colocar state, e tipar a requisicao do componente, olocar map com dados
export default function PlaceCard({
  title,
  subTitle,
  arrayProblems,
}: placeCardProps) {
  const [status, setStatus] = useState<boolean | undefined>(undefined)

  return (
    <Card className='gap-0'>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{subTitle}</CardDescription>
        </div>
        <div >
          <Button
            className={`dm:w-45 mr-4 w-35 bg-gray-100 text-black hover:bg-green-400 hover:text-white ${status ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setStatus(true)}
          >
            <CircleCheckIcon />
            <p className=" ">Organizado</p>
          </Button>
          <Button
            className={`dm:w-45 mr-4 w-38 bg-gray-100 text-black hover:bg-red-400 hover:text-white ${status === false ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setStatus(false)}
          >
            <CircleXIcon />
            <p className="">Desorganizado</p>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {status === false && (
          <div className='mt-4'>
            <FieldSet className="gap-1.5 space-y-0">
              <FieldLegend variant="label" className='mb-2.5'>Problemas encontrados *</FieldLegend>
              {arrayProblems.map((problem) => (
                <Field orientation="horizontal" className="space-y-0">
                  <Checkbox
                    className="h-5 w-5 rounded-3xl"
                    id={problem}
                    name={problem}
                    defaultChecked
                  />
                  <FieldLabel htmlFor={problem} className="text-sm font-normal">
                    {problem}
                  </FieldLabel>
                </Field>
              ))}
            </FieldSet>
          </div>
        )}
        {status === false && (
          <div className="mt-5">
            <Field className="gap-2">
              <FieldLegend variant="label" className="mb-0">
                Fotos (Opcional, máx. 5)
              </FieldLegend>
              <FileUploadCircularProgress
                onFileUploaded={(file) =>
                  console.log('Arquivo carregado:', file)
                }
              />
            </Field>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
