'use client'
import { useEffect } from 'react';
import { clienteExisteConTerminosTRUE, clienteExiste } from '../firebase';
import Veterinaria from '../components/Veterinaria';
import { redirect } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';

export default function HomeCliente() {
  const { user } = UserAuth();
  const uid = user?.uid;

  function handleClienteYterminos() {
    if (user) {
      // Verificar si el cliente existe
      clienteExiste(uid)
        .then((response) => {
          if (!response) {
            throw new Error("Cliente no encontrado"); // Lanzamos un error si el cliente no existe
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          redirect('/newClient/datosCliente'); // Redirigir en caso de error
        });
    }
  }

  // Función para verificar si los términos están aceptados
  function verificarTerminos(uid) {
    return clienteExisteConTerminosTRUE(uid)
      .then((terminos) => {
        if (!terminos) {
          redirect('/newClient/datosTerminos'); // Redirigir si los términos no están aceptados
        }
      })
      .catch((error) => {
        console.error('Error al verificar los términos:', error);
        redirect('/newClient/datosCliente'); // Redirigir en caso de error
      });
  }

  useEffect(() => {
    handleClienteYterminos();
    verificarTerminos(uid);
  });

  return (
    <div className="bg-gray-100 min-h-screen bg-violet-200  HomeCliente">
      <div className="flex flex-col p-5 sm:flex-row  lg:p-10">
        <div className='bg-white m- w-full lg:w-1/3 p-5 rounded-lg h-1/4 mt-10 ml-auto '>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 lg:text-5xl pb-5 ">Reserva tus turnos.</h1>
        <p className="text-lg text-yellow-400 mb-6 border-b-4 bg-gray-800 p-6 rounded-lg ">¡Reserva tus turnos en línea y acumula puntos!</p>
        </div>
        <Veterinaria />
      </div>
    </div>
  );
}
