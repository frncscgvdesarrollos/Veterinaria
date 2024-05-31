'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserAuth } from '../../context/AuthContext';

function MobileMenu({ isOpen, handleMobileMenuToggle, handleLinkClick }) {
  return (
    <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <nav className="flex flex-col items-center space-y-4 text-white text-xl">
        <Link href="/HomeCliente" passHref>
          <span onClick={handleLinkClick}>Inicio</span>
        </Link>
        <Link href="/HomeCliente/Acciones/Adopcion" passHref>
          <span onClick={handleLinkClick}>Adopción</span>
        </Link>
        <Link href="/HomeCliente/Acciones/productos" passHref>
          <span onClick={handleLinkClick}>Productos</span>
        </Link>
      </nav>
    </div>
  );
}

function EmpresaMenu() {
  return (
    <nav className="hidden ml-12 md:flex items-center space-x-10 text-white">
      <div className="flex flex-col">
        <span className="text-cyan-500">Oficina</span>
        <div className="flex space-x-4">
          <Link href="/HomeMaga" passHref>
            <span>Inicio</span>
          </Link>
          <Link href="/HomeMaga/caja" passHref>
            <span>Caja</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-cyan-500">Información</span>
        <div className="flex space-x-4">
          <Link href="/HomeMaga/clientes" passHref>
            <span>Clientes</span>
          </Link>
          <Link href="/HomeMaga/mascotas" passHref>
            <span>Mascotas</span>
          </Link>
          <Link href="/HomeMaga/adopciones" passHref>
            <span>Adopciones</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-cyan-500">Productos</span>
        <div className="flex space-x-4">
          <Link href="/HomeMaga/promociones" passHref>
            <span>Promociones</span>
          </Link>
          <Link href="/HomeMaga/productos" passHref>
            <span>Productos</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-cyan-500">Turnos</span>
        <div className="flex space-x-4">
          <Link href="/HomeMaga/turnosPeluqueria" passHref>
            <span>Turnos Veterinaria</span>
          </Link>
          <Link href="/HomeMaga/turnosPeluqueria" passHref>
            <span>Turnos Peluquería</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-cyan-500">Empleados</span>
        <div className="flex space-x-4">
          <Link href="/HomeMaga/Peluqueria" passHref>
            <span>Peluquería</span>
          </Link>
          <Link href="/HomeMaga/Transporte" passHref>
            <span>Transporte</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function EmpresaMobileMenu({ isOpen, handleMobileMenuToggle }) {
  return (
    <div className={`md:hidden ${isOpen ? 'block ml-12' : 'hidden'}`}>
      <nav className="flex flex-col mr-32 space-y-4 text-white text-left text-xl">
        <div className="flex flex-col">
          <span className="text-cyan-500">Oficina</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga" passHref>
              <span>Inicio</span>
            </Link>
            <Link href="/HomeMaga/caja" passHref>
              <span>Caja</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-cyan-500">Información</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/clientes" passHref>
              <span>Clientes</span>
            </Link>
            <Link href="/HomeMaga/mascotas" passHref>
              <span>Mascotas</span>
            </Link>
            <Link href="/HomeMaga/adopciones" passHref>
              <span>Adopciones</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-cyan-500">Productos</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/promociones" passHref>
              <span>Promociones</span>
            </Link>
            <Link href="/HomeMaga/productos" passHref>
              <span>Productos</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-cyan-500">Turnos</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/turnosPeluqueria" passHref>
              <span>Turnos Veterinaria</span>
            </Link>
            <Link href="/HomeMaga/turnosPeluqueria" passHref>
              <span>Turnos Peluquería</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-cyan-500">Empleados</span>
          <div className="flex space-x-4">
            <Link href="/HomeMaga/Peluqueria" passHref>
              <span>Peluquería</span>
            </Link>
            <Link href="/HomeMaga/Transporte" passHref>
              <span>Transporte</span>
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
  const [isOpenNow, setIsOpenNow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      checkOpenStatus();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkOpenStatus = () => {
    const now = new Date();
    const openTime = new Date(now);
    openTime.setHours(9, 0, 0); // 9:00 AM
    const closeTime = new Date(now);
    closeTime.setHours(18, 0, 0); // 6:00 PM

    setIsOpenNow(now >= openTime && now <= closeTime);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {uid ? (
        <header className="bg-gray-800 bg-opacity-80  top-0 z-10 flex flex-col items-center px-4 py-2 md:py-4">
          <span className="text-white text-xl mb-4 bg-red-500">La web esta en prueba no compre ni reserve nada todavia xD attentamente el desarrollador</span>
          <div className="flex justify-between items-center w-full">
            <div className=" mr-auto flex items-center justify-center " >
              <Link href="/HomeCliente" >
                <Image src="/LOGO.svg" alt="Logo"  width={200} height={200} className="cursor-pointer" />
              </Link>
            </div>
            <span className="text-white ml-auto text-cyan-300 mt-8 underline">
              La Veterinaria está {isOpenNow ? 'abierta' : 'cerrada'}
            </span>
            <MobileMenu />
          </div>
          {isOpenNow && (
            // EmpresaMenu solo se muestra si la empresa está abierta
            (uid === process.env.NEXT_PUBLIC_UIDADM ||
              uid === process.env.NEXT_PUBLIC_UIDTRANSPORTE ||
              uid === process.env.NEXT_PUBLIC_UIDPELUQUERIA ||
              uid === process.env.NEXT_PUBLIC_UIDDEV) && <EmpresaMenu />
          )}
          <EmpresaMobileMenu
            isOpen={mobileMenuOpen}
            handleMobileMenuToggle={handleMobileMenuToggle}
          />
        </header>
      ) : null}
    </>
  );
}
