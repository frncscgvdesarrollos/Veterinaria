'use client'
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { postTurnoPeluqueria, getClientes, getMascotas, getLastTurnoPeluqueriaId, obtenerPrecioPorServicioYTamaño, verificarCapacidadTurno ,borrarTodosLosTurnos } from '../../firebase';
import { redirect } from 'next/navigation';

export default function CargarTurnoPmanual() {
  const [formData, setFormData] = useState({
    id: "turnoManual",
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
    transporte: false,
    pago: false,
    precio: 0,
    info: '',
    canilPeluqueria: 0,
    uid:""
  });

  const [clientes, setClientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExistingClient, setIsExistingClient] = useState(null);

  function borrarHandle () {
    borrarTodosLosTurnos().then(() => {
      alert('Se han borrado todos los turnos');
    })
  }
  useEffect(() => {
    const fetchClientes = () => {
      getClientes()
        .then(listaClientes => {
          setClientes(listaClientes);
        })
        .catch(error => {
          console.error('Error al obtener clientes:', error);
        });
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

  const handleClientSelection = (nombre) => {
    const selectedClient = clientes.find(cliente => `${cliente.nombre} ${cliente.apellido}` === nombre);
    const uid = selectedClient?.usuarioid;
    if (uid) {
      getMascotas(uid)
        .then(clientMascotas => {
          setMascotas(clientMascotas);
          setFormData({
            ...formData,
            nombre: selectedClient.nombre,
            apellido: selectedClient.apellido,
            direccion: selectedClient.direccion,
            telefono: selectedClient.telefono,
            uid:selectedClient.usuarioid
          });
          setIsExistingClient(true);
        })
        .catch(error => {
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

  const handleServiceSelection = (e) => {
    const selectedServicio = e.target.value;
    const tamaño = formData.tamaño;
    if (!tamaño) {
      alert('Selecciona un tamaño válido para calcular el precio.');
      return;
    }
    obtenerPrecioPorServicioYTamaño(selectedServicio, tamaño)
      .then(precio => {
        setFormData({
          ...formData,
          selectedServicio,
          precio,
        });
      })
      .catch(error => {
        console.error('Error al obtener el precio del servicio:', error);
      });
  };

  const handleChangeInfo = (e) => {
    setFormData({
      ...formData,
      info: e.target.value
    });
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    return new Promise((resolve, reject) => {
      try {
        e.preventDefault();
        const selectedDate = new Date(formData.selectedDate);
        const selectedTurno = formData.selectedTurno;
  
        // Verificar capacidad del turno
        verificarCapacidadTurno(selectedDate, selectedTurno)
          .then(capacidadSuficiente => {
            console.log("¿Capacidad suficiente?", capacidadSuficiente);
            if (!capacidadSuficiente) {
              reject('La capacidad para este turno está excedida. Por favor, elige otra fecha u horario.');
              return;
            }
  
            // Configurar la hora del turno según el horario seleccionado
            if (selectedTurno === 'mañana') {
              selectedDate.setHours(10, 0, 0, 0); // Establecer la hora a las 10 de la mañana
            } else if (selectedTurno === 'tarde') {
              selectedDate.setHours(14, 0, 0, 0); // Establecer la hora a las 14 de la tarde
            }
  
            const currentDate = new Date();
            if (selectedDate < currentDate) {
              reject('No se pueden programar turnos en fechas pasadas.');
              return;
            }
  
            getLastTurnoPeluqueriaId()
              .then(ultimoId => {
                formData.id = ultimoId.toString();
                formData.selectedDate = selectedDate.toISOString().split('T')[0]; // Actualizar la fecha en el formData
                return postTurnoPeluqueria(formData);
              })
              .then(() => {
                setFormData({ ...formData, selectedDate: new Date() });
                resolve('¡El turno se guardó exitosamente!');
              })
              .catch(error => {
                console.error('Error al guardar el turno:', error);
                reject('Hubo un error al guardar el turno. Por favor, intenta de nuevo.');
              });
          })
          .catch(error => {
            console.error('Error al verificar capacidad del turno:', error);
            reject('Error al verificar la capacidad del turno.');
          });
      } catch (error) {
        console.error('Error en handleSubmit:', error);
        reject('Error inesperado al procesar el turno.');
      }
    });
  };
  

  const tileDisabled = ({ date }) => {
    const currentDate = new Date();
    return date.getDay() === 0 || date.getDay() === 6 || date < currentDate;
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-violet-200 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Cargar Turno</h1>
      <button className="bg-red-500 w-full text-white p-2 mx-2 rounded-lg" onClick={borrarHandle}>Borrar</button>
      {!isExistingClient && (
        <div className='p-2'>
          <h2 className='text-center p-2 my-2 text-lg font-bold'>¿Está registrado como cliente?</h2>
          <div className='flex justify-around'>
            <button className="bg-blue-500 w-1/2 text-white p-2 mx-2 rounded-lg" onClick={() => setIsExistingClient(true)}>Sí</button>
            <button className="bg-red-500 w-1/2 text-white p-2 mx-2 rounded-lg" onClick={() => setIsExistingClient(false)}>No</button>
          </div>
        </div>
      )}
  
      {isExistingClient && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="selectedClient" className="block text-sm font-medium text-gray-700">Cliente</label>
            <select id="selectedClient" name="selectedClient" onChange={(e) => handleClientSelection(e.target.value)} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="">Seleccionar Cliente</option>
              {filteredClientes.map((cliente, index) => (
                <option key={index} value={`${cliente.nombre} ${cliente.apellido}`}>{cliente.nombre} {cliente.apellido}</option>
              ))}
            </select>
          </div>
  
          <div className="mb-4">
            <label htmlFor="selectedPet" className="block text-sm font-medium text-gray-700">Mascota</label>
            <select id="selectedPet" name="selectedPet" value={formData.selectedPet} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="">Seleccionar Mascota</option>
              {mascotas.map((mascota, index) => (
                <option key={index} value={mascota.nombre} onClick={() => handlePetSelection(mascota.id)}>{mascota.nombre}</option>
              ))}
            </select>
          </div>
  

          <div className="mb-4">
            <label htmlFor="tamaño" className="block text-sm font-medium text-gray-700">Tamaño</label>
            <select
              id="tamaño"
              name="tamaño"
              value={formData.tamaño}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Seleccionar tamaño</option>
              <option value="toy">Toy</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
              <option value="gigante">Gigante</option>
            </select>
          </div>
  
          <div className="mb-4">
            <label htmlFor="selectedServicio" className="block text-sm font-medium text-gray-700">Servicio</label>
            <select
              id="selectedServicio"
              name="selectedServicio"
              value={formData.selectedServicio}
              onChange={handleServiceSelection}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Seleccionar Servicio</option>
              <option value="BañoCorteHigienico">Baño Cortehigiénico</option>
              <option value="BañoCorteHigienicoPelar">Baño Cortehigiénico + Pelar</option>
              <option value="BañoCorteHigienicoCepillado">Baño Cortehigiénico + Cepillado</option>
              <option value="BañoCorteHigienicoCorte">Baño Cortehigiénico + Corte</option>
            </select>
          </div>
  
          <div className="mb-4">
            <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700">Fecha del Turno</label>
            <Calendar
              id="selectedDate"
              onChange={date => setFormData({ ...formData, selectedDate: date })}
              value={formData.selectedDate}
              tileDisabled={tileDisabled}
              className="mt-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="selectedTurno" className="block text-sm font-medium text-gray-700">Turno</label>
            <select
              id="selectedTurno"
              name="selectedTurno"
              value={formData.selectedTurno}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="transporte" className="block text-sm font-medium text-gray-700">Transporte</label>
            <input
              type="checkbox"
              id="transporte"
              name="transporte"
              checked={formData.transporte}
              onChange={() => setFormData({ ...formData, transporte: !formData.transporte })}
              className="mt-1"
            />
          </div>
  
          <div className="mb-4">
            <label htmlFor="info" className="block text-sm font-medium text-gray-700">Información Adicional</label>
            <textarea
              id="info"
              name="info"
              value={formData.info}
              onChange={handleChangeInfo}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
  
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300">Guardar Turno</button>
          <button onClick={() => setIsExistingClient(null)} className="bg-red-500 m-4 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Cancelar</button>
        </form>
      )}
    </div>
  );
}
