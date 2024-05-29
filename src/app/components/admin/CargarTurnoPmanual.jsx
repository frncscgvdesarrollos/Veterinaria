'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { 
  postTurnoPeluqueria, 
  getClientes, 
  getMascotas, 
  getLastTurnoPeluqueriaId, 
  obtenerPrecioPorServicioYTamaño, 
  verificarCapacidadTurno, 
  borrarTodosLosTurnos, 
  registroVentaPeluqueria, 
  idVentas, 
  sumarTurnoPeluqueria, 
  sumarTurnoPeluqueriaMascota 
} from '../../firebase';

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
    transporte: false,
    pago: false,
    precio: 0,
    info: '',
    canilPeluqueria: 0,
    uid: '',
  });

  const [formDataNoEsCliente, setFormDataNoEsCliente] = useState({
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
    uid: 'noescliente',
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
  }, [updateVenta]);

  const updateVenta = useCallback(() => {
    setVenta((prevVenta) => ({
      ...prevVenta,
      precio: isExistingClient ? formData.precio : formDataNoEsCliente.precio,
      nombre: isExistingClient ? formData.nombre : formDataNoEsCliente.nombre,
      apellido: isExistingClient ? formData.apellido : formDataNoEsCliente.apellido,
      direccion: isExistingClient ? formData.direccion : formDataNoEsCliente.direccion,
      telefono: isExistingClient ? formData.telefono : formDataNoEsCliente.telefono,
      productoOservicio: isExistingClient ? formData.selectedServicio : formDataNoEsCliente.selectedServicio,
      fecha_turno: isExistingClient ? formData.selectedDate : formDataNoEsCliente.selectedDate,
    }));
  }, [formData, formDataNoEsCliente, isExistingClient]);

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
          setFormDataNoEsCliente(prevData => ({ ...prevData, id: ultimoTurnoId }));
        })
        .catch(error => {
          console.error('Error al obtener el último ID de turno:', error);
        });
    };
    fetchUltimoTurnoId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updater = isExistingClient ? setFormData : setFormDataNoEsCliente;
    updater(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Actualizar la venta
    setVenta(prevVenta => ({
      ...prevVenta,
      [name]: value
    }));

    if (name === 'selectedPet') {
      const selectedPet = mascotas.find((pet) => pet.nombre === value);
      if (selectedPet) {
        updater(prevData => ({
          ...prevData,
          tamaño: selectedPet.tamaño,
        }));
      }
    }

    if (name === 'selectedServicio' && (isExistingClient ? formData.tamaño : formDataNoEsCliente.tamaño) !== '') {
      obtenerPrecioPorServicioYTamaño(value, isExistingClient ? formData.tamaño : formDataNoEsCliente.tamaño)
        .then((precio) => {
          console.log('Precio del servicio y tamaño:', precio);
          updater(prevData => ({
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
          setFormData(prevData => ({
            ...prevData,
            nombre: selectedClient.nombre,
            apellido: selectedClient.apellido,
            direccion: selectedClient.direccion,
            telefono: selectedClient.telefono,
            uid: selectedClient.usuarioid
          }));

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

    const currentFormData = isExistingClient ? formData : formDataNoEsCliente;

    if (!currentFormData.uid || !currentFormData.selectedPet) {
      alert('UID o nombre de la mascota no proporcionado');
      return;
    }

    const selectedClient = clientes.find(cliente => `${cliente.nombre} ${cliente.apellido}` === `${currentFormData.nombre} ${currentFormData.apellido}`);
    const uid = selectedClient?.usuarioid;

    verificarCapacidadTurno(currentFormData.selectedDate, currentFormData.selectedTurno)
      .then(capacidadTurno => {
        if (!capacidadTurno) {
          alert('La capacidad para este turno está completa. Por favor, elige otro horario.');
          return;
        }
        return Promise.all([
          sumarTurnoPeluqueriaMascota(uid, currentFormData.selectedPet),
          sumarTurnoPeluqueria(uid)
        ]);
      })
      .then(() => postTurnoPeluqueria(currentFormData))
      .then(() => {
        alert('Turno registrado correctamente.');

        const ventaData = {
          enCurso: false,
          id: venta.id,
          userId: currentFormData.uid,
          createdAt: new Date(),
          nombre: currentFormData.nombre,
          apellido: currentFormData.apellido,
          direccion: currentFormData.direccion,
          telefono: currentFormData.telefono,
          precio: currentFormData.precio,
          productoOservicio: currentFormData.selectedServicio,
          categoria: "peluqueria",
          fecha_turno: currentFormData.selectedDate,
          efectivo: true,
          mp: false,
          confirmado: false,
        };

        if (!currentFormData.uid) {
          ventaData.userId = '';
        }

        return registroVentaPeluqueria(ventaData);
      })
      .then(() => {
        alert('Venta registrada correctamente.');
        // Aquí, puedes manejar la limpieza de los datos del formulario si es necesario
      })
      .catch(error => {
        console.error('Error al registrar turno:', error);
        alert('Ocurrió un error al registrar el turno. Por favor, intenta de nuevo.');
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClientes = clientes.filter(cliente =>
    `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Cargar Turno Peluquería Manualmente</h1>
      <div>
        <label>
          Buscar Cliente:
          <input type="text" value={searchQuery} onChange={handleSearch} />
        </label>
        <ul>
          {filteredClientes.map(cliente => (
            <li key={cliente.usuarioid} onClick={() => handleClientSelection(`${cliente.nombre} ${cliente.apellido}`)}>
              {cliente.nombre} {cliente.apellido}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre:
            <input type="text" name="nombre" value={isExistingClient ? formData.nombre : formDataNoEsCliente.nombre} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Apellido:
            <input type="text" name="apellido" value={isExistingClient ? formData.apellido : formDataNoEsCliente.apellido} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Dirección:
            <input type="text" name="direccion" value={isExistingClient ? formData.direccion : formDataNoEsCliente.direccion} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Teléfono:
            <input type="text" name="telefono" value={isExistingClient ? formData.telefono : formDataNoEsCliente.telefono} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Fecha:
            <Calendar onChange={(date) => handleChange({ target: { name: 'selectedDate', value: date } })} value={isExistingClient ? formData.selectedDate : formDataNoEsCliente.selectedDate} />
          </label>
        </div>
        <div>
          <label>
            Turno:
            <select name="selectedTurno" value={isExistingClient ? formData.selectedTurno : formDataNoEsCliente.selectedTurno} onChange={handleChange} required>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </label>
        </div>
        {isExistingClient ? (
          <div>
            <label>
              Mascota:
              <select name="selectedPet" value={formData.selectedPet} onChange={handleChange} required>
                <option value="">Selecciona una mascota</option>
                {mascotas.map((mascota, index) => (
                  <option key={index} value={mascota.nombre}>{mascota.nombre}</option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div>
            <label>
              Mascota:
              <input type="text" name="selectedPet" value={formDataNoEsCliente.selectedPet} onChange={handleChange} required />
            </label>
          </div>
        )}
        <div>
          <label>
            Servicio:
            <select name="selectedServicio" value={isExistingClient ? formData.selectedServicio : formDataNoEsCliente.selectedServicio} onChange={handleChange} required>
              <option value="">Selecciona un servicio</option>
              <option value="baño">Baño</option>
              <option value="corte">Corte</option>
              <option value="baño y corte">Baño y Corte</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Tamaño:
            <input type="text" name="tamaño" value={isExistingClient ? formData.tamaño : formDataNoEsCliente.tamaño} onChange={handleChange} readOnly />
          </label>
        </div>
        <div>
          <label>
            Transporte:
            <input type="checkbox" name="transporte" checked={isExistingClient ? formData.transporte : formDataNoEsCliente.transporte} onChange={(e) => handleChange({ target: { name: 'transporte', value: e.target.checked } })} />
          </label>
        </div>
        <div>
          <label>
            Pago:
            <input type="checkbox" name="pago" checked={isExistingClient ? formData.pago : formDataNoEsCliente.pago} onChange={(e) => handleChange({ target: { name: 'pago', value: e.target.checked } })} />
          </label>
        </div>
        <div>
          <label>
            Precio:
            <input type="text" name="precio" value={isExistingClient ? formData.precio : formDataNoEsCliente.precio} onChange={handleChange} readOnly />
          </label>
        </div>
        <div>
          <label>
            Información adicional:
            <textarea name="info" value={isExistingClient ? formData.info : formDataNoEsCliente.info} onChange={handleChange} />
          </label>
        </div>
        <button type="submit">Registrar Turno</button>
      </form>
    </div>
  );
}
