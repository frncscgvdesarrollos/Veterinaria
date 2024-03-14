'use client'
import MyCalendar from "@/app/components/MesTurnero";


export default function page() {

  return (
    <div className="bg-gray-600 text-center text-2xl">
        <h1 className="text-white p-10 font-bold border-b-4">Seleccione su turno de checkeo!</h1>
        <MyCalendar/>
    </div>
  )
}
