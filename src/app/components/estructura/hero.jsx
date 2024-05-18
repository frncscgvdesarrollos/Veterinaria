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
      <div className='p-5'>
        <h1 className='text-3xl text-white text-center font-bold uppercase tracking-wider mx-auto '>¡ Bienvenido a la veterinaria !</h1>
        <p className='text-xl my-6 text-white text-center font-bold uppercase tracking-wider '>
          Buscando estar más cerca de vos y de tus mascotas
        </p>
      </div>
      <div className="flex flex-col  items-center justify-center mb-10 w-[500px] p-4  ">
        <Image src={images[currentSlide]} alt="visitas" objectFit="contain" width={300} height={300} className='imagenHero   md:mr-10 lg:mr-24 '/>
        <h2 className='text-3xl text-white text-center font-bold uppercase tracking-wider mt-10 lg:mt-2 '>Nuestras visitas!!</h2>
      </div>
    </div>
  );
}
