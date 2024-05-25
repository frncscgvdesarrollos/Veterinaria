'use client';
import React, { useState, useEffect } from 'react';
import { mascotasEnAdopcion, postular } from '../../firebase'; // Import sendMessage function
import Image from 'next/image';
import { UserAuth } from '@/app/context/AuthContext';
import { UseClient } from '@/app/context/ClientContext';

export default function MascotasAdopcion() {
  const {user} = UserAuth();
  const uid = user?.uid;
  const {datosCliente} = UseClient();
  const { nombre , apellido , telefono  } = datosCliente;
  const info = {
    uid,
    nombre,
    apellido,
    telefono
  }
  console.log(datosCliente);
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



  // Function to handle sending message
  const handlePostular = (infoPostulante , nombreMascota , uidMascota) => {
    postular(infoPostulante , nombreMascota , uidMascota)
    .then(() => {
      alert('Tu postulación ha sido enviada');
      window.location.reload();
    })
    .catch(error => {
      console.error('Error al enviar el mensaje:', error);
    });
  }

  return (
    <div className="bg-violet-200 bg-opacity-50 rounded-lg p-5 max-w-screen-lg mx-auto flex flex-col items-center justify-center">
      <div className="p-5 rounded-lg bg-purple-600 bg-opacity-50 mx-auto text-center py-8">
        <h1 className="text-3xl sm:text-4xl text-white">¡Adopta a tu mascota!</h1>
      </div>

      <div className="p-5 bg-purple-500 mt-5 bg-opacity-50 rounded-lg mx-auto w-full flex flex-col sm:flex-row">
        <div className="bg-violet-300 bg-opacity-70 flex mx-auto rounded-lg p-5 flex flex-wrap justify-center gap-4 sm:justify-start md:justify-center lg:justify-start mb-8 mt-10 ml-auto md:w-[1500px]" >
          {isLoading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            mascotas.map((mascota, index) => (
              <div key={index} className="flex w-full bg-blue-300 w-full md:w-[45%] mx-auto bg-opacity-70 shadow-md rounded-md overflow-hidden text-white font-semibold sm:mx-2">
                <div className="relative overflow-hidden w-full sm:w-full mx-auto">
                  {mascota.foto ? (
                    <Image
                      className="object-cover w-full h-48 sm:h-56 md:h-64"
                      src={mascota.foto}
                      alt={`Foto de ${mascota.nombre}`}
                      width={500} height={50}
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
                  <button className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handlePostular(info, mascota.nombre , mascota.uid)}>
                    Postular !
                  </button>
                </div>
              </div>
            ))
          )}
         </div>
      </div>
      <p className="text-center text-red-500 bg-yellow-200 bg-opacity-50 py-4">Esta es nuestro granito de arena para facilitar las adopciones de mascotas. La veterinaria no se responsabiliza por usuarios maliciosos.</p>
    </div>
  );
}
