'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';
import { clienteExisteConTerminosTRUE, clienteEsPremium } from '../firebase';

export default function Header() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [terminos, setTerminos] = useState(false);
  const [premium, setPremium] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (uid) {
      clienteExisteConTerminosTRUE(uid)
        .then((result) => {
          setTerminos(!!result);
        })
        .catch((error) => {
          console.error("Error verificando términos:", error);
        });

      clienteEsPremium(uid)
        .then((result) => {
          setPremium(!!result);
        })
        .catch((error) => {
          console.error("Error verificando premium:", error);
        });
    }
  }, [uid]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>{uid?  
    <header className="bg-gray-800 flex flex-col sm:flex-col justify-between items-center px-4 sm:px-8 py-4">
      {premium ? (
        <p>Cliente Premium</p>
      ) : (
        <button className='btn rounded p-2 text-2xl text-red-500 bg-yellow-500 ml-auto'>¡Promociones!</button>
      )}
      <div>
        <Image src="/LOGO.svg" alt="Vercel Logo" width={400} height={350} />
      </div>
      {terminos && (
        <nav className="hidden md:flex items-center space-x-4 text-white text-xl md:text-3xl">
          <Link href="/HomeCliente">
              Inicio
          </Link>
          <Link href="/HomeCliente/Acciones/Perfil">
            Perfil
          </Link>
          <Link href="/HomeCliente/Acciones/Mismascotas">
            Mascotas
          </Link>
          <Link href="/HomeCliente/Acciones/MisTurnos">
            Turnos
          </Link>
          {/* <Link href="/HomeCliente/Acciones/MisTraslados">
            Traslados
          </Link>
          <Link href="/HomeCliente/Acciones/MisGuarderias">
            Guarderia
          </Link> */}
          <Link href="/HomeCliente/Acciones/Adopcion">
            Adopción
          </Link>
        </nav>
      )}
      <div className="md:hidden">
        <button
          onClick={handleMobileMenuToggle}
          className="block text-white focus:outline-none px-4 py-2"
        >
          {mobileMenuOpen && !terminos ? null : null}
          {mobileMenuOpen && terminos ? (
            <div className="text-amber-400 text-3xl cursor-pointer hover:text-amber-600 hover:underline ml-16 pl-2">X</div>
          ) : (
            <div className='text-amber-600 text-3xl cursor-pointer'>☰</div>
          )}
        </button>
        {mobileMenuOpen && (
          <nav className="flex flex-col items-center justify-center w-full space-y-4 text-white py-4 px-8 text-xl md:text-3xl">
            <Link href="/HomeCliente">
      Inicio
            </Link>
            <Link href="/HomeCliente/Acciones/Perfil">
      Perfil
            </Link>
            <Link href="/HomeCliente/Acciones/Mismascotas">
   Mascotas
            </Link>
            <Link href="/HomeCliente/Acciones/MisTurnos">
              Turnos
            </Link>
            {/* <Link href="/HomeCliente/Acciones/MisTraslados">
              Traslados
            </Link> */}
            {/* <Link href="/HomeCliente/Acciones/MisGuarderia">
    Guarderia
            </Link> */}
            <Link href="/HomeCliente/Acciones/Adopcion">
Adopción
            </Link>
          </nav>
        )}
      </div>
    </header>
    : null}</>
  );
}
