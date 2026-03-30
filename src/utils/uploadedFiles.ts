async function uploadFiles(files: File[], placeId: string) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  formData.append('placeId', placeId)

  const res = await fetch('/api/checkin-item-photos', {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error('Falha ao enviar arquivos')
  return res.json()
}