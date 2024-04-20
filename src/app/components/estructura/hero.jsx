import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UseClient } from '@/app/context/ClientContext';

export default function Hero() {
  const {datosCliente} = UseClient();
  console.log(datosCliente);

  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ['/hero1.jpg', '/hero2.jpg', '/hero3.jpg', '/hero4.jpg'];
  const intervalTime = 5000; // Cambia el intervalo de tiempo en milisegundos según lo deseado

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between mx-auto items-center relative w-full h-[400px] bg-cyan-900 bg-opacity-80  shadow-md overflow-hidden flex items-center justify-center)] overflow-hidden p-10">
      <div className='p-5'>
            <h1 className='text-3xl text-white text-center font-bold uppercase tracking-wider mx-auto '>¡ Bienvenido a la veterinaria {datosCliente?.nombre} !</h1>
            <p className='text-xl my-6 text-white text-center font-bold uppercase tracking-wider '>
              Buscando estar mas cerca de vos y de tus mascotas
            </p>
      </div>
      <div className="flex flex-col mx-auto items-center justify-center mb-10 w-[500px] p-4">
      <Image src={images[currentSlide]} alt="visitas" objectFit="contain" width={300} height={300} className='imagenHero mr-10 '/>
        <h2 className='text-3xl text-white text-center font-bold uppercase tracking-wider'>Nuestras visitas!!</h2>
      </div>
    </div>
  );
}
