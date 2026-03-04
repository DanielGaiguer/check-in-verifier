'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CheckinDetailPage() {
  const params = useParams()
  const id = params.id
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
		async function fetchData() {
			const res = await fetch(`/api/checkins/${id}`)
			
			if (!res.ok) {
				console.error('Erro no fetch:', res.status)
				setLoading(false)
				return
			}

			const json = await res.json()
			setData(json)
			setLoading(false)
		}

		fetchData()
  }, [id])


  if (loading) return <p>Carregando...</p>

  return (
    <div>
      <h1>Detalhe do check-in {id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
