import { TodayCheckin } from '@/components/checkins/TodayCheckin'
import SelectDateForm from '@/components/selectDateForm'
import { getCheckinForDate } from '@/services/apiCheckinService'

export default async function Checkins() {
  const todayCheckin = await getCheckinForDate({ defaultDate: 'today' })

  return (
    <main className="flex flex-col items-center justify-center">
      <div className='flex flex-col items-center justify-center p-4 w-full lg:w-[45%]'>
        <SelectDateForm />
        {!todayCheckin.length && <TodayCheckin />}
      </div>
    </main>
  )
}
