'use client';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MascotasContext } from '../context/MascotaContext';
import { UserAuth } from '../context/AuthContext';
import { postTurnoChekeo } from '../firebase';

const MyCalendar = () => {
  const { user } = UserAuth();
  const {mascota} = MascotasContext();
  const userId = user?.uid;
  console.log(mascota);

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
          selectedPet: userPets.mascotas[0].nombre // Considerando que cada usuario puede tener múltiples mascotas
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
    // Puedes realizar acciones adicionales con los datos aquí
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
    if (view === 'month') {
      return date.getDay() === 0 || date.getDay() === 6;
    }
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className='p-4 sm:p-6 md:p-8 lg:p-10'>
      <form className="flex flex-col items-center" onSubmit={handleFormSubmit}>
        <div className="w-full mb-4">
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
        <div className="w-full flex flex-col sm:flex-row justify-between mb-4">
          <p className="w-full sm:w-2/3 text-center sm:text-left mb-2">
            Recuerde que el horario que está solicitando es estipulativo y sujeto a confirmación.
          </p>
          <select
            className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md mb-2 sm:mb-0"
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
        <div className="w-full mb-4">
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
          <div className="w-full mb-4 flex flex-row justify-between">
            <label className="w-full text-center" htmlFor="needPickup">¿Necesita que la busquen y la devuelvan?</label>
            <input
              className="w-full scale-50 p-2 border border-gray-700 rounded-md focus:outline-none"
              type="checkbox"
              id="needPickup"
              name="needPickup"
              checked={formData.needPickup}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="w-full">
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
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 mt-4 rounded-md"
        >
          Confirmar cita
        </button>
      </form>
      </div>
    </div>
  );
}

export default MyCalendar;
