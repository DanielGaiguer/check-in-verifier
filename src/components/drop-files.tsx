'use client'

import { CameraIcon, Upload, X } from 'lucide-react'
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
import { supabase } from '@/db/supabaseClient'

export type UploadedFile = {
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
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const [files, setFiles] = React.useState<File[]>([])

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
          // Simula progresso inicial (opcional)
          for (let i = 0; i <= 10; i++) {
            await new Promise((r) => setTimeout(r, 100))
            onProgress(file, i * 10)
          }

          // Gera um nome único para evitar sobrescrita
          const fileName = `${crypto.randomUUID()}-${file.name}`

          const { data, error } = await supabase.storage
            .from('checkin-uploads')
            .upload(`uploads/${fileName}`, file)

          if (error) {
            console.error('SUPABASE ERROR:', error)
            throw error
          }

          const url = supabase.storage
            .from('checkin-uploads')
            .getPublicUrl(`uploads/${fileName}`).data.publicUrl
          // Sucesso no upload
          onSuccess(file)


          const newUploadedFile: UploadedFile = {
            file,
            url,
            tempId: crypto.randomUUID(),
          }

          // Atualiza estados
          setUploadedFiles((prev) => [...prev, newUploadedFile])
          setFiles((prev) => [...prev, file])

          // Callback externo
          onFileUploaded?.(newUploadedFile)
        } catch (err) {
          onError(file, err as Error)
          toast.error(`Erro ao enviar ${file.name}`)
        }
      })

      await Promise.all(uploadPromises)
    },
    [onFileUploaded]
  )

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" foi rejeitado`,
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
      maxFiles={5}
      maxSize={5 * 1024 * 1024} // 5MB
      className="mt-2 max-w-[50%] rounded-xl bg-gray-100 md:max-w-[30%]" //w-full max-w-md
      onUpload={onUpload}
      onFileReject={onFileReject}
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <CameraIcon className="text-muted-foreground size-6" />
          </div>
          <p className="text-sm font-medium">
            Arraste e solte os Arquivos aqui
          </p>
          <p className="text-muted-foreground text-xs">
            Ou clique em Carregar (até 5MB cada)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="icon-sm" className="mt-2 w-fit">
            Carregar Arquivos
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>

      <FileUploadList orientation="horizontal">
        {uploadedFiles.map((fileObj) => (
          <FileUploadItem
            key={fileObj.tempId}
            value={fileObj.file}
            className="p-0"
          >
            <FileUploadItemPreview className="size-20 [&>svg]:size-12">
              <img
                src={fileObj.url}
                alt={fileObj.file.name}
                className="h-full w-full rounded object-cover"
              />
            </FileUploadItemPreview>
            <FileUploadItemProgress variant="circular" size={40} />
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
