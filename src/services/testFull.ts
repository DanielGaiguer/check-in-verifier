import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/db'
import { supabase } from '@/db/supabaseClient'
import { people, checkinItemPhotos } from '@/db/schema'

async function testFull() {
  try {
    console.log('--- Teste DB ---')
    const peopleData = await db.select().from(people).limit(1)
    console.log('Conexão com DB OK!', peopleData)

    console.log('--- Teste Storage ---')
    const bucketListRes = await supabase.storage.from('checkin-photos').list()
    if ('error' in bucketListRes && bucketListRes.error) {
      console.error('Erro ao acessar bucket:', bucketListRes.error)
      return
    }
    console.log('Bucket checkin-photos OK! Arquivos atuais:', bucketListRes.data)

    console.log('--- Upload de foto teste ---')
    const testFilePath = path.resolve(__dirname, 'teste.jpg')
    if (!fs.existsSync(testFilePath)) {
      console.error('Arquivo teste.jpg não encontrado na mesma pasta do script!')
      return
    }

    const fileBuffer = fs.readFileSync(testFilePath)
    const fileName = `${uuidv4()}-teste.jpg`
    const uploadRes = await supabase.storage
      .from('checkin-photos')
      .upload(fileName, fileBuffer, { cacheControl: '3600', upsert: false })

    if (uploadRes.error) {
      console.error('Erro ao enviar foto:', uploadRes.error.message)
      return
    }

    const { data: publicData } = supabase.storage.from('checkin-photos').getPublicUrl(fileName)
    const publicUrl = publicData.publicUrl
    console.log('Foto enviada com sucesso! URL pública:', publicUrl)

    console.log('--- Salvando no DB ---')
    const newPhoto = await db
      .insert(checkinItemPhotos)
      .values({
        id: uuidv4(),
        checkinItemProblemId: '00000000-0000-0000-0000-000000000000', // coloque um ID válido do problema
        photoUrl: publicUrl,
        sortOrder: 1,
      })
      .returning()

    console.log('Foto salva no DB:', newPhoto)
  } catch (err) {
    console.error('Erro no teste completo:', err)
  }
}

testFull()