'use client'
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { postTurnoPeluqueria, getClientes, getMascotas, getLastTurnoPeluqueriaId, obtenerPrecioPorServicioYTamaño, verificarCapacidadTurno, borrarTodosLosTurnos, registroVentaPeluqueria, idVentas, sumarTurnoPeluqueria, sumarTurnoPeluqueriaMascota } from '../../firebase';

export default function CargarTurnoPmanual() {
  const [formData, setFormData] = useState({
    id: 0,
    estadoDelTurno: 'confirmar',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    selectedDate: new Date(),
    selectedTurno: '',
    selectedPet: '',
    selectedServicio: '',
    tamaño: '',
    transporte: false,
    pago: false,
    precio: 0,
    info: '',
    canilPeluqueria: 0,
    uid: ''
  });

  const [clientes, setClientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExistingClient, setIsExistingClient] = useState(null);

  const [venta, setVenta] = useState({
    enCurso: false,
    id: 0,
    userId: '',
    createdAt: new Date(),
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    precio: 0,
    productoOservicio: '',
    categoria: "peluqueria",
    fecha_turno: new Date(),
    efectivo: true,
    mp: false,
    confirmado: false,
  });

  useEffect(() => {
    idVentas().then(nuevoId => {
      setVenta(prevVenta => ({ ...prevVenta, id: nuevoId }));
    }).catch(error => {
      console.error('Error al obtener el ID de ventas:', error);
    });
    updateVenta();
  }, [formData.precio, formData.selectedDate]);

  const updateVenta = () => {
    setVenta((prevVenta) => ({
      ...prevVenta,
      precio: formData.precio,
      nombre: formData.nombre,
      apellido: formData.apellido,
      direccion: formData.direccion,
      telefono: formData.telefono,
      productoOservicio: formData.selectedServicio,
      fecha_turno: formData.selectedDate,
    }));
  };

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

  useEffect(() => {
    const fetchUltimoTurnoId = () => {
      getLastTurnoPeluqueriaId()
        .then(ultimoTurnoId => {
          setFormData(prevData => ({ ...prevData, id: ultimoTurnoId }));
        })
        .catch(error => {
          console.error('Error al obtener el último ID de turno:', error);
        });
    };
    fetchUltimoTurnoId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Actualizar la venta
    setVenta({
      ...venta,
      [name]: value
    });

    if (name === 'selectedPet') {
      const selectedPet = mascotas.find((pet) => pet.nombre === value);
      if (selectedPet) {
        setFormData((prevData) => ({
          ...prevData,
          tamaño: selectedPet.tamaño,
        }));
      }
    }

    if (name === 'selectedServicio' && formData.tamaño !== '') {
      obtenerPrecioPorServicioYTamaño(value, formData.tamaño)
        .then((precio) => {
          console.log('Precio del servicio y tamaño:', precio);
          setFormData((prevData) => ({
            ...prevData,
            precio: precio,
          }));
        })
        .catch((error) => {
          console.error('Error al obtener el precio del servicio y tamaño:', error);
          // Manejar el error según sea necesario
        });
    }
  };

  const handleClientSelection = (nombre) => {
    const selectedClient = clientes.find(cliente => `${cliente.nombre} ${cliente.apellido}` === nombre);
    const uid = selectedClient?.usuarioid;
    if (uid) {
      getMascotas(uid)
        .then(clientMascotas => {
          // Establecer las mascotas en el estado
          setMascotas(clientMascotas);
          setFormData({
            ...formData,
            nombre: selectedClient.nombre,
            apellido: selectedClient.apellido,
            direccion: selectedClient.direccion,
            telefono: selectedClient.telefono,
            uid: selectedClient.usuarioid
          });

          // Actualizar userId en la venta
          setVenta(prevVenta => ({
            ...prevVenta,
            userId: uid
          }));

          setIsExistingClient(true);
        })
        .catch(error => {
          console.error('Error al obtener mascotas:', error);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.uid || !formData.selectedPet) {
      alert('UID o nombre de la mascota no proporcionado');
      return;
    }

    const selectedClient = clientes.find(cliente => `${cliente.nombre} ${cliente.apellido}` === `${formData.nombre} ${formData.apellido}`);
    const uid = selectedClient?.usuarioid;

    verificarCapacidadTurno(formData.selectedDate, formData.selectedTurno)
      .then(capacidadTurno => {
        if (!capacidadTurno) {
          alert('La capacidad para este turno está completa. Por favor, elige otro horario.');
          return;
        }
        return Promise.all([
          sumarTurnoPeluqueriaMascota(uid, formData.selectedPet),
          sumarTurnoPeluqueria(uid)
        ]);
      })
      .then(() => postTurnoPeluqueria(formData))
      .then(() => {
        alert('Turno registrado correctamente.');

        const ventaData = {
          enCurso: false,
          id: venta.id,
          userId: formData.uid,
          createdAt: new Date(),
          nombre: formData.nombre,
          apellido: formData.apellido,
          direccion: formData.direccion,
          telefono: formData.telefono,
          precio: formData.precio,
          productoOservicio: formData.selectedServicio,
          categoria: "peluqueria",
          fecha_turno: formData.selectedDate,
          efectivo: true,
          mp: false,
          confirmado: false,
        };

        if (!formData.uid) {
          ventaData.userId = '';
        }

        return registroVentaPeluqueria(ventaData);
      })
      .then(() => {
        alert('Venta registrada correctamente.');
      })
      .catch(error => {
        console.error('Error al registrar el turno o la venta:', error);
        alert('Hubo un error al registrar el turno o la venta. Por favor, inténtalo de nuevo.');
      });
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

  const tileDisabled = ({ date }) => {
    const currentDate = new Date();
    return date.getDay() === 0 || date.getDay() === 6 || date < currentDate;
  };

  const borrarHandle = () => {
    borrarTodosLosTurnos().then(() => {
      alert('Se han borrado todos los turnos');
    });
  };

  const limpiarFormulario = () => {
    setFormData({
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
      transporte: false,
      pago: false,
      precio: 0,
      info: '',
      canilPeluqueria: 0,
      uid: ''
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-violet-200 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Cargar Turno</h1>
      <button className="bg-red-500 w-full text-white p-2 mx-2 rounded-lg" onClick={borrarHandle}>Borrar</button>
      {isExistingClient === null && (
        <div className='p-2'>
          <h2 className='text-center p-2 my-2 text-lg font-bold'>¿Está registrado como cliente?</h2>
          <div className='flex justify-around'>
            <button className="bg-blue-500 w-1/2 text-white p-2 mx-2 rounded-lg" onClick={() => setIsExistingClient(true)}>Sí</button>
            <button className="bg-red-500 w-1/2 text-white p-2 mx-2 rounded-lg" onClick={() => setIsExistingClient(false)}>No</button>
          </div>
        </div>
      )}
      
      {isExistingClient === true && (
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
                <option key={index} value={mascota.nombre} onClick={() => handlePetSelection(mascota.id)}>
                  {mascota.nombre}
                </option>
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
          <button onClick={() => { setIsExistingClient(null); limpiarFormulario(); }} className="bg-red-500 m-4 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Cancelar</button>

        </form>
      )}

      {isExistingClient === false && (
        <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />

          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mt-4">Apellido</label>
          <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />

          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mt-4">Dirección</label>
          <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />

          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mt-4">Teléfono</label>
          <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />

          <div className="mb-4">
            <label htmlFor="selectedPet" className="block text-sm font-medium text-gray-700">Mascota</label>
            <input type='text' id="selectedPet" name="selectedPet" value={formData.selectedPet} onChange={handleChange} className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
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
          <button onClick={() => { setIsExistingClient(null); limpiarFormulario(); }} className="bg-red-500 m-4 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Cancelar</button>

        </div>
      </form>
      )}
    </div>
  );
}
