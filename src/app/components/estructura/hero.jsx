import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ['/hero1.jpg', '/hero2.jpg', '/hero3.jpg', '/hero4.jpg'];
  const intervalTime = 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [images.length]); // Agrega images.length como dependencia

  return (
    <div className="flex flex-col md:flex-row  lg:flex-row justify-between mx-auto items-center relative w-full md:h-[400px] lg:h-[500px] bg-cyan-900 bg-opacity-80 m-5  shadow-md overflow-hidden flex items-center justify-center)] overflow-hidden p-10">
      <div className='p-5 ml-10'>
        <h1 className='text-3xl text-white text-center font-bold uppercase tracking-wider mx-auto border-b-2 border-yellow-200 pb-2 '>¡ Bienvenido a la veterinaria !</h1>
        <p className='text-xl my-6 text-white text-center font-bold uppercase tracking-wider '>
          Buscando estar más cerca de vos y de tus mascotas
        </p>
        <ul className='text-xl  text-white text-left font-bold uppercase tracking-wider my-10 '>
          <li className='hover:text-yellow-200'>Adopta</li>
          <li className='hover:text-yellow-200'>Reserva una visita</li>
          <li className='hover:text-yellow-200'>Hace tus compras</li>
          <li className='hover:text-yellow-200'>Manten actualizada la informacion de tu mascota</li>
          <li className='text-3xl my-10'>¡Todo por la web.... Desde tu casa!</li>
        </ul>
      </div>
      <div className="flex flex-col  items-center justify-center mb-10 lg:mr-20 lg:mt-10 ">
        <Image src={images[currentSlide]} alt="visitas"  width={300} height={300} className='rounded-[100%] imagen'/>
        <h2 className='text-3xl text-white text-center font-bold uppercase tracking-wider mt-10 lg:mt-2 border-b-2 border-yellow-200 mx-auto '>Nuestras visitas!!</h2>
      </div>
    </div>
  );
}
