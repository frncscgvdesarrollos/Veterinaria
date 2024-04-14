import Image from 'next/image';
import Link from 'next/link';

export default function Veterinaria() {
  return (
    <div className='w-full sm:w-2/3 flex flex-col sm:flex-row items-center p-5 contenedorVeterinaria'>
      <div className='flex flex-col sm:flex-row justify-center gap-8 w-full'>
        <div className='flex flex-col items-center w-full sm:w-1/2 md:w-2/3 p-5 sm:p-10 border border-cyan-100 rounded-lg bg-violet-200'>
          <div className='w-32 sm:w-40 md:w-auto mb-4 rounded-full overflow-hidden'>
            <Image src="/hd8.jpg" alt="veterinaria" width={100} height={100} className='imagenVeterinaria scale-100 rounded-full m-auto' />
          </div>
          <h3 className='textoVeterinaria text-xl sm:text-3xl font-bold mt-5 mb-4 text-gray-800'>Chequeos</h3>
          <div className='flex flex-col items-center'>
            <p className='text-base sm:text-lg text-gray-800 font-semibold p-4 mb-4 '>
              Mantenga a su mascota sana realizando chequeos para prevenir enfermedades y garantizar su bienestar.
            </p>
            <Link href='/HomeCliente/Acciones/TurneroCheckeo' className='botonVeterinaria text-center bg-blue-500 text-center text-white w-full p-2 border-2 border-black rounded-lg mt-auto'>Reservar</Link>
          </div>
        </div>

        <div className='flex flex-col items-center p-5 sm:p-10 border w-full sm:w-1/2 md:w-2/3 border-cyan-100 rounded-lg bg-purple-200'>
          <div className='w-32 sm:w-40 md:w-auto mb-4 rounded-full overflow-hidden'>
            <Image src="/hd6.jpg" alt="veterinaria" width={100} height={100} className='imagenVeterinaria scale-100 rounded-full m-auto' />
          </div>
          <h3 className='textoVeterinaria text-xl sm:text-3xl font-bold text-gray-800 mt-5 mb-4'>Peluquería</h3>
          <div className='flex flex-col items-center'>
            <p className='text-base sm:text-lg text-gray-700 font-semibold mb-4 p-4'>
              Ofrecemos peluquería para sus mascotas. Trabajamos con traslados a domicilio, retiramos y devolvemos tu mascota.
            </p>
            <Link href='/HomeCliente/Acciones/turneroPeluqueria' className='botonVeterinaria text-center bg-blue-500 text-white w-full p-2 border-2 border-cyan-100 rounded-lg mt-auto'>Reservar</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
