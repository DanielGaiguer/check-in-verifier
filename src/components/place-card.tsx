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

interface placeCardProps {
  title: string
  subTitle: string
}

//TODO: Deixar interativo, colocar state, e tipar a requisicao do componente, olocar map com dados
export default function PlaceCard({ ...props }: placeCardProps) {
  const [status, setStatus] = useState<boolean | undefined>(undefined)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.subTitle}</CardDescription>
        <div>
          <Button
            className={`mr-4 w-45 bg-gray-100 text-black hover:bg-green-400 hover:text-white ${status ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setStatus(true)}
          >
            <CircleCheckIcon />
            <p className=" ">Organizado</p>
          </Button>
          <Button
            className={`mr-4 w-45 bg-gray-100 text-black hover:bg-red-400 hover:text-white ${status === false ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setStatus(false)}
          >
            <CircleXIcon />
            <p className="">Desorganizado</p>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {status === false && (
            <FieldSet className="mt-2">
              <FieldLegend variant="label">Problemas encontrados *</FieldLegend>
              <FieldGroup className="gap-3">
                <Field orientation="horizontal">
                  <Checkbox
                    className="h-6 w-6 rounded-3xl"
                    id="finder-pref-9k2-hard-disks-ljj-checkbox"
                    name="finder-pref-9k2-hard-disks-ljj-checkbox"
                    defaultChecked
                  />
                  <FieldLabel
                    htmlFor="finder-pref-9k2-hard-disks-ljj-checkbox"
                    className="font-normal"
                  >
                    Hard disks
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
