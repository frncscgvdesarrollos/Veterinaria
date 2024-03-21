import Image from 'next/image';
import Link from 'next/link';

export default function Veterinaria() {
  return (
    <div className='w-full flex flex-col sm:flex-row sm:items-center m-auto p-10 contenedorVeterinaria'>
      <div className='flex flex-wrap justify-center gap-8'>
        <div className='flex flex-col items-center w-full sm:w-1/2 md:w-1/3 p-5 sm:p-10 border border-cyan-100 rounded-lg bg-cyan-600'>
          <div className='w-32 sm:w-40 md:w-auto mb-4 rounded-full overflow-hidden'>
            <Image src="/hd8.jpg" alt="veterinaria" width={100} height={100} className='imagenVeterinaria scale-100 rounded-full m-auto'  />
          </div>
          <h3 className='textoVeterinaria text-xl sm:text-3xl font-bold mt-5 mb-4 text-cyan-900'>Chequeos</h3>
          <div className='flex flex-col items-center'>
            <p className='text-base sm:text-lg text-gray-700 mb-4 mt-2 text-white'>
              Mantenga a su mascota sana realizando chequeos para prevenir enfermedades y garantizar su bienestar. Ofrecemos consultas tanto en nuestras instalaciones como a domicilio para mayor comodidad.
            </p>
            <Link href='/HomeCliente/Acciones/TurneroCheckeo' className='botonVeterinaria bg-blue-500 text-center text-white w-full mt-5 p-2 border-2 border-black rounded-lg'>Reservar</Link>
          </div>
        </div>

        <div className='flex flex-col items-center p-5 sm:p-10 border w-full sm:w-1/2 md:w-1/3 border-cyan-100 rounded-lg bg-violet-400'>
          <div className='w-32 sm:w-40 md:w-auto mb-4 rounded-full overflow-hidden'>
            <Image src="/hd6.jpg" alt="veterinaria" width={100} height={100} className='imagenVeterinaria scale-100 rounded-full m-auto' />
          </div>
          <h3 className='textoVeterinaria text-xl sm:text-3xl font-bold text-violet-700 mt-5 mb-4'>Peluquería</h3>
          <div className='flex flex-col items-center'>
            <p className='text-base sm:text-lg text-gray-700 mb-4 text-white'>
              Ofrecemos una amplia gama de servicios de peluquería canina, que van desde el baño básico hasta el corte especializado. Todos nuestros servicios incluyen el traslado a domicilio, brindando comodidad y calidad para su mascota.
            </p>
            <Link href='/HomeCliente/Acciones/turneroPeluqueria' className='botonVeterinaria text-center bg-blue-500 text-white w-full p-2 border-2 border-cyan-100 rounded-lg mt-6'>Reservar</Link>
          </div>
        </div>
{/* 
        <div className='flex flex-col items-center p-5 sm:p-10 border w-full sm:w-1/2 md:w-1/3 border-cyan-100 rounded-lg'>
          <h3 className='textoVeterinaria text-xl sm:text-3xl font-bold text-cyan-500 mt-5 mb-4'>Vacunación</h3>
          <div className='w-32 sm:w-40 md:w-auto mb-4 rounded-full overflow-hidden'>
            <Image src="/hd7.jpg" alt="veterinaria" width={100} height={100} className='imagenVeterinaria scale-100' />
          </div>
          <div className='flex flex-col items-center'>
            <p className='text-base sm:text-lg text-gray-700 mb-4'>
              Mantenga a su mascota protegida contra enfermedades con nuestro servicio de vacunación. Ofrecemos un calendario de vacunación personalizado y enviamos recordatorios para garantizar que su mascota esté siempre al día con sus vacunas.
            </p>
            <Link href='/contacto' className='botonVeterinaria bg-blue-500 text-white w-full p-2 border-2 border-cyan-100 rounded-lg'>Reservar</Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}
