'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ErrorPage({ message }: { message?: string }) {
  const router = useRouter()

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full rounded-xl shadow-md">
        <CardHeader className="flex flex-col items-center gap-2 pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircleIcon className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">
            Ops! Algo deu errado
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            {message ?? 'Não foi possível carregar a página. Tente novamente mais tarde.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 py-6">
          <Button
            className="w-40 bg-blue-400 hover:bg-blue-300 text-white"
            onClick={() => router.push('/')}
          >
            Voltar para Home
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}