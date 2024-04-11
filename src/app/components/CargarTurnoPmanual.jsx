import React, { useState, useEffect } from 'react';
import { postTurnoPeluqueria, getClientes, getMascotas } from '../firebase';
import { redirect } from 'next/navigation';

export default function CargarTurnoPmanual() {
  const [formData, setFormData] = useState({
    id: "turno admin",
    estadoDelTurno: 'confirmar',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    selectedDate: new Date().toISOString().split('T')[0],
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

  const [clientes, setClientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExistingClient, setIsExistingClient] = useState(false);

  useEffect(() => {
    getClientes()
      .then((listaClientes) => {
        setClientes(listaClientes);
      })
      .catch((error) => {
        console.error('Error al obtener clientes:', error);
      });
  }, []);

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
    setFormData({ ...formData, selectedDate: new Date().toISOString().split('T')[0] });
    redirect('/HomeMaga/turnosPeluqueria');
  };

  const handleClientSelection = (nombre) => {
    const selectedClient = clientes.find(cliente => `${cliente.nombre} ${cliente.apellido}` === nombre);
    
    const uid = selectedClient?.usuarioid;
    console.log(uid)
    if (uid) {
      getMascotas(uid)
        .then((clientMascotas) => {
          console.log(clientMascotas)
          setMascotas(clientMascotas);
          setFormData({
            ...formData,
            nombre: selectedClient.nombre,
            apellido: selectedClient.apellido,
            direccion: selectedClient.direccion,
            telefono: selectedClient.telefono,
          });
          setIsExistingClient(true);
        })
        .catch((error) => {
          console.error('Error al obtener mascotas:', error);
        });
    }
  };
  
  
  const handlePetSelection = (petId) => {
    const selectedPet = mascotas.find(mascota => mascota.id === petId);
    setFormData({
      ...formData,
      selectedPet: selectedPet.nombre,
      tamaño: selectedPet.tamaño,
    });
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md ">
      <h1 className="text-2xl font-bold mb-4">Cargar Turno</h1>
      {!isExistingClient && (
        <div className='p-2'>
          <h2 className='text-center p-2 my-2 text-lg font-bold'>¿Está registrado como cliente?</h2>
          <div className='flex justify-around'>
          <button className="bg-blue-500 w-1/2 text-white p-2 mx-2 rounded-lg"onClick={() => setIsExistingClient(true)}>Sí</button>
          <button className="bg-red-500 w-1/2 text-white p-2 mx-2 rounded-lg"onClick={() => setIsExistingClient(false)}>No</button>
          </div>
        </div>
      )}

      {isExistingClient && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="selectedClient" className="block text-sm font-medium text-gray-700">Cliente</label>
            <select id="selectedClient" name="selectedClient" onChange={(e) => handleClientSelection(e.target.value)} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="">Seleccionar Cliente</option>
              {filteredClientes.map((cliente,index) => (
                <option key={index} value={`${cliente.nombre} ${cliente.apellido}`}>{cliente.nombre} {cliente.apellido}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="selectedPet" className="block text-sm font-medium text-gray-700">Mascota</label>
            <select id="selectedPet" name="selectedPet" value={formData.selectedPet} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="">Seleccionar Mascota</option>
              {mascotas.map((mascota, index) => (
                <option key={index} value={mascota.id} onClick={() => handlePetSelection(mascota.id)}>{mascota.nombre}</option>
              ))}
            </select>
          </div>

          {/* Agregar campos de turno y día para clientes existentes */}
          <div className="mb-4">
            <label htmlFor="selectedTurno" className="block text-sm font-medium text-gray-700">Turno</label>
            <input
              type="text"
              id="selectedTurno"
              name="selectedTurno"
              value={formData.selectedTurno}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700">Fecha del Turno</label>
            <input
              type="date"
              id="selectedDate"
              name="selectedDate"
              min={new Date().toISOString().split('T')[0]}
              max={new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              value={formData.selectedDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300">Guardar Turno</button>
          <button onClick={() => setIsExistingClient(false)} className="bg-red-500 m-4 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Cancelar</button>
        </form>
      )}

      {!isExistingClient && (
        <form onSubmit={handleSubmit}>
          {/* Formulario para clientes no registrados */}
          {/* (tu código existente para clientes no registrados) */}
        </form>
      )}
    </div>
  );
}
