'use client'

import { Upload, X } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload'

type UploadedFile = {
  file: File
  url: string
  tempId: string
}
type FileUploadCircularProgressProps = {
  onFileUploaded?: (file: UploadedFile) => void
  initialFiles?: UploadedFile[] // Nova prop
}

export function FileUploadCircularProgress({
  onFileUploaded,
  initialFiles = [],
}: FileUploadCircularProgressProps) {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>(initialFiles)
  const [files, setFiles] = React.useState<File[]>(initialFiles.map(f => f.file)) // só os arquivos

  const onUpload = React.useCallback(
    async (
      newFiles: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void
        onSuccess: (file: File) => void
        onError: (file: File, error: Error) => void
      }
    ) => {
      const uploadPromises = newFiles.map(async (file) => {
        try {
          for (let i = 0; i <= 10; i++) {
            await new Promise((r) => setTimeout(r, 150))
            onProgress(file, i * 10)
          }

          const result = {
            url: URL.createObjectURL(file),
            id: crypto.randomUUID(),
          }

          onSuccess(file)

          const newUploadedFile: UploadedFile = {
            file,
            url: result.url,
            tempId: result.id,
          }

          // Atualiza estados
          setUploadedFiles((prev) => [...prev, newUploadedFile])
          setFiles((prev) => [...prev, file])
          onFileUploaded?.(newUploadedFile)
        } catch (err) {
          onError(file, err as Error)
        }
      })

      await Promise.all(uploadPromises)
    },
    [onFileUploaded]
  )

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    })
  }, [])

  const handleDelete = (tempId: string, file: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f.tempId !== tempId))
    setFiles((prev) => prev.filter((f) => f !== file))
  }

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      maxFiles={10}
      maxSize={5 * 1024 * 1024}
      className="mt-2 w-full max-w-md rounded-xl bg-red-300"
      onUpload={onUpload}
      onFileReject={onFileReject}
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="text-muted-foreground size-6" />
          </div>
          <p className="text-sm font-medium">Arraste e solte os Arquivos aqui</p>
          <p className="text-muted-foreground text-xs">
            Ou clique em Carregar (max 10 arquivos, até 5MB cada)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Carregar Arquivos
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>

      <FileUploadList orientation="horizontal">
        {uploadedFiles.map((fileObj) => (
          <FileUploadItem key={fileObj.tempId} value={fileObj.file} className="p-0">
            <FileUploadItemPreview className="size-20 [&>svg]:size-12">
              <FileUploadItemProgress variant="circular" size={40} />
            </FileUploadItemPreview>
            <FileUploadItemMetadata className="sr-only" />
            <FileUploadItemDelete asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -top-1 -right-1 size-5 rounded-full"
                onClick={() => handleDelete(fileObj.tempId, fileObj.file)}
              >
                <X className="size-3" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  )
}