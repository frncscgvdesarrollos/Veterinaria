'use client';
import Veterinaria from '../components/Veterinaria';
import { UserAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { clienteExiste } from '../firebase';
import { redirect } from 'next/navigation';

// Add 'use client' directive at the beginning

export default function HomeCliente() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClientData = () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      return clienteExiste(uid)
        .then((clientData) => {
          setClientData(clientData);
        })
        .catch((error) => {
          console.error("Error al cargar la información del cliente:", error);
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (user && uid) {
      loadClientData().then(() => {
        if (!clientData) {
          redirect('/newClient/datosCliente'); // Redirect if no client data
        }
      });
    }
  }, [uid, user ,clientData ]);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 HomeCliente ">
      {isLoading && <p>Cargando datos del cliente...</p>}
      {error && <p>Error al cargar datos: {error.message}</p>}
      {clientData && <Veterinaria clientData={clientData} />}
      {!user && <p>Por favor inicie sesión para acceder a su perfil.</p>}
    </div>
  );
}
