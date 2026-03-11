import Header from "@/components/header";

export default async function Home() {
  return (
    <main className="flex flex-col justify-start min-h-screen bg-gray-50 mt-3 rounded-t-xl">
      <Header />
      <div className="flex-1 w-full flex justify-center bg-white rounded-t-xl ">
        <h1 className="text-xl font-semibold tracking-tight">
          teste
        </h1>
      </div>
    </main>
  )
}