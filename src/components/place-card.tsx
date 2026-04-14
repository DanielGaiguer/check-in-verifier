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
      <CardHeader className="flex flex-col justify-between sm:flex-row sm:justify-between md:flex-row md:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{subTitle}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            className={`w-34 md:mr-4 md:w-45 ${status === 'organized' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-100 text-black hover:bg-green-400 hover:text-white'}`}
            onClick={() => handleStatusChange('organized')}
          >
            <CircleCheckIcon />
            <p>Organizado</p>
          </Button>

          <Button
            className={`w-34 md:mr-4 md:w-45 ${status === 'disorganized' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-black hover:bg-red-400 hover:text-white'}`}
            onClick={() => handleStatusChange('disorganized')}
          >
            <CircleXIcon />
            <p>Desorganizado</p>
          </Button>
        </div>
      </CardHeader>

      {status === 'disorganized' && (
        <CardContent>
          <FieldSet className="mt-5 gap-1.5 space-y-0">
            <FieldLegend variant="label" className="mb-2.5">
              Problemas encontrados *
            </FieldLegend>
            {arrayProblems.map((problem) => (
              <Field
                key={problem.problemId}
                orientation="horizontal"
                className="flex items-center gap-0.5 rounded-md px-0.5 py-0.5 active:bg-gray-100"
              >
                {/* <input
                  type="checkbox"
                  checked={selectedProblems.some(
                    (p) => p.problemId === problem.problemId
                  )}
                  onChange={() => {
                    console.log('funcionou')
                    setSelectedProblems((prev) => {
                      const exists = prev.some(
                        (p) => p.problemId === problem.problemId
                      )

                      const updated = exists
                        ? prev.filter((p) => p.problemId !== problem.problemId)
                        : [...prev, problem]

                      onProblemsChange?.(updated)
                      return updated
                    })
                  }}
                /> */}
                <Checkbox
                  //Todo realizar teste
                  className="sm:h-5 sm:w-5 lg:h-5 lg:w-5"
                  id={`${subTitle}-${problem.problemId}`}
                  checked={selectedProblems.some(
                    (p) => p.problemId === problem.problemId
                  )}
                  onCheckedChange={() => {
                    console.log('funcionou')
                    setSelectedProblems((prev) => {
                      const exists = prev.some(
                        (p) => p.problemId === problem.problemId
                      )

                      const updated = exists
                        ? prev.filter((p) => p.problemId !== problem.problemId)
                        : [...prev, problem]

                      onProblemsChange?.(updated)
                      return updated
                    })
                  }}
                />
                <FieldLabel
                  className="text-md ml-1 font-normal"
                  onClick={() => {
                    setSelectedProblems((prev) => {
                      let updated: Problem[]
                      const isSelected = prev.some(
                        (p) => p.problemId === problem.problemId
                      )
                      if (isSelected) {
                        updated = prev.filter(
                          (p) => p.problemId !== problem.problemId
                        )
                      } else {
                        updated = [...prev, problem]
                      }
                      onProblemsChange?.(updated)
                      return updated
                    })
                  }}
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
