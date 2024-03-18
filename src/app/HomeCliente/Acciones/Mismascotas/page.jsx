'use client'
import { useState } from "react";
import DatosMascotas from "@/app/components/DatosMascotas";
import FormMascotaDeAUna from "@/app/components/agregarMascota";
export default function MisMascotas() {
  const [nuevaMascota, setNuevaMascota] = useState(false);
  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl font-semibold text-center m-8 ">Tus Mascotas</h2>
      <div className="flex justify-center">
      <button onClick={() => setNuevaMascota(!nuevaMascota)} className="btn btn-primary m-3 bg-blue-500 rounded border-2-black p-2">Agregar mascota</button>
      <button className="btn btn-primary m-3 bg-green-500 rounded border-2-black p-2">Editar Mascota</button>
      <button className="btn btn-primary m-3 bg-red-500 rounded border-2-black p-2">Eliminar Mascota</button>        
      <button className="btn btn-primary m-3 bg-pink-500 rounded border-2-black p-2">Cruzar Mascota</button>
      </div>
      {
        nuevaMascota
       ? 
       <>
      <FormMascotaDeAUna/>
      <button onClick={()=> setNuevaMascota(!nuevaMascota)}  className="btn btn-primary bg-red-500 rounded border-2-black p-2" >Cancelar</button>
       </>
       : 
      <DatosMascotas />
      }
      
    </div>
  )
}
