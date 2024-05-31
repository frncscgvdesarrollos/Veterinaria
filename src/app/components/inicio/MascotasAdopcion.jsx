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
      <div className="flex flex-col items-center justify-center">
        <div className="p-5 rounded-lg bg-purple-600 bg-opacity-50 mx-auto text-center py-8">
  <h1 className="text-3xl sm:text-4xl text-white">¡Adopta a tu mascota!</h1>
  <div className="mt-4 text-lg font-medium text-left">
    <p className="text-white">Explicación del método de adopción:</p>
    <ol className="list-decimal list-inside text-white my-2">
      <li className="my-2">Se postula: Al dueño actual de la mascota le llegará el nombre y el celular de la persona que se postule.</li>
      <li className="my-2">El dueño actual debe comunicarse con los postulantes.</li>
      <li className="my-2">Si se confirma la adopción, se pasará la mascota al perfil del nuevo dueño, y la veterinaria será notificada de esto.</li>
    </ol>
    <p className="text-white mt-4">Esperamos poder ayudar para que cada vez más perros puedan encontrar su lugar con un dueño responsable.</p>
  </div>
</div>
      </div>

      <div className="p-5 bg-purple-500 mt-5 bg-opacity-50 rounded-lg mx-auto w-full flex flex-col sm:flex-row items-center">
        <div className="bg-violet-300 bg-opacity-70 flex mx-auto rounded-lg p-5 flex flex-wrap justify-center items-center gap-4 sm:justify-start md:justify-center lg:justify-start mb-8 mt-10 ml-auto md:w-[1500px]" >
          {isLoading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            mascotas.map((mascota, index) => (
              <div key={index} className="flex w-full bg-blue-300 w-full md:w-[360px] items-center justify-center ml-auto mx-auto bg-opacity-70 shadow-md rounded-md overflow-hidden text-white font-semibold sm:mx-2">
                <div className="relative overflow-hidden w-full sm:w-full mx-auto">
                  {mascota.foto ? (
                    <Image
                      className="object-cover w-full h-48 sm:h-56 md:h-64"
                      src={mascota.foto}
                      alt={`Foto de ${mascota.nombre}`}
                      width={500} height={500}
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
                <div className="p-4 w-full flex flex-col mt-auto">
                  <p className="text-base text-gray-600 mb-2">Edad: {mascota.edad}</p>
                  <p className="text-base text-gray-600 mb-2">Castrado: {mascota.castrado ? "Sí" : "No"}</p>
                  <p className="text-base text-gray-600 mb-2">Info: {mascota.info}</p>
                  <button className="bg-purple-500 mt-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handlePostular(info, mascota.nombre , mascota.uid)}>
                    Postular !
                  </button>
                </div>
              </div>
            ))
          )}
         </div>
      </div>
      <marquee behavior="scroll" className="text-center text-red-500 bg-yellow-200 bg-opacity-50 p-4 rounded-lg my-10 underline">Este es nuestro granito de arena para facilitar las adopciones de mascotas. La veterinaria no se responsabiliza por usuarios maliciosos.</marquee>
    </div>
  );
}
