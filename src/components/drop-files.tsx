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
}

export function FileUploadCircularProgress({
  onFileUploaded,
}: FileUploadCircularProgressProps) {
  const [files, setFiles] = React.useState<File[]>([])

  const onUpload = React.useCallback(
    async (
      files: File[],
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
      // Process each file individually
      const uploadPromises = files.map(async (file) => {
        try {
          for (let i = 0; i <= 10; i++) {
            await new Promise((r) => setTimeout(r, 150))
            onProgress(file, i * 10)
          }

          // 🔥 resultado simulado do servidor
          const result = {
            url: URL.createObjectURL(file),
            id: crypto.randomUUID(),
          }

          onSuccess(file)

          // Personalizacao de componente daqui pra baixo
          onFileUploaded?.({
            file,
            url: result.url,
            tempId: result.id,
          })
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
          <p className="text-sm font-medium">
            Arraste e solte os Arquivos aqui
          </p>
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
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} className="p-0">
            <FileUploadItemPreview className="size-20 [&>svg]:size-12">
              <FileUploadItemProgress variant="circular" size={40} />
            </FileUploadItemPreview>
            <FileUploadItemMetadata className="sr-only" />
            <FileUploadItemDelete asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -top-1 -right-1 size-5 rounded-full"
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
