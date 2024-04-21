import Image from 'next/image';
import Link from 'next/link';
import Productos from './Productos';

export default function Veterinaria() {
  return (
    <div>
      <div className='w-full sm:w-full flex flex-col sm:flex-row items-center gap-20  container-perspective relative mt-10  h-auto container mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between gap-8 w-full mx-auto container-perspective'>
          <div className='w-full sm:w-1/2 md:w-1/3 p-5 sm:p-10 border-4 border-violet-200 rounded-lg bg-pink-200 h-full bg-opacity-80 element2 ml-10'>
            <div className='w-full flex  sm:w-32 md:w-auto mb-2 rounded-full overflow-hidden mx-auto'>
              {/* <Image src="/hd8.jpg" alt="veterinaria" width={100} height={100} className='imagenVeterinaria scale-100 rounded-full mx-auto' /> */}
              <Image src="/vete2.jpg" alt="veterinaria" width={200} height={200} className=' scale-100 rounded-lg mx-auto mt-2' />
            </div>
            <h3 className='textoVeterinaria text-xl sm:text-3xl font-bold mt-5 mb-4 text-purple-800 text-center'>Chequeos</h3>
            <div className='flex flex-col items-center'>
              <p className='text-base sm:text-lg text-purple-800 font-semibold p-2 mb-2 text-center'>
                Mantenga a su mascota sana realizando chequeos para prevenir enfermedades y garantizar su bienestar.
              </p>
              <Link href='/HomeCliente/Acciones/TurneroCheckeo' className='botonVeterinaria text-center text-xl bg-purple-500 text-white w-2/3 p-2 border-2  rounded-lg'>Reservar</Link>
            </div>
          </div>
          <div className='w-full py-2 sm:w-1/2 md:w-1/3   border-4 border-blue-200 rounded-lg bg-purple-200 bg-opacity-80 mt-10 h-full '>
            <Image src="/vete3.jpg" alt="veterinaria" width={200} height={200} className='imagenVeterinaria scale-100 rounded-lg w-[70%] mx-auto mt-2' />
            <Image src="/vete4.jpg" alt="veterinaria" width={200} height={200} className='imagenVeterinaria scale-100 rounded-lg w-[70%] mx-auto mt-2' />
            </div>
          <div className='w-full sm:w-1/2 md:w-1/3 p-5 sm:p-10 border w-full border-4 border-blue-200 rounded-lg bg-cyan-200 bg-opacity-80 mt-20 h-full element mr-10'>
            <div className='w-full flex flex-col sm:w-32 md:w-auto mb-2 rounded-full overflow-hidden mx-auto'>
              {/* <Image src="/hd6.jpg" alt="veterinaria" width={100} height={100} className='imagenVeterinaria scale-100 rounded-full mx-auto' /> */}
              <Image src="/salchi2.jpg" alt="veterinaria" width={200} height={200} className=' scale-100 rounded-lg mx-auto mt-2' />
            </div>
            <h3 className='textoVeterinaria text-xl sm:text-3xl font-bold text-purple-800 mt-5 mb-4 text-center'>Peluquería</h3>
            <div className='flex flex-col items-center'>
              <p className='text-base sm:text-lg text-purple-700 font-semibold mb-2 p-2 text-center'>
                Ofrecemos peluquería para sus mascotas. Trabajamos con traslados a domicilio.
              </p>
              <Link href='/HomeCliente/Acciones/turneroPeluqueria' className='botonVeterinaria text-xl text-center bg-pink-500 text-white w-2/3 p-2 border-2 border-cyan-100 rounded-lg'>Reservar</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
