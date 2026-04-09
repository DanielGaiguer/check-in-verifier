import { supabase } from '@/db/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/db/index'
import { checkinItemPhotos } from '@/db/schema'

export async function uploadCheckinPhoto(checkinItemId: string, file: File) {
  // 1️⃣ Nome único
  const fileName = `${uuidv4()}-${file.name}`

  // 2️⃣ Upload
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('checkin-photos')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw new Error(`Erro ao enviar foto: ${uploadError.message}`)

  // 3️⃣ Obter URL pública
  const { data } = supabase.storage.from('checkin-photos').getPublicUrl(fileName)
  const publicUrl = data.publicUrl

  // 4️⃣ Salvar no banco
  const newPhoto = await db
    .insert(checkinItemPhotos)
    .values({
      id: uuidv4(),
      checkinItemId,
      photoUrl: publicUrl,
    })
    .returning()

  return newPhoto
}
// item.problems.map(problem => (
//   <div key={problem.id}>
//     <p>{problem.problem.name}</p>
//     <div className="photos">
//       {problem.photos.map(photo => (
//         <img key={photo.id} src={photo.photoUrl} />
//       ))}
//     </div>
//   </div>
// ))