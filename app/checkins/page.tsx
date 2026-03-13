import CardResponsible from '@/components/card-responsible'
export default async function Checkins() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <h1 className="font-sans text-2xl font-semibold tracking-tight">
          Novo Check-in
        </h1>
				<h4 className="text-gray-500">Preencha o status de cada lugar</h4>
				<CardResponsible />
      </div>
    </main>
  )
}
