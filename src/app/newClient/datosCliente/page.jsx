'use client'
import { useEffect, useState } from 'react';
import FormCliente from '../../components/FormCliente';
import { clienteExisteConTerminosTRUE } from '../../firebase';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

export default function DatosCliente() {
  const { user } = UserAuth();
  const router = useRouter();

  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [errorVerificacion, setErrorVerificacion] = useState(null);

  useEffect(() => {
    if (user && user.uid) {
      clienteExisteConTerminosTRUE(user.uid)
        .then((response) => {
          if (response) {
            setTerminosAceptados(true);
          }
        })
        .catch((error) => {
          setErrorVerificacion(error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (terminosAceptados) {
      router.push('/HomeCliente');
    }
  }, [terminosAceptados]);

  return (
    <div className='bg-gray-800 h-auto p-5'>
      <h1 className='text-4xl text-center font-bold mt-5 mb-5 text-red-400 underline'>Informacion personal</h1>
      {errorVerificacion && (
        <p className='text-red-500 text-center mb-5'>
          Error al verificar la aceptación de términos: {errorVerificacion.message}
        </p>
      )}
      <FormCliente />
    </div>
  );
}