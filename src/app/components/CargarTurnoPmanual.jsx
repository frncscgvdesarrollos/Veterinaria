'use client'
import React, { useState } from 'react';
import { postTurnoPeluqueria } from '../firebase';
import { redirect } from 'next/navigation';

export default function CargarTurnoPmanual() {
  const [formData, setFormData] = useState({
    id: "turno admin",
    estadoDelTurno: 'confirmar',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    selectedDate: new Date().toISOString().split('T')[0], // Inicializar con fecha como string
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
    // Para el campo de fecha, parsea el valor de la cadena a una instancia de fecha
    if (name === 'selectedDate') {
      setFormData({
        ...formData,
        [name]: new Date(value).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postTurnoPeluqueria(formData);
    console.log(formData);
    setFormData({
      id: "turno admin",
      estadoDelTurno: 'confirmar',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      selectedDate: new Date().toISOString().split('T')[0], // Resetea la fecha al día actual después de enviar
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

        <div className="mb-4">
          <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700">Fecha del Turno</label>
          <input type="date" id="selectedDate" name="selectedDate" min={new Date().toISOString().split('T')[0]} max={new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} value={formData.selectedDate} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>

        <div className="mb-4">
          <label htmlFor="selectedPet" className="block text-sm font-medium text-gray-700">Mascota</label>
          <input type="text" id="selectedPet" name="selectedPet" value={formData.selectedPet} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>

        <div className="mb-4">
          <label htmlFor="selectedServicio" className="block text-sm font-medium text-gray-700">Servicio</label>
          <select id="selectedServicio" name="selectedServicio" value={formData.selectedServicio} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="">Seleccionar Servicio</option>
            <option value="baño corte higienico">Baño corte higienico</option>
            <option value="baño corte higienico cepillado">Baño corte higienico cepillado</option>
            <option value="baño corte higienico pelar">Baño corte higienico pelar</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="tamaño" className="block text-sm font-medium text-gray-700">Tamaño</label>
          <select id="tamaño" name="tamaño" value={formData.tamaño} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="">Seleccionar Tamaño</option>
            <option value="toy">Toy</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
            <option value="gigante">Gigante</option>
          </select>
        </div>

        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300">Guardar Turno</button>
      </form>
    </div>
  );
}
