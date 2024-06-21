'use client';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  postTurnoPeluqueria,
  getClientes,
  getMascotas,
  getLastTurnoPeluqueriaId,
  obtenerPrecioPorServicioYTamaño,
  verificarCapacidadTurno,
  registroVentaPeluqueria,
  idVentas,
  sumarTurnoPeluqueria,
  sumarTurnoPeluqueriaMascota,
} from '../../firebase';

export default function CargarTurnoPmanual() {
  const initialFormState = {
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
    uid: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formDataNoEsCliente, setFormDataNoEsCliente] = useState({
    ...initialFormState,
    uid: 'noescliente',
  });

  const [clientes, setClientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExistingClient, setIsExistingClient] = useState(null);
  const [tamañoOptions, setTamañoOptions] = useState([]);

  const [venta, setVenta] = useState({
    enCurso: false,
    id: 0,
    userid: '',
    createdAt: new Date(),
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    precio: 0,
    productoOservicio: '',
    categoria: 'peluqueria',
    fecha_turno: new Date(),
    efectivo: true,
    mp: false,
    confirmado: false,
  });

  useEffect(() => {
    idVentas()
      .then((nuevoId) => {
        setVenta((prevVenta) => ({ ...prevVenta, id: nuevoId }));
      })
      .catch((error) => {
        console.error('Error al obtener el ID de ventas:', error);
      });
  }, []);

  useEffect(() => {
    const fetchClientes = () => {
      getClientes()
        .then((listaClientes) => {
          setClientes(listaClientes);
        })
        .catch((error) => {
          console.error('Error al obtener clientes:', error);
        });
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchUltimoTurnoId = () => {
      getLastTurnoPeluqueriaId()
        .then((ultimoTurnoId) => {
          setFormData((prevData) => ({ ...prevData, id: ultimoTurnoId }));
          setFormDataNoEsCliente((prevData) => ({ ...prevData, id: ultimoTurnoId }));
        })
        .catch((error) => {
          console.error('Error al obtener el último ID de turno:', error);
        });
    };
    fetchUltimoTurnoId();
  }, []);

  useEffect(() => {
    // Configurar opciones de tamaño para clientes nuevos
    setTamañoOptions(['Toy', 'Mediano', 'Grande', 'Gigante']);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updater = isExistingClient ? setFormData : setFormDataNoEsCliente;
    const newValue = type === 'checkbox' ? checked : value;

    updater((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    if (name === 'selectedPet') {
      const selectedPet = mascotas.find((pet) => pet.nombre === value);
      if (selectedPet) {
        updater((prevData) => ({
          ...prevData,
          tamaño: selectedPet.tamaño,
        }));
      }
    }

    if (name === 'selectedServicio' && (isExistingClient ? formData.tamaño : formDataNoEsCliente.tamaño) !== '') {
      obtenerPrecioPorServicioYTamaño(value, isExistingClient ? formData.tamaño : formDataNoEsCliente.tamaño)
        .then((precio) => {
          console.log('Precio del servicio y tamaño:', precio);
          updater((prevData) => ({
            ...prevData,
            precio: precio,
          }));
        })
        .catch((error) => {
          console.error('Error al obtener el precio del servicio y tamaño:', error);
        });
    }
  };

  const handleClientSelection = (e) => {
    const selectedClientId = e.target.value;
    if (selectedClientId) {
      const selectedClient = clientes.find((cliente) => cliente.usuarioid === selectedClientId);
      if (selectedClient) {
        getMascotas(selectedClient.usuarioid)
          .then((clientMascotas) => {
            setMascotas(clientMascotas);
            setFormData((prevData) => ({
              ...prevData,
              nombre: selectedClient.nombre,
              apellido: selectedClient.apellido,
              direccion: selectedClient.direccion,
              telefono: selectedClient.telefono,
              uid: selectedClient.usuarioid,
            }));
            setVenta((prevVenta) => ({
              ...prevVenta,
              userId: selectedClient.usuarioid,
            }));
            setIsExistingClient(true);
          })
          .catch((error) => {
            console.error('Error al obtener mascotas:', error);
          });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentFormData = isExistingClient ? formData : formDataNoEsCliente;

    if (!currentFormData.uid || !currentFormData.selectedPet) {
      alert('UID o nombre de la mascota no proporcionado');
      return;
    }

    verificarCapacidadTurno(currentFormData.selectedDate, currentFormData.selectedTurno)
      .then((capacidadTurno) => {
        if (!capacidadTurno) {
          alert('La capacidad para este turno está completa. Por favor, elige otro horario.');
          throw new Error('Capacidad completa para este turno');
        }
        return Promise.all([
          sumarTurnoPeluqueriaMascota(currentFormData.uid, currentFormData.selectedPet),
          sumarTurnoPeluqueria(currentFormData.uid),
        ]);
      })
      .then(() => postTurnoPeluqueria(currentFormData))
      .then(() => {
        alert('Turno registrado correctamente.');
        const ventaData = {
          ...venta,
          userId: currentFormData.uid,
          nombre: currentFormData.nombre,
          apellido: currentFormData.apellido,
          direccion: currentFormData.direccion,
          telefono: currentFormData.telefono,
          precio: currentFormData.precio,
          productoOservicio: currentFormData.selectedServicio,
          fecha_turno: currentFormData.selectedDate,
        };
        return registroVentaPeluqueria(ventaData);
      })
      .then(() => {
        alert('Venta registrada correctamente.');
      })
      .catch((error) => {
        console.error('Error al registrar turno:', error);
        alert('Ocurrió un error al registrar el turno. Por favor, intenta de nuevo.');
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClientes = clientes.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cargar Turno Peluquería Manualmente</h1>
      <div className="mb-6">
        <select
          onChange={handleClientSelection}
          className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona un cliente</option>
          {filteredClientes.map((cliente) => (
            <option key={cliente.usuarioid} value={cliente.usuarioid}>
              {cliente.nombre} {cliente.apellido}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Nombre:
            <input
              type="text"
              name="nombre"
              value={isExistingClient ? formData.nombre : formDataNoEsCliente.nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Apellido:
            <input
              type="text"
              name="apellido"
              value={isExistingClient ? formData.apellido : formDataNoEsCliente.apellido}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Dirección:
            <input
              type="text"
              name="direccion"
              value={isExistingClient ? formData.direccion : formDataNoEsCliente.direccion}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Teléfono:
            <input
              type="text"
              name="telefono"
              value={isExistingClient ? formData.telefono : formDataNoEsCliente.telefono}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Fecha:
            <Calendar
              onChange={(date) => setFormData({ ...formData, selectedDate: date })}
              value={isExistingClient ? formData.selectedDate : formDataNoEsCliente.selectedDate}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm"
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Turno:
            <select
              name="selectedTurno"
              value={isExistingClient ? formData.selectedTurno : formDataNoEsCliente.selectedTurno}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </label>
        </div>
        {isExistingClient ? (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mascota:
              <select
                name="selectedPet"
                value={formData.selectedPet}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Selecciona una mascota</option>
                {mascotas.map((mascota, index) => (
                  <option key={index} value={mascota.nombre}>
                    {mascota.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mascota:
              <input
                type="text"
                name="selectedPet"
                value={formDataNoEsCliente.selectedPet}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
        )}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Servicio:
            <select
              name="selectedServicio"
              value={isExistingClient ? formData.selectedServicio : formDataNoEsCliente.selectedServicio}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Selecciona un servicio</option>
              <option value="BañoCorteHigienico">Baño y corte higiénico</option>
              <option value="BañoCorteHigienicoPelar">Baño y pelar </ option>
              <option value="BañoCorteHigienicoCepillado">Baño y cepillado </option>
              <option value="BañoCorteHigienicoCorte">Baño y corte especial</option>
            </select>
          </label>
        </div>
        {isExistingClient ? (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tamaño:
              <input
                type="text"
                name="tamaño"
                value={formData.tamaño}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tamaño:
              <select
                name="tamaño"
                value={formDataNoEsCliente.tamaño}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Selecciona un tamaño</option>
                {tamañoOptions.map((tamaño, index) => (
                  <option key={index} value={tamaño}>
                    {tamaño}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="transporte"
              checked={isExistingClient ? formData.transporte : formDataNoEsCliente.transporte}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-500 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2">Transporte</span>
          </label>
        </div>
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="pago"
              checked={isExistingClient ? formData.pago : formDataNoEsCliente.pago}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-500 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2">Pago</span>
          </label>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Precio:
            <input
              type="number"
              name="precio"
              value={isExistingClient ? formData.precio : formDataNoEsCliente.precio}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Información adicional:
            <textarea
              name="info"
              value={isExistingClient ? formData.info : formDataNoEsCliente.info}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            Registrar Turno
          </button>
        </div>
      </form>
    </div>
  );
}

