import Header from '@/components/header'
import { AlertCard } from '@/components/alert-card'

export default async function Home() {
  const date = new Date()
  const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', // dia da semana
    day: '2-digit', // dia com 2 dígitos
    month: 'long', // mês por extenso
    year: 'numeric', // ano completo
  }).format(date)
  return (
    <main className="flex min-h-screen flex-col justify-start rounded-t-xl bg-gray-50">
      <Header />
      <div className="m-6 flex-1 rounded-t-xl bg-white">
        <h1 className="font-sans text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">{dateFormatted}</p>

        {/* Card dentro do mesmo container */}
        <div className="mt-4">
          <AlertCard
            title="Check-in diário não realizado!"
            description={
              <>
                Nenhum check-in foi registrado para hoje.
                <span className='block md:inline'> Realize o check-in dos laboratórios.</span>
              </>
            }
          />
        </div>
      </div>
    </main>
  )
}
