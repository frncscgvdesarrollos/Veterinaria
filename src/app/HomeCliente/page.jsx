'use client';
import { useState, useEffect } from 'react';
import Veterinaria from '../components/Veterinaria';
import { UserAuth } from '../context/AuthContext';
import { clienteExiste } from '../firebase';
import { useRouter } from 'next/navigation';
import MisDatos from '../components/MisDatos';
import DatosMascotas from '../components/DatosMascotas';

export default function HomeCliente() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [existe, setExiste] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleCliente = () => {
      if (uid) {
        clienteExiste(uid)
          .then((result) => {
            setExiste(!!result);
            if (!result) {
              router.push('/newClient/datosCliente');
            }
          })
          .catch((error) => {
            console.error('Error al verificar la existencia del cliente:', error);
          });
      }
    };

    handleCliente();
  }, [uid, router]);

  return (
    <>
      {existe && (
        <div className="min-h-screen bg-violet-200 HomeCliente p-5">
          <div className="flex flex-col p-5 sm:flex-col lg:flex-row lg:p-10 w-2/3 mx-auto bg-violet-100 bg-opacity-50 p-10">
            <Veterinaria />
          </div>
          <div className="flex flex-col p-5 sm:flex-col lg:flex-row lg:p-10 gap-10">
            <MisDatos />
            <DatosMascotas />
            </div>
        </div>
      )}
    </>
  );
}