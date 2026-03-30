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
import { Field, FieldLabel, FieldLegend, FieldSet } from './ui/field'
import { FileUploadCircularProgress } from './drop-files'
import FieldObservation from './field-observation'
import { Problem } from '@/types/typesPayload'

// Props do PlaceCard
interface PlaceCardProps {
  title: string
  subTitle: string
  arrayProblems: Problem[] // problemas possíveis do local
  status?: 'organized' | 'disorganized' // estado inicial opcional
  observation?: string // observação inicial opcional
  selectedProblems?: Problem[] // problemas já selecionados
  onStatusChange?: (status: 'organized' | 'disorganized') => void
  onProblemsChange?: (problems: Problem[]) => void
  onObservationChange?: (obs: string) => void
}

export default function PlaceCard({
  title,
  subTitle,
  arrayProblems,
  status: initialStatus,
  observation: initialObservation,
  selectedProblems: initialProblems,
  onStatusChange,
  onProblemsChange,
  onObservationChange,
}: PlaceCardProps) {
  const [status, setStatus] = useState<
    'organized' | 'disorganized' | undefined
  >(initialStatus)
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>(
    initialProblems || []
  )
  const [observation, setObservation] = useState<string>(
    initialObservation || ''
  )

  function toggleProblem(problem: Problem) {
    let updatedProblems: Problem[]
    if (selectedProblems.some((p) => p.problemId === problem.problemId)) {
      updatedProblems = selectedProblems.filter(
        (p) => p.problemId !== problem.problemId
      )
    } else {
      updatedProblems = [...selectedProblems, problem]
    }
    setSelectedProblems(updatedProblems)
    onProblemsChange?.(updatedProblems)
  }

  function handleStatusChange(newStatus: 'organized' | 'disorganized') {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }

  function handleObservationChange(value: string) {
    setObservation(value)
    onObservationChange?.(value)
  }

  return (
    <Card className="mt-2 gap-0">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{subTitle}</CardDescription>
        </div>
        <div>
          <Button
            className={`dm:w-45 mr-4 w-35 ${
              status === 'organized'
                ? 'bg-green-500 text-white hover:bg-green-600' // hover mais escuro se selecionado
                : 'bg-gray-100 text-black hover:bg-green-400 hover:text-white'
            }`}
            onClick={() => handleStatusChange('organized')}
          >
            <CircleCheckIcon />
            <p>Organizado</p>
          </Button>

          <Button
            className={`dm:w-45 mr-4 w-38 ${
              status === 'disorganized'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-100 text-black hover:bg-red-400 hover:text-white'
            }`}
            onClick={() => handleStatusChange('disorganized')}
          >
            <CircleXIcon />
            <p>Desorganizado</p>
          </Button>
        </div>
      </CardHeader>
      {status === 'disorganized' && (
        <CardContent>
          <FieldSet className="gap-1.5 space-y-0">
            <FieldLegend variant="label" className="mb-2.5">
              Problemas encontrados *
            </FieldLegend>
            {arrayProblems.map((problem) => (
              <Field
                orientation="horizontal"
                className="space-y-0"
                key={problem.problemId}
              >
                <Checkbox
                  id={problem.problemId}
                  name={problem.problemId}
                  checked={selectedProblems.some(
                    (p) => p.problemId === problem.problemId
                  )}
                  onCheckedChange={() => toggleProblem(problem)}
                />
                <FieldLabel
                  htmlFor={problem.problemId}
                  className="text-sm font-normal"
                >
                  {problem.name}
                </FieldLabel>
              </Field>
            ))}
          </FieldSet>
          <div className="mt-5">
            <Field className="gap-0">
              <FieldLegend variant="label" className="mb-0">
                Fotos (Opcional, máx. 5)
              </FieldLegend>
              <FileUploadCircularProgress
                onFileUploaded={(file) =>
                  console.log('Arquivo carregado:', file)
                }
              />
              <FieldObservation
                description="Observação (Opcional)"
                placeholder="Adicione uma observação..."
                class="mt-6 gap-1"
                value={observation}
                onChange={handleObservationChange}
              />
            </Field>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
