'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';
import { clienteExisteConTerminosTRUE, clienteEsPremium } from '../firebase';

// Componente para el menú de navegación
function NavigationMenu({ handleLinkClick }) {
  return (
    <nav className="hidden md:flex  items-center space-x-4 text-white text-xl md:text-3xl">
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
      <Link href="/HomeCliente/Acciones/Adopcion">
        Adopción
      </Link>
    </nav>
  );
}

// Componente para el menú móvil
function MobileMenu({ isOpen, handleMobileMenuToggle, handleLinkClick }) {
  return (
    <div className={` md:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <nav className="flex flex-col items-center space-y-4 text-white text-xl">
        <Link href="/HomeCliente" onClick={handleLinkClick}>
          Inicio
        </Link>
        <Link href="/HomeCliente/Acciones/Perfil" onClick={handleLinkClick}>
          Perfil
        </Link>
        <Link href="/HomeCliente/Acciones/Mismascotas" onClick={handleLinkClick}>
          Mascotas
        </Link>
        <Link href="/HomeCliente/Acciones/MisTurnos" onClick={handleLinkClick}>
          Turnos
        </Link>
        <Link href="/HomeCliente/Acciones/Adopcion" onClick={handleLinkClick}>
          Adopción
        </Link>
      </nav>
    </div>
  );
}

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

  const handleLinkClick = () => {
    // Cerrar el menú móvil al hacer clic en un enlace
    setMobileMenuOpen(false);
  };

  return (
    <>
      {uid ? (
        <header className="bg-gray-800 flex flex-col  items-center px-4 py-2 md:py-4">
          <div className="flex flex-row justify-between w-full space-x-4">
          <div>
            <Image src="/LOGO.svg" alt="Logo" width={120} height={120} />
          </div>
          <div className="flex  items-center space-x-4 w-1/3">
            {premium ? (
              <p className="text-white">Cliente Premium</p>
            ) : (
              <button className="btn rounded p-2 text-xl text-red-500 bg-yellow-500">¡Promociones!</button>
            )}
            </div>
            <div className="md:hidden flex flex-row w-[10%]">
              <button onClick={handleMobileMenuToggle} className="text-white focus:outline-none">
                {mobileMenuOpen ? (
                  <span className="text-3xl">&#10005;</span>
                ) : (
                  <span className="text-3xl">&#9776;</span>
                )}
              </button>
            </div>
          </div>
          {terminos && <NavigationMenu handleLinkClick={handleLinkClick} />}
          <MobileMenu isOpen={mobileMenuOpen} handleMobileMenuToggle={handleMobileMenuToggle} handleLinkClick={handleLinkClick} />
        </header>
      ) : null}
    </>
  );
}
