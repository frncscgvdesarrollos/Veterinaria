'use client';
import React, { useState, useEffect } from 'react';
import { mascotasEnAdopcion } from '../../firebase';
import Image from 'next/image';

export default function MascotasAdopcion() {
  const [mascotas, setMascotas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      mascotasEnAdopcion()
        .then(mascotasSnapshot => {
          const fetchedMascotas = mascotasSnapshot.docs.map(doc => doc.data());
          setMascotas(fetchedMascotas);
        })
        .catch(error => {
          setError('Error al obtener las mascotas en adopción');
          console.error('Error al obtener las mascotas en adopción:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchData();
  }, []);

  return (
    <div className="bg-violet-200 bg-opacity-50 rounded-lg p-5 w-full mx-auto">
      {/* Título */}
      <div className="p-5 rounded-lg bg-purple-600 bg-opacity-50 mx-auto text-center">
        <h1 className="text-3xl text-white">Mascotas en Adopción</h1>
      </div>
      {/* Contenido de mascotas en adopción */}
      <div className="bg-violet-300 bg-opacity-70 w-[300px] mx-auto rounded-lg p-5 flex flex-wrap justify-center gap-4 sm:justify-start md:justify-center lg:justify-start mb-8 mt-10">
        {isLoading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          mascotas.map((mascota, index) => (
            <div key={index} className="bg-blue-300 bg-opacity-70 shadow-md rounded-md overflow-hidden text-white font-semibold">
              <div className="relative overflow-hidden">
                {mascota.foto ? (
                  <Image
                    className="object-cover w-full h-48 sm:h-56 md:h-64"
                    src={mascota.foto}
                    alt={`Foto de ${mascota.nombre}`}
                    width={300}
                    height={300}
                  />
                ) : (
                  <div className="bg-violet-300 w-full h-48 sm:h-56 md:h-64 flex items-center justify-center">
                    <p className="text-gray-600 text-lg">Foto no disponible</p>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-75 text-white p-2 w-full">
                  <p className="text-lg font-semibold">{mascota.nombre}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-base text-gray-600 mb-2">Edad: {mascota.edad}</p>
                <p className="text-base text-gray-600 mb-2">Castrado: {mascota.castrado ? "Sí" : "No"}</p>
                <p className="text-base text-gray-600 mb-2">Info: {mascota.info}</p>
                {mascota.cumpleaños && (
                  <p className="text-base text-gray-600 mb-2">Cumpleaños: {mascota.cumpleaños}</p>
                )}
                <button className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Contactar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
