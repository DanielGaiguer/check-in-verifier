'use client'
import { AlertCard } from '@/components/alert-card'
import { InfoCard } from '@/components/info-card'
import { LastCheckins } from '@/components/last-checkins'
import { SkeletonCard } from '@/components/home-skeleton'
import { useLastCheckins } from '@/hooks/useQuerys/useLastCheckins'
import { usePeople } from '@/hooks/useQuerys/usePeoples'
import { usePlaces } from '@/hooks/useQuerys/usePlaces'
import { isSameDay, parseISO } from 'date-fns'
import ErrorPage from '@/components/error-page'

export default function Home() {
  const { checkinData, isLoading, error } = useLastCheckins()
  const {
    places,
    placeCount,
    isLoading: isLoadingPlaces,
    error: errorPlaces,
  } = usePlaces()
  const {
    people,
    peopleCount,
    isLoading: isLoadingPeople,
    error: errorPeople,
  } = usePeople()

  const today = new Date()
  const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(today)

  if (isLoading || isLoadingPlaces || isLoadingPeople) return <SkeletonCard />
  if (error || errorPlaces || errorPeople)
    return <ErrorPage />

  // Função auxiliar: retorna o número da semana de uma data
  function getWeekNumber(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const currentWeek = getWeekNumber(today)

  // --- Check-ins da semana ---
  const weeklyCheckins = checkinData.filter((checkin) => {
    const checkinDate = parseISO(checkin.checkinsDate)
    return getWeekNumber(checkinDate) === currentWeek
  })

  // --- Check-ins de hoje ---
  const todayCheckins = checkinData.filter((checkin) =>
    isSameDay(parseISO(checkin.checkinsDate), today)
  )

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
        <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
          <h1 className="font-sans text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">{dateFormatted}</p>

          <div className="mt-5">
            {todayCheckins.length === 0 && (
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
                textButton="Fazer Check-in"
                href="/checkins"
              />
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 p-1 sm:grid-cols-4">
            <InfoCard
              title={todayCheckins.length}
              description="Check-ins de Hoje"
              iconName="ClipboardCheckIcon"
              iconColor="text-blue-400"
              iconBgColor="bg-[#87cfeb39]"
              href="/checkins"
            />
            <InfoCard
              title={placeCount}
              description="Lugares cadastrados"
              iconName="MapPinIcon"
              iconColor="text-green-700"
              iconBgColor="bg-[#98fb9846]"
              href="/places"
            />
            <InfoCard
              title={peopleCount}
              description="Pessoas"
              iconName="UsersRoundIcon"
              iconColor="text-gray-600"
              iconBgColor="bg-[#d3d3d37b]"
              href="/people"
            />
            <InfoCard
              title={weeklyCheckins.length}
              description="Check-ins da semana"
              iconName="TrendingUp"
              iconColor="text-blue-400"
              iconBgColor="bg-[#87cfeb39]"
              href="/history"
            />
          </div>

          <LastCheckins checkins={weeklyCheckins} hrefBase="/checkins/" />
        </div>
      </main>
    </>
  )
}
