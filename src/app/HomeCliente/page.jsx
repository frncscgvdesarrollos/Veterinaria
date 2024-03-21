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
    <div className="bg-gray-100 min-h-screen bg-violet-200 ">
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Resever sus turnos</h1>
        <p className="text-lg text-gray-600 mb-6">¡Reserva tus turnos en línea y acumula puntos para obtener consultas gratis!</p>
        <Veterinaria />
      </div>
    </div>
  );
}
