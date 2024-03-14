import Image from 'next/image';
import Link from 'next/link';
export default function Veterinaria() {
  return (
<div className='w-full flex flex-col items-center justify-center text-center p-5 md:p-10 contenedorVeterinaria'>
      <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold border-b-2 border-cyan-100 text-lime-500 p-8 md:p-8 bg-[#0f3f0f]'>Tu mascota sana</h1>
      <div className='flex flex-col  p-5 md:p-20 m-auto'>
        <div className='flex flex-col items-center p-10 container-reservas border-r-2 border-t-2 border-cyan-100 mb-8 md:mb-0 '>
          <div className='flex flex-col sm:flex-row w-full items-center justify-around'>
            <h3 className='textoVeterinaria mt-5 border-b-2 border-cyan-100 text-3xl sm:text-4xl text-lime-500 '>Chequeos</h3>
            <div className='w-40 md:w-auto mb-4 flex items-center'>
              <Image src="/hd8.jpg" alt="veterinaria" width={80} height={80} className='imagenVeterinaria scale-150 m-auto mt-10 md:mt-0 md:mr-16' />
            </div>
          </div>
          <div className='flex flex-col sm:flex-row items-center'>
            <Link href='/HomeCliente/TurneroCheckeo' className='botonVeterinaria bg-[#1E90FF] text-white w-full sm:w-1/3 p-2 border-2 border-cyan-100 mt-4 rounded-lg'>Reservar</Link>
            <p className='mt-2 text-base sm:text-lg p-2 w-full sm:w-2/3 md:mr-16'>
              Mantenga a su mascota sana realizando consultas para prevenir enfermedades y garantizar su bienestar. Ofrecemos consultas tanto en nuestras instalaciones como a domicilio para mayor comodidad.
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center p-10 container-reservas2 border-l-2 border-t-2 border-cyan-100 mb-8 md:mb-0'>
          <div className='flex flex-col sm:flex-row w-full items-center justify-around'>
            <div className='w-40 md:w-auto mb-4 flex items-center'>
              <Image src="/hd6.jpg" alt="veterinaria" width={80} height={80} className='imagenVeterinaria scale-150 m-auto mt-10 md:mt-0 md:ml-16' />
            </div>
            <h3 className='textoVeterinaria mt-5 border-b-2 border-cyan-100 text-3xl sm:text-4xl text-lime-500 '>Peluquería</h3>
          </div>
          <div className='flex flex-col sm:flex-row items-center'>
            <Link href='/HomeCliente/turneroPeluqueria' className='botonVeterinaria bg-[#1E90FF] text-white w-full sm:w-1/3 p-2 border-2 border-cyan-100 mt-4 rounded-lg'>Reservar</Link>
            <p className='mt-2 text-base sm:text-lg p-2 w-full sm:w-2/3 md:ml-16'>
              Ofrecemos una amplia gama de servicios de peluquería canina, que van desde el baño básico hasta el corte especializado. Todos nuestros servicios incluyen el traslado a domicilio, brindando comodidad y calidad para su mascota.
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center p-10 container-reservas border-r-2 border-t-2 border-cyan-100 mb-8 md:mb-0'>
          <div className='flex flex-col sm:flex-row w-full items-center justify-around'>
            <h3 className='textoVeterinaria mt-5 border-b-2 border-cyan-100 text-3xl sm:text-4xl text-lime-500 '>Vacunación</h3>
            <div className='w-40 md:w-auto mb-4 flex items-center'>
              <Image src="/hd7.jpg" alt="veterinaria" width={80} height={80} className='imagenVeterinaria scale-150 m-auto mt-10 md:mt-0 md:mr-16' />
            </div>
          </div>
          <div className='flex flex-col sm:flex-row items-center'>
            <p className='mt-2 text-base sm:text-lg p-2 w-full sm:w-2/3 md:mr-16'>
              Mantenga a su mascota protegida contra enfermedades con nuestro servicio de vacunación. Ofrecemos un calendario de vacunación personalizado y enviamos recordatorios para garantizar que su mascota esté siempre al día con sus vacunas.
            </p>
            <Link href='/contacto' className='botonVeterinaria bg-[#1E90FF] text-white w-full sm:w-1/3 p-2 border-2 border-cyan-100 mt-4 rounded-lg'>Reservar</Link>
          </div>
        </div>
      </div>
    </div>

      );
    }
    

