'use client';
import { useEffect, useState } from 'react';
import Veterinaria from '../components/inicio/Veterinaria';
import MisDatos from '../components/inicio/MisDatos';
import MisTurnos from '../components/inicio/MisTurnos';
import DatosMascotas from '../components/inicio/DatosMascotas';
import Productos from '../components/inicio/Productos';
import MascotasAdopcion from '../components/inicio/MascotasAdopcion';
import { UserAuth } from '../context/AuthContext';
import { redirect } from 'next/navigation';
import { clienteExiste, clienteExisteConTerminosTRUE } from '../firebase';

export default function HomeCliente() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function verificarCliente(uid) {
    return new Promise((resolve, reject) => {
      clienteExiste(uid)
        .then(cliente => {
          if (cliente) {
            resolve(cliente);
          } else {
            reject(new Error(`No se encontró ningún cliente con el UID proporcionado: ${uid}`));
          }
        })
        .catch(error => {
          reject(error);
        });
        clienteExisteConTerminosTRUE(uid)
        .then(cliente => {
          if (cliente) {
            resolve(cliente);
          } else {
            reject(new Error(`No se encontró ningún cliente con el UID proporcionado: ${uid}`));
          }
        })
        .catch(error => {
          reject(error);
        });
        Promise.all([clienteExiste(uid), clienteExisteConTerminosTRUE(uid)])
        .catch(error => {
          reject(error);
        });
    });
  }

  useEffect(() => {
    verificarCliente(uid)
      .then(cliente => {
        if(cliente.terminos === false){
          window.location.href = '/newClient/datosCliente';
        }
      })
      .catch(error => {
        console.error(error.message);
        window.location.href = '/newClient/datosCliente';
      });
  }, [uid]);

  if (!user) {
    return redirect('/newClient/datosCliente');
  }

  return (
    <div className="min-h-screen flex flex-col p-2 lg:container-perspective mx-auto">
      <div className="rounded-lg mb-8 mx-auto">
        <Veterinaria />
      </div>
      <div className="flex flex-col lg:flex-row lg:w-3/4 lg:mx-auto gap-10 mb-8 container-perspective lg:ml-28 lg:mt-20">
        <div className={`w-[360px] md:mr-10 lg:w-2/3 p-3 lg:p-5 element2 mx-auto ${isMobile ? 'h-auto' : 'h-[300px] lg:h-[400px]'} rounded-lg bg-violet-100 bg-opacity-50 flex flex-col gap-4 my-10 lg:my-0`}>
          <MisDatos />
          <MisTurnos />
        </div>
        <div className={`w-[360px] lg:w-3/4 bg-violet-100 mx-auto bg-opacity-50 rounded-lg p-3 lg:p-5 element mx-auto my-20 lg:mt-20 lg:-mr-24 `}>
          <DatosMascotas />
        </div>
      </div>
      <div className="mt-20 w-[360px] lg:w-3/4 mx-auto">
        <Productos />
      </div>
      <div className="my-8 w-full" id="Adopciones">
        <MascotasAdopcion />
      </div>
    </div>
  );
}