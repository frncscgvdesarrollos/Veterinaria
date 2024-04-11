'use client'
import { useState } from "react";
import DatosMascotas from "@/app/components/DatosMascotas";
import FormMascotaDeAUna from "@/app/components/agregarMascota";
import Image from "next/image";

export default function MisMascotas() {
  const [nuevaMascota, setNuevaMascota] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center HomeCliente p-4 rounded-lg border border-gray-800">
  <h2 className="text-3xl font-bold text-gray-800 mb-4">Tus Mascotas</h2>
  <div className="flex flex-wrap justify-center mb-4">
    <button onClick={() => setNuevaMascota(!nuevaMascota)} className="btn btn-primary m-3 bg-blue-500 rounded border border-black p-2">Agregar mascota</button>
    <button className="btn btn-primary m-3 bg-green-700 rounded border border-black p-2">Editar Mascota</button>
    {/* <button className="btn btn-primary m-3 bg-pink-500 rounded border border-black p-2">Cruzar Mascota</button> */}
  </div>
  {nuevaMascota ? (
    <div className="flex flex-col md:flex-row gap-4 space-y-4 md:space-y-0 p-10">

      <div className="w-full md:w-1/3 bg-gray-100 rounded-lg p-4 ml-20 h-[600px]">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Información Importante</h2>
        <p className="text-gray-700 mb-2">Es crucial proporcionar información precisa para garantizar un servicio eficiente para tu mascota.</p>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Sugerencias Importantes:</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>Proporciona detalles precisos sobre la raza y el tamaño de tu mascota.</li>
          <li>Indica si tu mascota está castrada, esto puede ser relevante para su cuidado y manejo.</li>
          <li>Asegúrate de describir cualquier problema de salud o condiciones especiales que tenga tu mascota.</li>
        </ul>
        <p className="text-gray-700 mt-4">La cruz de un perro se refiere a la altura medida desde el suelo hasta el punto más alto del hombro del perro.</p>
        <Image src="/cruz.jpg" alt="cruz" width={200} height={200}  className="mt-4 ml-auto mr-auto"/>
      </div>
      <div className="flex flex-col w-full md:w-2/3">
        <FormMascotaDeAUna />
        <button onClick={() => setNuevaMascota(false)} className="btn btn-primary bg-red-400 text-white rounded border border-black p-2 my-4 w-1/3 mx-auto">Cancelar</button>
      </div>
    </div>
  ) : (
    <DatosMascotas />
  )}
</div>

  
  );
}
