'use client';
import React, { useState } from 'react';
import { postTurnoPeluqueria } from '../firebase';
import {redirect} from 'next/navigation';

export default function CargarTurnoPmanual() {
  const [formData, setFormData] = useState({
    id: 0,
    estadoDelTurno: 'confirmar',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    selectedDate: new Date(),
    selectedTurno: 'mañana',
    selectedPet: '',
    selectedServicio: '',
    tamaño: '',
    transporte: true,
    pago: false,
    precio: 0,
    info: '',
    canilPeluqueria: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postTurnoPeluqueria(formData);
    // Aquí puedes enviar los datos del formulario, por ejemplo, a través de una función prop
    console.log(formData);
    // Limpia el formulario después de enviar los datos
    setFormData({
      id: "turno admin",
      estadoDelTurno: 'confirmar',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      selectedDate: new Date(),
      selectedTurno: 'mañana',
      selectedPet: '',
      selectedServicio: '',
      tamaño: '',
      transporte: true,
      pago: false,
      precio: 0,
      info: '',
      canilPeluqueria: 0,
    });
    redirect('/HomeMaga/turnosPeluqueria');
  };



  return (
    <div className="max-w-md mx-auto p-6 mt-20 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Cargar Turno</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        
        <div className="mb-4">
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
          <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>

        <div className="mb-4">
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
          <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>

        <div className="mb-4">
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>

        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300">Guardar Turno</button>
      </form>  
    </div>
  );
}
