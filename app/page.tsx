
export default async function Home() {
  const response = await fetch(process.env.URL + "/api/checkins", {
    //headers: { "Content-Type": "application/json" },
    //body: JSON.stringify(data),
  });

  const data = await response.json()

  console.log(data)

  return (
    <main className="p-4">
      <h1 className="flex items-center justify-between p-4">
        Bem-vindo ao Check-in Verifier!
        {data[0].id}
      </h1>
      {/* <CheckinWizard /> Client Component */}
    </main>
  )
}
