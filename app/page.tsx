
export default async function Home() {
  const response = await fetch(process.env.URL + "/api/checkins/today", {
    //headers: { "Content-Type": "application/json" },
    //body: JSON.stringify(data),
  });

  const data = await response.json()

  console.log(data)

  return (
    <main className="p-4">
      <h1 className="flex items-center p-4">
        Bem-vindo ao Check-in Verifier!
        </h1>

        {data[0].checkins ? (
          <h1>Check in de hoje feito por {data[0].users.name}</h1>
        ) : (
          <h1>Nenhum check-in realizado Hoje</h1>
        )}
      {/* <CheckinWizard /> Client Component */}
    </main>
  )
}
