'use client'
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MascotasContext } from '../context/MascotaContext';
import { UserAuth } from '../context/AuthContext';
import { postTurnoChekeo } from '../firebase';

const MyCalendar = () => {
  const { user } = UserAuth();
  const { mascota } = MascotasContext();
  const userId = user?.uid;

  const [formData, setFormData] = useState({
    selectedPet: '',
    selectedTime: '9:00',
    selectedLocation: 'domicilio',
    selectedDate: new Date(),
    needPickup: false,
    usuarioId: userId
  });

  useEffect(() => {
    if (mascota && mascota.length > 0) {
      const userPets = mascota.find(pet => pet.uid === userId);
      if (userPets && userPets.mascotas && userPets.mascotas.length > 0) {
        setFormData(prevData => ({
          ...prevData,
          selectedPet: userPets.mascotas[0].nombre
        }));
      }
    }
  }, [mascota, userId]);

  const handleDateChange = newDate => {
    setFormData(prevData => ({
      ...prevData,
      selectedDate: newDate
    }));
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    postTurnoChekeo(formData);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));
  };

  const tileDisabled = ({ date, view }) => {
    const currentDate = new Date();
    return view === 'month' && (date.getDay() === 0 || date.getDay() === 6 || date < currentDate);
  };
  

  return (
    <div className="container mx-auto p-4 lg:p-10 bg-gray-100">
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="selectedPet">Seleccione la mascota que necesita atención:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            name="selectedPet"
            id="selectedPet"
            onChange={handleChange}
            value={formData.selectedPet}
          >
            {mascota && mascota.length > 0 && mascota.map((mascotaItem, index) => (
              <option key={mascotaItem.id} value={mascotaItem.nombre}>
                {mascotaItem.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <p className="mb-2 sm:mb-0">
            Recuerde que el horario que está solicitando es estipulativo y sujeto a confirmación.
          </p>
          <select
            className="w-full sm:w-1/4 p-2 border border-gray-300 rounded-md mb-2 sm:mb-0"
            name="selectedTime"
            onChange={handleChange}
            value={formData.selectedTime}
          >
            {[...Array(10).keys()].map(hour => (
              <option key={hour + 9} value={`${hour + 9}:00`}>
                {`${hour + 9}:00 AM`}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <p>
            Puede recibir su consulta:
          </p>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            name="selectedLocation"
            onChange={handleChange}
            value={formData.selectedLocation}
          >
            <option value="domicilio">A domicilio</option>
            <option value="veterinaria">En la veterinaria</option>
          </select>
        </div>
        {formData.selectedLocation === 'veterinaria' && (
          <div className="flex flex-row justify-between mb-4">
            <label htmlFor="needPickup">¿Necesita que la busquen y la devuelvan?</label>
            <input
              type="checkbox"
              id="needPickup"
              name="needPickup"
              checked={formData.needPickup}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="mb-4">
          <Calendar
            className="mx-auto border border-gray-300 rounded-md"
            locale="es"
            onChange={handleDateChange}
            value={formData.selectedDate}
            tileDisabled={tileDisabled}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full"
        >
          Verificar turno
        </button>
      </form>
    </div>
  );
}

export default MyCalendar;
