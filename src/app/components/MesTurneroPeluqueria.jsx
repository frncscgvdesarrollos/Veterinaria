'use client';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MascotasContext } from '../context/MascotaContext';
import { UserAuth } from '../context/AuthContext';
import { UseClient } from '../context/ClientContext';
import { postTurnoPeluqueria, sumarTurnoPeluqueria, getLastTurnoPeluqueriaId, verificarCapacidadTurno, obtenerPrecioPorServicioYTamaño } from '../firebase';
import ProductX from './ProductX.jsx';

export default function MyCalendarPeluqueria() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const { datosCliente } = UseClient();
  const { mascota } = MascotasContext();
  const [verificado, setVerificado] = useState(false);
  const [turnoDisponible, setTurnoDisponible] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    estadoDelTurno: 'confirmar',
    usuarioid: uid,
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

  useEffect(() => {
    if (datosCliente) {
      const { nombre, apellido, direccion, telefono } = datosCliente;
      setFormData((prevData) => ({
        ...prevData,
        nombre: nombre || '',
        apellido: apellido || '',
        direccion: direccion || '',
        telefono: telefono || '',
      }));
    }
  }, [datosCliente]);

  const handleDateChange = (newDate) => {
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getTime() + (20 * 24 * 60 * 60 * 1000));
    if (newDate < currentDate || newDate > maxDate) {
      alert('Solo puedes seleccionar fechas hasta 20 días en el futuro a partir de la fecha actual.');
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      selectedDate: newDate,
    }));
  };

  const handleVerificarClick = () => {
    const emptyFields = Object.values(formData).filter(
      (value) => value === ''
    ).length;
  
    if (emptyFields > 0) {
      alert('Por favor completa todos los campos.');
      return;
    }
  
    verificarCapacidadTurno(formData.selectedDate, formData.selectedTurno)
      .then((disponible) => {
        setTurnoDisponible(disponible);
        if (!disponible) {
          alert('No hay turnos disponibles para esa fecha y turno.');
          throw new Error('No hay turnos disponibles');
        }
  
        // Después de verificar, marcamos el turno como verificado
        setVerificado(true);
        alert('Turno verificado correctamente. Ya puede efectuar el pago.');
      })
      .catch((error) => {
        console.error('Error al verificar la disponibilidad del turno:', error);
        alert('Hubo un error al verificar la disponibilidad del turno. Por favor, inténtalo de nuevo.');
      });
  };
  

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    Promise.all([postTurnoPeluqueria(formData), sumarTurnoPeluqueria(uid)])
      .then(() => {
        alert('Turno registrado correctamente.');
      })
      .catch((error) => {
        console.error('Error al registrar el turno:', error);
        alert('Hubo un error al registrar el turno. Por favor, inténtalo de nuevo.');
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
  
    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        [name]: newValue,
      };
  
      if (name === 'selectedPet') {
        const selectedPet = mascota.find((pet) => pet.nombre === value);
        if (selectedPet) {
          updatedFormData.tamaño = selectedPet.tamaño;
        }
      }
  
      // Obtener el ID del turno
      if (!updatedFormData.id) {
        getLastTurnoPeluqueriaId()
          .then((idTurno) => {
            updatedFormData.id = idTurno;
            setFormData(updatedFormData);
          })
          .catch((error) => {
            console.error('Error al obtener el ID del turno:', error);
            alert('Hubo un error al obtener el ID del turno. Por favor, inténtalo de nuevo.');
          });
      }
  
      if (updatedFormData.selectedPet && updatedFormData.selectedServicio && !updatedFormData.precio) {
        obtenerPrecioPorServicioYTamaño(updatedFormData.selectedServicio, updatedFormData.tamaño)
          .then((precioSeleccionado) => {
            updatedFormData.precio = precioSeleccionado;
            setFormData(updatedFormData);
          })
          .catch((error) => {
            console.error('Error al obtener el precio del servicio:', error);
            alert('Hubo un error al obtener el precio del servicio. Por favor, inténtalo de nuevo.');
          });
      }
  
      return updatedFormData;
    });
  };
  

  const tileDisabled = ({ date, view }) => {
    const currentDate = new Date();
    return view === 'month' && (date.getDay() === 0 || date.getDay() === 6 || date < currentDate);
  };

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
                mascota.map((mascotaItem, index) => (
                  <option key={index} value={mascotaItem.nombre}>
                    {mascotaItem.nombre}
                  </option>
                ))}
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
              <option value="BañoCorteHigienicoCorte">Baño/corte higiénico/corte a tijera</option>
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
            onClick={() => handleVerificarClick()}
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
