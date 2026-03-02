import { TodayCheckin } from '@/components/checkins/TodayCheckin'

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="flex items-center p-4 text-xl font-semibold tracking-tight">
        Bem-vindo ao Check-in Verifier!
      </h1>
      <TodayCheckin />
      {/* <CheckinWizard /> Client Component */}
    </main>
  )
}
