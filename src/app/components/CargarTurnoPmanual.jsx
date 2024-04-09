import React, { useState, useEffect } from 'react';
import { postTurnoPeluqueria, getClientes as obtenerClientesDeLaBaseDeDatos } from '../firebase';
import { redirect } from 'next/navigation';

// Función que representa tu componente
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isExistingClient, setIsExistingClient] = useState(false); // Nuevo estado para indicar si es un cliente existente

  useEffect(() => {
    const fetchClientes = async () => {
      const listaClientes = await obtenerClientesDeLaBaseDeDatos(); // Obtener datos de clientes desde Firebase
      setClientes(listaClientes);
    };

    fetchClientes();
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

  const handleClientSelection = (clientId) => {
    // Precargar los datos del cliente seleccionado en el formulario
    const selectedClient = clientes.find(cliente => cliente.id === clientId);
    setFormData({
      ...formData,
      nombre: selectedClient.nombre,
      apellido: selectedClient.apellido,
      direccion: selectedClient.direccion,
      telefono: selectedClient.telefono,
    });
    setIsExistingClient(true); // Establecer que es un cliente existente
  };

  const handlePetSelection = (petId) => {
    // Precargar los datos de la mascota seleccionada en el formulario
    const selectedPet = clientes.flatMap(cliente => cliente.mascotas).find(mascota => mascota.id === petId);
    setFormData({
      ...formData,
      selectedPet: selectedPet.nombre,
      tamaño: selectedPet.tamaño,
    });
  };

  // Filtrar clientes basados en la búsqueda
  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-6 mt-20 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Cargar Turno</h1>
      <form onSubmit={handleSubmit}>
        {!isExistingClient && ( // Renderizar formulario manual si no es un cliente existente
          <>
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
          </>
        )}

        {isExistingClient && ( // Renderizar campos precargados si es un cliente existente
          <>
            <div className="mb-4">
              <label htmlFor="selectedPet" className="block text-sm font-medium text-gray-700">Mascota</label>
              <select id="selectedPet" name="selectedPet" value={formData.selectedPet} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="">Seleccionar Mascota</option>
                {clientes.flatMap(cliente => cliente.mascotas).map(mascota => (
                  <option key={mascota.id} value={mascota.id} onClick={() => handlePetSelection(mascota.id)}>{mascota.nombre}</option>
                ))}
              </select>
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
          </>
        )}

        <div className="mb-4">
          <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700">Fecha del Turno</label>
          <input type="date" id="selectedDate" name="selectedDate" min={new Date().toISOString().split('T')[0]} max={new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} value={formData.selectedDate} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>

        <div className="mb-4">
          <label htmlFor="transporte" className="block text-sm font-medium text-gray-700">Transporte</label>
          <input type="checkbox" id="transporte" name="transporte" checked={formData.transporte} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>

        <div className="mb-4">
          <label htmlFor="pago" className="block text-sm font-medium text-gray-700">Pago</label>
          <input type="checkbox" id="pago" name="pago" checked={formData.pago} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>

        <div className="mb-4">
          <label htmlFor="info" className="block text-sm font-medium text-gray-700">Información Adicional</label>
          <textarea id="info" name="info" value={formData.info} onChange={handleChange} rows="3" className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        </div>

        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300">Guardar Turno</button>
      </form>
    </div>
  );

}
