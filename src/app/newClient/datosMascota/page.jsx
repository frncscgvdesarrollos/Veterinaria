import React from 'react'
import FormMascota from '../components/FormMascota'

export default function DatosMascota() {
  return (
    <div className='bg-gray-800 h-auto p-5'>
        <h1 className='text-4xl text-center font-bold mt-5 mb-5 text-red-400 underline'>Informacion sobre tus mascotas </h1>
        <FormMascota/>
    </div>
  )
}
