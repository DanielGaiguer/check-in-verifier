import SelectDateForm from '@/components/selectDateForm'

export default function Checkins() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className='flex flex-col items-center justify-center p-4 w-full lg:w-[45%]'>
        <SelectDateForm />
      </div>
    </main>
  )
}
