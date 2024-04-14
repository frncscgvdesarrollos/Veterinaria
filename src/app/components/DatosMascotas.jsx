import { useEffect, useState } from 'react';
import Image from 'next/image';
import FormMascotaDeAUna from "@/app/components/agregarMascota";
import { MascotasContext } from '../context/MascotaContext';
import { situacionMascota } from '../firebase';

export default function MisMascotas() {
  const { mascota } = MascotasContext();
  const [mascotas, setMascotas] = useState([]);
  const [nuevaMascota, setNuevaMascota] = useState(false);

  useEffect(() => {
    if (mascota && mascota.length > 0) {
      setMascotas(mascota);
    } 
  }, [mascota]);

  const toggleNuevaMascota = () => {
    setNuevaMascota(!nuevaMascota);
  };

  return (
    <div className="flex flex-col container mx-auto bg-violet-200 p-4">
      <h2 className="text-3xl font-bold text-gray-800 m-4">Tus Mascotas</h2>
      <div className="flex flex-wrap mb-4 text-white">
        <button onClick={toggleNuevaMascota} className="btn btn-primary m-3 bg-purple-500 rounded border border-black p-2">
          Agregar mascota
        </button>
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
            <button onClick={toggleNuevaMascota} className="btn btn-primary bg-red-400 text-white rounded border border-black p-2 my-4 w-1/3 mx-auto">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 bg-violet-100 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10">
            {mascotas.length > 0 ? (
              mascotas.map((mascota, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="relative">
                    {mascota.foto ? (
                      <Image
                        src={mascota.foto}
                        alt={`Foto de ${mascota.nombre}`}
                        width={300}
                        height={300}
                        className="object-cover w-full h-48 sm:h-56 md:h-64"
                      />
                    ) : (
                      <div className="bg-gray-300 w-full h-48 sm:h-56 md:h-64 flex items-center justify-center">
                        <p className="text-gray-600 text-lg">Foto no disponible</p>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-75 text-white p-2 w-full">
                      <h2 className="text-lg font-semibold">{mascota.nombre}</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600">Especie: {mascota.especie}</p>
                    <p className="text-sm text-gray-600">Tamaño: {mascota.tamaño}</p>
                    <p className="text-sm text-gray-600">Raza: {mascota.raza}</p>
                    <p className="text-sm text-gray-600">Situación: {mascota.estadoCivil || 'No definida'}</p>
                    {!mascota.estadoCivil && (
                      <p onClick={toggleNuevaMascota} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                        Definir Situación
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-lg">No hay mascotas disponibles</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
