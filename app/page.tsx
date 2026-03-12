import Header from '@/components/header'
import { AlertCard } from '@/components/alert-card'
import { InfoCard } from '@/components/info-card'
import { LastCheckins } from '@/components/last-checkins'

export default async function Home() {
  const date = new Date()
  const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', // dia da semana
    day: '2-digit', // dia com 2 dígitos
    month: 'long', // mês por extenso
    year: 'numeric', // ano completo
  }).format(date)

  const hardData = [
  {
    id: '1',
    name: 'Joao',
    date: '07/03/2026 às 11:29',
  },
  {
    id: '2',
    name: 'Daniel',
    date: '07/03/2026 às 11:28',
  },
  {
    id: '3',
    name: 'Isis',
    date: '07/03/2026 às 11:24',
  },
]
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
        <div className="m-5  flex-1 rounded-t-xl bg-gray-50">
          <h1 className="font-sans text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">{dateFormatted}</p>

          {/* Card dentro do mesmo container */}
          <div className="mt-5">
            <AlertCard
              title="Check-in diário não realizado!"
              description={
                <>
                  Nenhum check-in foi registrado para hoje.
                  <span className="block md:inline">
                    {' '}
                    Realize o check-in dos laboratórios.
                  </span>
                </>
              }
              textButton='Fazer Check-in'
              href='/new'
            />
          </div>
          <div className='mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 p-1'>
            <InfoCard
              number={0}
              description="Check-ins de Hoje"
              iconName="ClipboardCheckIcon" 
              iconColor="text-blue-400"
              iconBgColor="bg-[#87cfeb39]"
              href='/history'
            />
            <InfoCard
              number={12}
              description="Lugares cadastrados"
              iconName="MapPinIcon" 
              iconColor="text-green-700"
              iconBgColor="bg-[#98fb9846]"
              href='/places'
            />
            <InfoCard
              number={3}
              description="Pessoas"
              iconName="UsersRoundIcon" 
              iconColor="text-gray-600"
              iconBgColor="bg-[#d3d3d37b]"
              href='/people'
            />
            <InfoCard
              number={4}
              description="Últimos Check-ins"
              iconName="TrendingUp" 
              iconColor="text-blue-400"
              iconBgColor="bg-[#87cfeb39]"
              href='/history'
            />
          </div>

          <LastCheckins checkins={hardData} hrefBase='/checkins/'/>
        </div>
      </main>
    </>
  )
}
