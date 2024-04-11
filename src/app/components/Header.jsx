'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';
import { clienteExisteConTerminosTRUE, clienteEsPremium } from '../firebase';

// Componente para el menú de navegación de clientes regulares

function NavigationMenu({ handleLinkClick }) {
  return (
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
      <Link href="/HomeCliente/Acciones/Adopcion">
        Adopción
      </Link>
    </nav>
  );
}

// Componente para el menú móvil de clientes regulares
function MobileMenu({ isOpen, handleMobileMenuToggle, handleLinkClick }) {
  return (
    <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
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

// Componente para el menú de navegación de la empresa
function EmpresaMenu() {
  return (
    <nav className="hidden md:flex items-center space-x-10 text-white">
          <div className='flex flex-col'>
          <span className="text-cyan-500">Oficina</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga" className='text-xl'>
              Inicio
            </Link>
            <Link href="/HomeMaga" className='text-xl'>
              Caja
            </Link>
          </div>
          </div>
      
      <div className='flex flex-col'>
          <span className="text-cyan-500">Informacion</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/clientes">
              Clientes
            </Link>
            <Link href="/HomeMaga/mascotas">
              Mascotas
            </Link>
            <Link href="/HomeMaga/Clientes">
              Adopciones
            </Link>
          </div>
        </div>
      <div className='flex flex-col'>
        <span className="text-cyan-500">Productos</span>
        <div className="flex space-x-4">
          <Link href="/HomeMaga/Promociones">
            Promociones
          </Link>
          <Link href="/HomeMaga/Productos">
            Productos
          </Link>
        </div>
      </div>
      <div className='flex flex-col'>
        <span className="text-cyan-500">Turnos</span>
        <div className="flex space-x-4">
          <Link href="/HomeMaga/turnosPeluqueria">
            Turnos Veterinaria
          </Link>
          <Link href="/HomeMaga/turnosPeluqueria">
            Turnos Peluquería
          </Link>
        </div>
      </div>
      <div className='flex flex-col'>
        <span className="text-cyan-500">Empleados</span>
        <div className="flex space-x-4">
          <Link href="/HomeMaga/Peluqueria">
            Peluquería
          </Link>
          <Link href="/HomeMaga/Transporte">
            Transporte
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Componente para el menú móvil de la empresa
function EmpresaMobileMenu({ isOpen, handleMobileMenuToggle }) {
  const { user } = UserAuth();
  const uid = user?.uid;

  const isAdminOrEmployee = uid === process.env.NEXT_PUBLIC_UIDADM || uid === process.env.NEXT_PUBLIC_UIDTRANSPORTE || uid === process.env.NEXT_PUBLIC_UIDPELUQUERIA || uid === process.env.NEXT_PUBLIC_UIDDEV;

  const handleLinkClick = () => {
    // Cerrar el menú móvil al hacer clic en un enlace
    handleMobileMenuToggle();
  };

  return (
    <div className={`md:hidden ${isOpen && isAdminOrEmployee ? 'block' : 'hidden'}`}>
      <nav className="flex flex-col mr-32  space-y-4 text-white text-left text-xl">
      <div className='flex flex-col'>
          <span className="text-cyan-500">Oficina</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga" className='text-xl'>
              Inicio
            </Link>
            <Link href="/HomeMaga" className='text-xl'>
              Caja
            </Link>
          </div>
          </div>
        <div className='flex flex-col'>
          <span className="text-cyan-500">Informacion</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/clientes">
              Clientes
            </Link>
            <Link href="/HomeMaga/mascotas">
              Mascotas
            </Link>
            <Link href="/HomeMaga/adopciones">
              Adopciones
            </Link>
          </div>
        </div>
        <div className='flex flex-col'>
          <span className="text-cyan-500">Productos</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/Promociones">
              Promociones
            </Link>
            <Link href="/HomeMaga/Productos">
              Productos
            </Link>
          </div>
        </div>
        <div className='flex flex-col'>
          <span className="text-cyan-500">Turnos</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/turnosPeluqueria">
              Turnos Veterinaria
            </Link>
            <Link href="/HomeMaga/turnosPeluqueria">
              Turnos Peluquería
            </Link>
          </div>
        </div>
        <div className='flex flex-col'>
          <span className="text-cyan-500">Empleados</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/Peluqueria">
              Peluquería
            </Link>
            <Link href="/HomeMaga/Transporte">
              Transporte
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function Header() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (uid) {
      clienteExisteConTerminosTRUE(uid)
        .then((result) => {
          // Do something with result
        })
        .catch((error) => {
          console.error("Error verificando términos:", error);
        });

      clienteEsPremium(uid)
        .then((result) => {
          // Do something with result
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
        <header className="bg-gray-800 flex flex-col items-center px-4 py-2 md:py-4">
          <div className="flex justify-between items-center w-full">
            <div className="w-1/3 md:w-auto">
              <Image src="/LOGO.svg" alt="Logo" width={200} height={200} className="lg:ml-20 lg:mt-5" />
            </div>
            <div className="md:hidden">
              <button onClick={handleMobileMenuToggle} className="text-white focus:outline-none">
                {mobileMenuOpen ? (
                  <span className="text-3xl">&#10005;</span>
                  ) : (
                    <span className="text-3xl">&#9776;</span>
                )}
              </button>
            </div>
          </div>
          {uid === process.env.NEXT_PUBLIC_UIDADM || uid === process.env.NEXT_PUBLIC_UIDTRANSPORTE || uid === process.env.NEXT_PUBLIC_UIDPELUQUERIA || uid === process.env.NEXT_PUBLIC_UIDDEV ? (
            <EmpresaMenu />
          ) : (
            <NavigationMenu handleLinkClick={handleLinkClick} />
          )}
          <EmpresaMobileMenu isOpen={mobileMenuOpen} handleMobileMenuToggle={handleMobileMenuToggle} />
        </header>
      ) : null}
    </>
  );
}
