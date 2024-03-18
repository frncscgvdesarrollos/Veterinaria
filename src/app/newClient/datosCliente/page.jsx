'use client'
import { useEffect, useState } from 'react';
import FormCliente from '../../components/FormCliente';
import { clienteExisteConTerminosTRUE } from '../../firebase';
import { UserAuth } from '../../context/AuthContext';
import { redirect } from 'next/navigation';

export default function DatosCliente() {
  const { user } = UserAuth();
  console.log(user);
  const [terminos, setTerminos] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user === null) {
        // Espera 5 segundos antes de ejecutar la lógica relacionada con 'user'
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      if (user && user.uid) {
        clienteExisteConTerminosTRUE(user.uid)
          .then((response) => {
            if (response) {
              setTerminos(true);
            }
          })
          .catch((error) => {
            console.error("Error verifying client with terms:", error);
          });
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (terminos) {
      redirect('/HomeCliente');
    }
  }, [terminos]);
  
  return (
    <div className='bg-gray-800 h-auto p-5'>
      <h1 className='text-4xl text-center font-bold mt-5 mb-5 text-red-400 underline'>Informacion personal</h1>
      <FormCliente/>
    </div>
  );
}
