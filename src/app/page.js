'use client'
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { UserAuth } from "../app/context/AuthContext";
import Image from 'next/image'; // Importar Image desde next/image

export default function Home() {
  const { user, googleSignIn } = UserAuth();
  const usuario = user;
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (usuario) {
      redirect("/HomeCliente");
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = () => {
    googleSignIn();
  };

  return (
    <main className="clase-fondo min-h-screen flex flex-col items-center  pt-24 bg-gradient-to-b from-gray-800 to-indigo-300">
      {showModal && (
        <div className="fixed backgroundModal top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-violet-100 p-8 rounded shadow-lg animate-opacity w-5/6 h-5/6 my-auto">
          <Image
            src="/LOGO3.svg"
            alt="logo"
            className="imagenModal"
            width={200}
            height={200}
          />
        </div>
        </div>
      )}
      <div className="max-w-2/3 mx-auto text-center">
        <h1 className="text-5xl font-bold text-cyan-800 mt-12 mb-8">¡Bienvenido a la <span className="text-lime-600">Veterinaria Online</span>!</h1>
        <p className="text-2xl font-medium text-cyan-900 mb-8 ">Aquí puedes encontrar la mejor atención <br/><span className="text-2xl font-medium">Reservar turnos para la clínica y la peluquería de tus mascotas.</span></p>
        <button className="bg-cyan-700 hover:bg-pink-300 text-white font-bold py-3 px-6 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105" onClick={handleSignIn}>Ingresar</button>
      </div>
    </main>
  );
}