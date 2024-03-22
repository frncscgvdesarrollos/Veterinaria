'use client'
import { useEffect, useState } from 'react';
import { mascotasEnAdopcion } from '../../../firebase';

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

  return (
<div className="container mx-auto px-4">
  <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Mascotas en Adopción</h2>
  <p className="text-lg mb-8 bg-gray-500 text-white p-4 rounded-md text-gray-900">
    En esta sección puedes ver las mascotas que están en proceso de adopción. <br />
    Queremos recordarte la importancia de la adopción y la responsabilidad de tener una mascota.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-violet-400 p-4 rounded-lg">
    {mascotas.map((mascota, index) => (
      <div key={index} className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="relative overflow-hidden">
          {mascota.foto ? (
            <img
              className="object-cover w-full h-48 sm:h-56 md:h-64"
              src={mascota.foto}
              alt={`Foto de ${mascota.nombre}`}
            />
          ) : (
            <div className="bg-gray-300 w-full h-48 sm:h-56 md:h-64 flex items-center justify-center">
              <p className="text-gray-600 text-lg">Foto no disponible</p>
            </div>
          )}
          <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-75 text-white p-2 w-full">
            <p className="text-lg font-semibold">{mascota.nombre}</p>
          </div>
        </div>
        <div className="p-4 bg-violet-100">
          <p className="text-base text-gray-600 mb-2">Especie: {mascota.especie}</p>
          <p className="text-base text-gray-600 mb-2">Raza: {mascota.raza}</p>
          <p className="text-base text-gray-600 mb-2">Edad: {mascota.edad}</p>
          <p className="text-base text-gray-600 mb-2 min-h-[100px]">Info: {mascota.info}</p>
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 w-full rounded-md hover:bg-blue-600 transition duration-300 mb-4">
          Contactar
        </button>
      </div>
    ))}
  </div>
</div>

  );
}
