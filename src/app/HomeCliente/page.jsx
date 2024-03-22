'use client'
import { useState, useEffect } from 'react';
import Veterinaria from '../components/Veterinaria';
import { UserAuth } from '../context/AuthContext';
import { clienteExiste } from '../firebase';
import { redirect } from 'next/navigation';

export default function HomeCliente() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [existe, setExiste] = useState(false);
  useEffect(() => {
    function handleCliente() {
      return new Promise((resolve, reject) => {
        if (uid) {
          clienteExiste(uid)
            .then((result) => {
              setExiste(result);
              if (!result) {
                redirect("/newClient/datosCliente");
              }
              resolve();
            })
            .catch((error) => {
              console.error("Error al verificar la existencia del cliente:", error);
              reject(error);
            });
        }
      });
    }
  
    handleCliente();
  }, [uid]);
  
  return (
    <>
      {existe && (
        <div className="bg-gray-100 min-h-screen bg-violet-200 HomeCliente">
          <div className="flex flex-col p-5 sm:flex-row lg:p-10">
            <div className='bg-white w-full lg:w-1/3 p-5 rounded-lg h-1/4 mt-10 ml-auto'>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 lg:text-5xl pb-5">Reserva tus turnos.</h1>
              <p className="text-lg text-yellow-400 mb-6 border-b-4 bg-gray-800 p-6 rounded-lg">¡Reserva tus turnos en línea y acumula puntos!</p>
            </div>
            <Veterinaria />
          </div>
        </div>
      )}
    </>
  );
}
