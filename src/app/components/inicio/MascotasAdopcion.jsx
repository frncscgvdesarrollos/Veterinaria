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
    <div className="bg-violet-200 bg-opacity-50 rounded-lg p-5 max-w-screen-lg mx-auto flex flex-col items-center justify-center    ">
      {/* Título */}
      <div className="p-5 rounded-lg bg-purple-600 bg-opacity-50 mx-auto text-center py-8">
        <h1 className="text-3xl sm:text-4xl text-white">¡Adopta a tu mascota!</h1>
      </div>
  
      <div className="p-5 bg-purple-500 mt-5 bg-opacity-50 rounded-lg mx-auto w-full flex flex-col sm:flex-row">
        <div className='w-full sm:w-2/3'>
          <p className='text-white py-2'><strong className='text-2xl my-5 text-cyan-500'>¿Buscas adoptar una mascota? <i className='text-2xl text-cyan-500'>¡Genial! </i></strong> <br/><br/>
              Antes de contactar a personas que tienen mascotas en adopción, es importante tener en cuenta algunas precauciones para garantizar tu seguridad y la de la mascota. <br/>
              <br/>
                Aquí algunos consejos:
          </p>
          <ul className='text-white text-left py-2'>
            <li>Cuando vayas a encontrarte con la persona, elige siempre un lugar público y seguro para conocerse.</li>
            <li>Siempre es mejor ir acompañado cuando vayas a conocer al dueño de la mascota.</li>
            <li>No dudes en hacer todas las preguntas que necesites para asegurarte de que la mascota sea adecuada para ti y tu hogar.</li>
          </ul>
          <p className='text-white py-2'><strong className='text-2xl my-5 '>Al adoptar utilizando el sistema, la primer consulta es gratis!</strong></p>
        </div>
        <Image src={'/adoptame2.jpg'} alt='Adopción' width={200} height={200} className='w-1/2 sm:w-1/2 rounded-[20%] mx-auto sm:mx-0' />
      </div>
  
      {/* Contenido de mascotas en adopción */}
      <div className="bg-violet-300 bg-opacity-70 flex mx-auto rounded-lg p-5 flex flex-wrap justify-center gap-4 sm:justify-start md:justify-center lg:justify-start mb-8 mt-10 ml-auto">
        {isLoading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          mascotas.map((mascota, index) => (
            <div key={index} className="flex  bg-blue-300 w-full sm:w-2/5 mx-auto bg-opacity-70 shadow-md rounded-md overflow-hidden text-white font-semibold sm:mx-2">
              <div className="relative overflow-hidden w-full sm:w-full mx-auto">
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
      <p className="text-center text-red-500 bg-yellow-200 bg-opacity-50 py-4">Esta es nuestro granito de arena para facilitar las adopciones de mascotas. La veterinaria no se responsabiliza por usuarios maliciosos.</p>
    </div>
  );
  
}
