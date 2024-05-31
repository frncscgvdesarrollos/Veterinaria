'use client'
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { UserAuth } from "../app/context/AuthContext";
import Image from 'next/image'; // Importar Image desde next/image

export default function Home() {
  const { user, googleSignIn } = UserAuth();
  const usuario = user;

  useEffect(() => {
    if (usuario) {
      redirect("/HomeCliente");
    }
  }, [user]);


  const handleSignIn = () => {
    googleSignIn();
  };

  return (
    <main className="clase-fondo min-h-screen flex flex-col lg:flex-row items-center  bg-gradient-to-b from-gray-800 to-indigo-300 ">
           <div className="max-w-2/3 mx-auto text-center bg-purple-100 rounded-lg p-12 bg-opacity-50 flex-col flex gap-2">
        <h1 className="text-5xl font-bold text-cyan-800 mt-12 mb-8">¡Bienvenido a la <span className="text-lime-600">Veterinaria Online</span>!</h1>
        <p className="text-2xl font-medium text-cyan-900 mb-8 ">Aquí puedes encontrar la mejor atención<br/>
        <span className="text-2xl font-medium">Reservar turnos para la veterinaria y la peluquería de tus mascotas.</span><br/>
        </p>
        <span className="text-2xl font-medium text-yellow-500 bg-opacity-50 bg-yellow-300 rounded-lg p-2 mt-8">Conoce la tienda y hace tus compras desde casa</span>
        <br/>
        <span className="text-2xl font-medium text-purple-500 bg-opacity-50 bg-purple-300 rounded-lg px-2 pb-2 my-8">¡Conoce nuestro sistema de adopción!</span>
      </div>
      <div>
        <section className="flex flex-col items-center mx-auto lg:mr-8">
          <Image src="/logo.svg" alt="Logo" width={300} height={300}  />
          <button className="bg-cyan-700 hover:bg-pink-300 text-white font-bold py-3 px-6 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105" onClick={handleSignIn}>Ingresar</button>
        </section>
      </div>

    </main>
  );
}