import SelectDateForm from '@/components/checkins/selectDateForm'

export default async function Checkins() {

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center p-4 lg:w-[45%]">
        <SelectDateForm />
        {/* {!todayCheckin.length && <TodayCheckin />} */}
      </div>
    </main>
  )
}
