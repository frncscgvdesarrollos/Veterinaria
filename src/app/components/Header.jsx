'use client'
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
        .then((terminos) => {
          if (terminos) {
            setTerminos(true);
          }
        })
        .catch((error) => {
          console.error("Error verificando términos:", error);
        });

      clienteEsPremium(uid)
        .then((premium) => {
          if (premium) {
            setPremium(true);
          }
        })
        .catch((error) => {
          console.error("Error verificando premium:", error);
        });
    }
  }, [uid]);

  if (!uid) {
    return null; // Si el usuario no está autenticado, simplemente no renderizamos nada
  }

  return (
    <header className="bg-gray-800 flex flex-col sm:flex-col justify-between items-center px-4 sm:px-8 py-4">
      {premium ? <p>Cliente Premium</p> : <button className='btn rounded p-2 text-2xl text-red-500 bg-yellow-500 ml-auto'>¡Promociones!</button>}
      <div>
        <Image src="/LOGO.svg" alt="Vercel Logo" width={400} height={350} />
      </div>
      {terminos && (
        <nav className="hidden md:flex items-center space-x-4 text-white text-xl md:text-3xl">
          <Link href="/HomeCliente" className="hover:underline">
            Inicio
          </Link>
          <Link href="/HomeCliente/Acciones/Perfil" className="hover:underline">
            Perfil
          </Link>
          <Link href="/HomeCliente/Acciones/Mismascotas" className="hover:underline">
            Mascotas
          </Link>
          <Link href="/HomeCliente/Acciones/MisTurnos" className="hover:underline">
            Turnos
          </Link>
          <Link href="/HomeCliente/Acciones/MisTraslados" className="hover:underline">
            Traslados
          </Link>
          <Link href="/HomeCliente/Acciones/MisGuarderias" className="hover:underline">
            Guarderia
          </Link>
          <Link href="/HomeCliente/Acciones/Adopcion" className="hover:underline">
            Adopción
          </Link>
        </nav>
      )}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="block text-white focus:outline-none px-4 py-2"
        >
          {mobileMenuOpen && !terminos ? null : null}
          {mobileMenuOpen && terminos ? <div className="text-amber-400 text-3xl cursor-pointer hover:text-amber-600 hover:underline ml-16 pl-2">X</div> : <div className='text-amber-600 text-3xl cursor-pointer'>☰</div>}
        </button>
        {mobileMenuOpen && (
          <nav className="flex flex-col items-center justify-center w-full space-y-4 text-white py-4 px-8 text-xl md:text-3xl">
            <Link href="/HomeCliente/Acciones/Perfil" className="hover:underline">
              Perfil
            </Link>
            <Link href="/HomeCliente/Acciones/Mismascotas" className="hover:underline">
              Mascotas
            </Link>
            <Link href="/HomeCliente/Acciones/MisTurnos" className="hover:underline">
              Turnos
            </Link>
            <Link href="/HomeCliente/Acciones/MisTraslados" className="hover:underline">
              Traslados
            </Link>
            <Link href="/HomeCliente/Acciones/MisGuarderia" className="hover:underline">
              Guarderia
            </Link>
            <Link href="/HomeCliente/Acciones/Adopcion" className="hover:underline">
              Adopción
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
