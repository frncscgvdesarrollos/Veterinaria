import React from 'react'

export default function layoutPeluqueria({ children }) {
  return (
    <div className='flex flex-col bg-gray-500 text-center  '>
        <h1 className='text-white p-10 text-2xl'>Resever su turno para la Peluqueria</h1>
        <p className='text-white p-10 text-2xl'>Sume turnos y acceda a promociones!</p>
        {children}
    </div>
  )
}
