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
import { useEffect, useState } from 'react'
import { Checkbox } from './ui/checkbox'
import { Field, FieldLabel, FieldLegend, FieldSet } from './ui/field'
import { FileUploadCircularProgress, UploadedFile } from './drop-files'
import FieldObservation from './field-observation'
import { Problem, Photo } from '@/types/typesPayload'

interface PlaceCardProps {
  title: string
  subTitle: string
  arrayProblems: Problem[]
  status?: 'organized' | 'disorganized'
  observation?: string
  selectedProblems?: Problem[]
  onStatusChange?: (status: 'organized' | 'disorganized') => void
  onProblemsChange?: (problems: Problem[]) => void
  onObservationChange?: (obs: string) => void
  onFilesChange?: (files: Photo[]) => void
  initialPhotos?: Photo[]
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
  onFilesChange,
  initialPhotos,
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
  const [files, setFiles] = useState<Photo[]>(initialPhotos || [])

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

  function handleFileUpload(file: UploadedFile) {
    const newPhoto: Photo = { photoId: file.tempId, url: file.url }
    const updatedFiles = [...files, newPhoto]
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  useEffect(() => {
    setSelectedProblems(initialProblems || [])
  }, [initialProblems])

  useEffect(() => {
    setObservation(initialObservation || '')
  }, [initialObservation])

  return (
    <Card className="mt-2 gap-0">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{subTitle}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            className={`dm:w-45 mr-4 w-35 ${status === 'organized' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-100 text-black hover:bg-green-400 hover:text-white'}`}
            onClick={() => handleStatusChange('organized')}
          >
            <CircleCheckIcon />
            <p>Organizado</p>
          </Button>

          <Button
            className={`dm:w-45 mr-4 w-38 ${status === 'disorganized' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-black hover:bg-red-400 hover:text-white'}`}
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
                key={problem.problemId}
                orientation="horizontal"
                className="space-y-0"
              >
                <Checkbox
                  id={problem.problemId}
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

          <div className="mt-4">
            <FileUploadCircularProgress
              onFileUploaded={handleFileUpload}
              initialPhotos={initialPhotos}
            />
          </div>

          <div className="mt-5">
            <Field className="gap-0">
              <FieldObservation
                description="Observação (Opcional)"
                placeholder="Adicione uma observação..."
                class="mt-2 gap-1"
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
