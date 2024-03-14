'use client'
import { useEffect } from "react";
import { redirect } from 'next/navigation';
import { UserAuth } from "./context/AuthContext";


export default function Home() {
  const { user, googleSignIn } = UserAuth();

  useEffect(() => {
    if(user){
      redirect('/datosCliente')
    }
  }, [user]);

  const handleSignIn = () => {
    googleSignIn()
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
