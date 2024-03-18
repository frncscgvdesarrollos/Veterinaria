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
    if(user === null) {
      const uid = user?.uid;
    }
        const fetchData = () => {
          return new Promise((resolve, reject) => {
            if (user && uid)  {
              clienteExisteConTerminosTRUE(uid)
                .then((response) => {
                  if (response) {
                    setTerminos(true);
                  }
                  resolve();
                })
                .catch((error) => {
                  console.error("Error verifying client with terms:", error);
                  reject(error);
                });
            } else {
              resolve();
            }
          });
      }
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
