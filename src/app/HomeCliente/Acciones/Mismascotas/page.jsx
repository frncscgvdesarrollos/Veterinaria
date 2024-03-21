'use client'
import { useState } from "react";
import DatosMascotas from "@/app/components/DatosMascotas";
import FormMascotaDeAUna from "@/app/components/agregarMascota";

export default function MisMascotas() {
  const [nuevaMascota, setNuevaMascota] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center HomeCliente p-4 rounded-lg  border-gray-800">
      <h2 className="text-3xl font-bold text-gray-800 ml-auto mr-24">Tus Mascotas</h2>
      <div className="flex flex-row flex-wrap justify-center space-x-4 mb-4 ml-12 sm:mr-auto text-white text-xl">
        <button onClick={() => setNuevaMascota(!nuevaMascota)} className="btn btn-primary m-3 bg-blue-500 rounded border-2-black p-2">Agregar mascota</button>
        <button className="btn btn-primary m-3 bg-green-700 rounded border-2-black p-2 ">Editar Mascota</button>    
        {/* <button className="btn btn-primary m-3 bg-pink-500 rounded border-2-black p-2">Cruzar Mascota</button> */}
      </div>
      {nuevaMascota ? (
        <>
          <FormMascotaDeAUna />
          <button onClick={() => setNuevaMascota(false)} className="btn btn-primary bg-red-500 rounded border-2-black p-2 my-4">Cancelar</button>
        </>
      ) : (
        <DatosMascotas />
      )}
    </div>
  );
}
