'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import { adoptoPorLaPagina } from "@/app/firebase"



export default function AdopcionesPage() {

    const [mascotasAdoptadas, setMascotasAdoptadas] = useState([])

    useEffect(() => {
        adoptoPorLaPagina()
        .then(mascotas => setMascotasAdoptadas(mascotas))
        .catch(error => console.log(error))
    }, [])



  return (
    <div className="container mx-auto bg-violet-200 bg-opacity-50 p-10 rounded-lg mt-10">
        <h1 className="text-3xl font-bold underline text-center py-5 text-purple-500">Mascotas adoptadas por la pagina!!</h1>
        <table  className="table w-full table-compact bg-pink-100 bg-opacity-50 p-10">
            <thead className="text-center bg-purple-500 bg-opacity-50 p-10">
                <tr className="text-center bg-purple-500 bg-opacity-50 text-pink-200">
                    <th className="p-2">nombre</th>
                    <th className="p-2">uid</th>
                    <th className="p-2">edad</th>
                    <th className="p-2">info</th>
                </tr>
            </thead>
        {mascotasAdoptadas.map(mascota => (
            <tbody key={mascota.id}>
                <tr className="text-center text-gray-700"> 
                    <td className="p-4"> {mascota.nombre}</td>
                    <td className="p-4">{mascota.uid}</td>
                    <td className="p-4">{mascota.edad}</td>
                    <td className="p-4">{mascota.info}</td>
                </tr>
            </tbody>
    ))}
        </table>
            
    </div>
  )
}
