'use client';
import React, { useState, useEffect } from 'react';
import { mascotasEnAdopcion, sendMessage } from '../../firebase'; // Import sendMessage function

export default function MascotasAdopcion() {
  const [chat, setChat] = useState(false);
  const [uid2, setUid2] = useState(null);
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

  const chatear = (uid) => {
    setChat(true);
    setUid2(uid);
  }

  // Function to handle sending message
  const handleSendMessage = (message) => {
    sendMessage(uid2, message, 'userID1') // Call sendMessage function with parameters
      .then(() => console.log('Message sent'))
      .catch(error => console.error('Error sending message:', error));
  }

  return (
    <div className="bg-violet-200 bg-opacity-50 rounded-lg p-5 max-w-screen-lg mx-auto flex flex-col items-center justify-center">
      <div className="p-5 rounded-lg bg-purple-600 bg-opacity-50 mx-auto text-center py-8">
        <h1 className="text-3xl sm:text-4xl text-white">¡Adopta a tu mascota!</h1>
      </div>

      <div className="p-5 bg-purple-500 mt-5 bg-opacity-50 rounded-lg mx-auto w-full flex flex-col sm:flex-row">
        <div className="bg-violet-300 bg-opacity-70 flex mx-auto rounded-lg p-5 flex flex-wrap justify-center gap-4 sm:justify-start md:justify-center lg:justify-start mb-8 mt-10 ml-auto">
          {isLoading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            mascotas.map((mascota, index) => (
              <div key={index} className="flex bg-blue-300 w-full sm:w-2/5 mx-auto bg-opacity-70 shadow-md rounded-md overflow-hidden text-white font-semibold sm:mx-2">
                <div className="relative overflow-hidden w-full sm:w-full mx-auto">
                  {mascota.foto ? (
                    <img
                      className="object-cover w-full h-48 sm:h-56 md:h-64"
                      src={mascota.foto}
                      alt={`Foto de ${mascota.nombre}`}
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
                  <button className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => chatear(mascota.uid)}>
                    Contactar
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
