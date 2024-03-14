'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { mascotasEnAdopcion, getMascotaFoto } from '../../firebase';

export default function Adopcion() {
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    obtenerMascotasEnAdopcion();
  }, []);

  // Función para obtener las mascotas en adopción
  function obtenerMascotasEnAdopcion() {
    mascotasEnAdopcion()
      .then((querySnapshot) => {
        const fetchedMascotas = querySnapshot.docs.map((doc) => doc.data());
        setMascotas(fetchedMascotas);
      })
      .catch((error) => {
        console.error("Error al obtener las mascotas:", error);
      });
  }

    // Una vez que todas las promesas se resuelvan, actualizamos el estado con las fotos

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-8 text-green-500">Mascotas en Adopción</h2>
      <p className="text-lg mb-8 bg-gray-200 p-4 rounded-md text-gray-900">En esta sección puedes ver las mascotas que estan en proceso de adopción. <br/>
      Queremos recordate la importancia de la adopción y la responsabilidad de tener una mascota.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {mascotas.map((mascota, index) => (
          <div key={index} className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="relative">
              { mascota.foto ? (
                <Image
                  className="object-contain"
                  src={mascota.foto}
                  alt={`Foto de ${mascota.nombre}`}
                  layout="responsive"
                  width={100}
                  height={150}
                />
              ) : (
                <div className="bg-gray-300 w-full h-32 flex items-center justify-center">
                  <p className="text-gray-600 text-lg">Foto no disponible</p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-75 text-white p-2 w-full">
                <p className="text-lg font-semibold">{mascota.nombre}</p>
              </div>
            </div>
            <div className="p-4 h-[200px] ">
              <p className="text-lg text-gray-600 ">Especie: {mascota.especie}</p>
              <p className="text-lg text-gray-600">Raza: {mascota.raza}</p>
              <p className="text-lg text-gray-600">Edad: {mascota.edad}</p>
              <p className="text-lg text-gray-600">Info: {mascota.info}</p>
            </div>
            <button className="bg-blue-500 text-white p-2 w-full">Contactar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
