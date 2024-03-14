import MisDatos from '@/app/components/MisDatos'
import React from 'react'

export default function perfil() {
  return (
        <div className='flex flex-col sm:flex-row sm:items-center m-auto p-6'>
        <MisDatos/>
        <div className='flex w-full h-screen flex-col rounded-lg bg-white p-6 lg:w-1/3  sm:w-full'>
              <h1 className='text-center text-2xl'>Obtenga los beneficios de SuperVet.</h1>
            <div className='text-center bg-gray-700 p-2 text-yellow-300 rounded-lg mt-5 p-6'>
                <p>Con el plan anual de obtendras un 30% de descuentos en todos los servicios.</p>
                      <hr></hr>
            </div>
            <ul className='text-lg text-left w-full text-2xl'>
              <p className='font-bold mt-5 mb-2'>Beneficios de descuento en:</p> 
                  <li className='mt-2 mb-2 text-1xl'>
                      Traslados.
                  </li>
                  <li className='mt-2 mb-2'>
                      Servicio de Peluqueria.
                  </li>
                  <li className='mt-2 mb-2'>
                      Consultas.
                  </li>
                  <li className='mt-2 mb-2'>
                    Guarderia.
                  </li>
            </ul>
            <button className='bg-yellow-300 p-4 rounded-lg mt-auto text-white text-2xl m-auto'>Obtener SuperVet</button>
          </div>
        </div>
  )
}

