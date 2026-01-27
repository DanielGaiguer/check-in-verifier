import { TodayCheckin } from "@/components/checkins/TodayCheckin"

export default async function Home() {
  return (
    <main className="p-4 flex items-center flex-col">
      <h1 className="flex items-center p-4 text-xl font-semibold tracking-tight">
        Bem-vindo ao Check-in Verifier!
        </h1>
        <TodayCheckin />
      {/* <CheckinWizard /> Client Component */}
    </main>
  )
}
