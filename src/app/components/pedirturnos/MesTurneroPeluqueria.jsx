'use client'
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MascotasContext } from '../../context/MascotaContext';
import { UserAuth } from '../../context/AuthContext';
import { UseClient } from '../../context/ClientContext';
import { postTurnoPeluqueria, sumarTurnoPeluqueria, getLastTurnoPeluqueriaId, verificarCapacidadTurno, obtenerPrecioPorServicioYTamaño, sumarTurnoPeluqueriaMascota, registroVentaPeluqueria, idVentas } from '../../firebase';
import ProductX from '../mercadopago/ProductX.jsx';

export default function MyCalendarPeluqueria() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const { datosCliente } = UseClient();
  const { nombre, apellido, direccion, telefono } = datosCliente;
  const { mascota } = MascotasContext();
  const [verificado, setVerificado] = useState(false);
  const [idVenta, setIdVenta] = useState(0);

  const pedirId = new Promise(function (resolve, reject) {
    idVentas()
      .then(function (id) {
        resolve(id);
      })
      .catch(function (error) {
        reject(error);
      });
  });

  pedirId
    .then(function (id) {
      setIdVenta(id);
    })
    .catch(function (error) {
      console.error('Error al obtener el ID de ventas:', error);
      alert('Hubo un error al obtener el ID de ventas. Por favor, inténtalo de nuevo.');
    });

  const [formData, setFormData] = useState({
    id: 0,
    estadoDelTurno: 'confirmar',
    uid: uid,
    nombre: nombre || '',
    apellido: apellido || '',
    direccion: direccion || '',
    telefono: telefono || '',
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

  const [venta, setVenta] = useState({
    entrega: null,
    entregado: null,
    enCurso: true,
    id: idVenta,
    userId: uid,
    createdAt: new Date(),
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    precio: 0,
    productoOservicio: 'servicio',
    categoria: "peluqueria",
    fecha_turno: new Date(),
    efectivo: false,
    mp: false,
    confirmado: false,
    items: [],
  });

  useEffect(function () {
    if (datosCliente.length > 0) {
      const { nombre, apellido, direccion, telefono, usuarioid } = datosCliente;
      setFormData(function (prevData) {
        return {
          ...prevData,
          nombre: nombre || '',
          apellido: apellido || '',
          direccion: direccion || '',
          telefono: telefono || '',
          uid: usuarioid || '',
        };
      });
    }
  }, [datosCliente]);

  useEffect(function () {
    function fetchUltimoTurnoId() {
      getLastTurnoPeluqueriaId()
        .then(function (ultimoTurnoId) {
          setFormData(function (prevData) {
            return { ...prevData, id: ultimoTurnoId };
          });
        })
        .catch(function (error) {
          console.error('Error al obtener el último ID de turno:', error);
        });
    }
    fetchUltimoTurnoId();
  }, []);

  useEffect(() => {
    setVenta(prevVenta => ({
      ...prevVenta,
      precio: formData.precio,
      nombre: formData.nombre,
      apellido: formData.apellido,
      direccion: formData.direccion,
      telefono: formData.telefono,
      productoOservicio: formData.selectedServicio,
      fecha_turno: formData.selectedDate,
    }));
  }, [formData]);
  
  

  const handleChange = function (e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(function (prevData) {
      return {
        ...prevData,
        [name]: newValue,
      };
    });

    if (name === 'selectedPet') {
      const selectedPet = mascota.find(function (pet) {
        return pet.nombre === value;
      });
      if (selectedPet) {
        setFormData(function (prevData) {
          return {
            ...prevData,
            tamaño: selectedPet.tamaño,
          };
        });
      }
    }

    if (name === 'selectedServicio' && formData.tamaño !== '') {
      obtenerPrecioPorServicioYTamaño(value, formData.tamaño)
        .then(function (precio) {
          console.log('Precio del servicio y tamaño:', precio);
          setFormData(function (prevData) {
            return {
              ...prevData,
              precio: precio,
            };
          });
        })
        .catch(function (error) {
          console.error('Error al obtener el precio del servicio y tamaño:', error);
        });
    }
  };

  const handleFormSubmit = function (e) {
    e.preventDefault();

    registroVentaPeluqueria(venta)
      .then(function () {
        return Promise.all([
          postTurnoPeluqueria(formData),
          sumarTurnoPeluqueria(uid),
          sumarTurnoPeluqueriaMascota(uid, formData.selectedPet)
        ]);
      })
      .then(function () {
        // Lógica adicional después de postear el turno, si es necesaria
      })
      .catch(function (error) {
        console.error('Error al registrar el turno y la venta:', error);
        alert('Hubo un error al registrar el turno. Por favor, inténtalo de nuevo.');
      });
  };

  const handleDateChange = function (newDate) {
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getTime() + (20 * 24 * 60 * 60 * 1000));
    if (newDate < currentDate || newDate > maxDate) {
      alert('Solo puedes seleccionar fechas hasta 20 días en el futuro a partir de la fecha actual.');
      return;
    }
    setFormData(function (prevData) {
      return {
        ...prevData,
        selectedDate: newDate,
      };
    });
  };

  const handleVerificarClick = function () {
    getLastTurnoPeluqueriaId()
      .then(function (id) {
        const nuevoId = id !== 0 ? id + 1 : 1;
        setFormData(function (prevData) {
          return {
            ...prevData,
            id: nuevoId,
          };
        });
        const emptyFields = Object.values(formData).filter(function (value) {
          return value === '';
        }).length;
        if (emptyFields > 0) {
          alert('Por favor completa todos los campos.');
          return Promise.reject(new Error('Campos incompletos'));
        } else {
          return verificarCapacidadTurno(formData.selectedDate, formData.selectedTurno);
        }
      })
      .then(function (result) {
        if (!result) {
          alert('No hay turnos disponibles para esa fecha y turno.');
          return Promise.reject(new Error('No hay turnos disponibles'));
        }
        setVerificado(true);
        alert('Turno verificado correctamente. Ya puede efectuar el pago.');
      })
      .catch(function (error) {
        console.error('Error al registrar el turno:', error);
        alert('Hubo un error al registrar el turno. Por favor, inténtalo de nuevo.');
      });
  };

  const tileDisabled = function ({ date, view }) {
    const currentDate = new Date();
    return view === 'month' && (date.getDay() === 0 || date.getDay() === 6 || date < currentDate);
  };

  useEffect(function () {
    updateVenta();
  }, [formData.precio, formData.selectedDate]);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-xl mx-auto bg-gray-100 rounded-md p-6">
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="selectedPet" className="block font-semibold">Seleccione la mascota que necesita atención:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              name="selectedPet"
              id="selectedPet"
              onChange={handleChange}
              value={formData.selectedPet}
            >
              <option value={''}>Selecciona tu mascota</option>
              {mascota &&
                mascota.length > 0 &&
                mascota.map(function (mascotaItem, index) {
                  return (
                    <option key={index} value={mascotaItem.nombre}>
                      {mascotaItem.nombre}
                    </option>
                  );
                })}
            </select>
          </div>
          <div>
            <label htmlFor="selectedTurno" className="block font-semibold">Seleccione el turno:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              name="selectedTurno"
              id="selectedTurno"
              onChange={handleChange}
              value={formData.selectedTurno}
            >
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div>
            <label htmlFor="selectedServicio" className="block font-semibold">Seleccione el tipo de corte:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              name="selectedServicio"
              id="selectedServicio"
              onChange={handleChange}
              value={formData.selectedServicio}
            >
              <option value="BañoCorteHigienico">Baño/corte higiénico</option>
              <option value="BañoCorteHigienicoPelar">Baño/corte higiénico/pelar</option>
              <option value="BañoCorteHigienicoCepillado">Baño/corte higiénico/cepillado</option>
              <option value="BañoCorteHigienicoTijera">Baño/corte higiénico/corte a tijera</option>
            </select>
          </div>
          <div>
            <label htmlFor="info" className="block font-semibold">Información adicional:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              name="info"
              id="info"
              onChange={handleChange}
              value={formData.info}
              rows="4"
            ></textarea>
          </div>
          <div>
            <Calendar
              className="mx-auto border border-gray-300 rounded-md"
              locale="es"
              onChange={handleDateChange}
              value={formData.selectedDate}
              tileDisabled={tileDisabled}
            />
          </div>
          <button
            onClick={handleVerificarClick}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 mt-4 rounded-md"
          >
            Verificar Turno
          </button>
          {verificado ? (
            <ProductX formData={{ formData: formData }} />
          ) : null}
        </form>
      </div>
    </div>
  );
}
