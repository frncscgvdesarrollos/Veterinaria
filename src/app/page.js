'use client'
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { UserAuth } from "../app/context/AuthContext";
import { clienteExiste, clienteExisteConTerminosTRUE } from "../app/firebase";

export default function Home() {
  const { user, googleSignIn } = UserAuth();
  const [isClient, setIsClient] = useState(false);
  const [isClientWithTerms, setIsClientWithTerms] = useState(false);

  useEffect(() => {
    if (user) {
      const { uid } = user;
      clienteExiste(uid)
        .then((clientExists) => {
          setIsClient(clientExists);
          if (clientExists) {
            clienteExisteConTerminosTRUE(uid)
              .then((clientWithTerms) => {
                setIsClientWithTerms(clientWithTerms);
                if (!clientWithTerms) {
                  redirect('/newClient/datosTerminos');
                } else {
                 redirect('/HomeCliente');
                }
              })
              .catch((error) => {
                console.error("Error verifying client with terms:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error verifying client:", error);
        });
    }
  }, [user]);

  const handleSignIn = () => {
    googleSignIn();
  };

  return (
    <main className="clase-fondo min-h-screen flex flex-col items-center p-18 pt-24 bg-gradient-to-b from-gray-800 to-indigo-300">
      <div className="max-w-2/3 mx-auto text-center">
        <h1 className="text-5xl font-bold text-cyan-800 mt-12 mb-8">¡Bienvenido a la <span className="text-lime-600">Veterinaria Online</span>!</h1>
        <p className="text-2xl font-medium text-cyan-900 mb-8 ">Aquí puedes encontrar la mejor atención <br/><span className="text-2xl font-medium">Reservar turnos para la clínica y la peluquería de tus mascotas.</span></p>
        <button className="bg-cyan-700 hover:bg-pink-300 text-white font-bold py-3 px-6 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105" onClick={handleSignIn}>Ingresar</button>
      </div>
    </main>
  );
}
