import React from 'react'

export default function Terminoslayout({ children }) {
  return (
    <div>
          <div className=' width-full bg-gray-800'>
        <h1 className='text-4xl p-10  text-center text-white'>Completa los siguientes pasos</h1>
        <div className=' width-full flex justify-space-around p-10  text-white'>
            <h2 className='text-3xl borde-pasos p-8 bg-gray-800 '>1</h2>
            <h2 className='text-3xl borde-pasos p-8 bg-gray-800'>2</h2>
            <h3 className='text-3xl borde-pasos p-8 bg-gray-500'>3</h3>
        </div>
        <hr className='w-full bg-gray-400 h-5 hr-position'></hr>
    </div>
      {children}
    </div>
  )
}
