import Header from "@/components/header";

export default async function Home() {
  const date = new Date()
  const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',  // dia da semana
    day: '2-digit',   // dia com 2 dígitos
    month: 'long',    // mês por extenso
    year: 'numeric'   // ano completo
  }).format(date);
  return (
    <main className="flex flex-col justify-start min-h-screen bg-gray-50 rounded-t-xl">
      <Header />
      <div className="flex-1 w-full bg-white rounded-t-xl ml-6 mt-6">
        <h1 className="text-2xl font-semibold tracking-tight font-sans ">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          {dateFormatted}
        </p>
      </div>
    </main>
  )
}