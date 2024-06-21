'use client'
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { UserAuth } from "../app/context/AuthContext";
import Image from 'next/image'; 

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
    <main className="clase-fondo min-h-screen flex flex-col lg:flex-row items-center  bg-gradient-to-b from-gray-800 to-indigo-300">
      <div className="max-w-2/3 mx-auto text-center bg-purple-100  rounded-lg p-12 bg-opacity-50 flex-col flex gap-2 bg-opacity-50 bg-cyan-300 my-5 flex lg:flex-row gap-8 my-auto">
         <div className="flex flex-col gap-2">
            <Image src="/LOGO.svg" alt="Logo" width={300} height={300} className="mx-auto"  />
            <h1 className="text-2xl font-bold text-cyan-800 text-left mx-2 ">¡Bienvenido a la <span className="text-lime-600">Veterinaria Online</span>!</h1>
            <span className="text-1xl font-medium text-cyan-900 text-left mx-2 ">Aquí puedes encontrar la mejor atención para tus mascotas</span>
            <span className="text-1xl font-medium text-cyan-900 rounded-lg px-2 pb-2 text-left" >Reservar turnos para la veterinaria y la peluquería de tus mascotas. <br/></span>
            <span className="text-1xl font-medium text-cyan-900 rounded-lg px-2 pb-2 text-left">Realizar compras y ver mascotas en adopción.</span>
            {/* <span className="text-2xl font-medium text-yellow-500 bg-opacity-50 bg-orange-900 rounded-lg p-2 mt-2">Conoce la tienda y hace tus compras desde casa.</span>*/}
            <button className="bg-cyan-700 hover:bg-pink-300 text-white font-bold py-3 px-6 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105" onClick={handleSignIn}>Ingresar</button>
          </div>
      </div>
    </main>
  );
}