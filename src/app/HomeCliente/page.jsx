'use client'
import { useEffect } from 'react';
import { clienteExisteConTerminosTRUE, clienteExiste } from '../firebase';
import Veterinaria from '../components/Veterinaria';
import { redirect } from 'next/navigation'; // Importamos la función redirect
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
  }, [user]);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 HomeCliente">
      <Veterinaria />
    </div>
  );
}
