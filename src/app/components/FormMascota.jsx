'use client';
import React, { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';
import { registrarMascotas, subirFotoMascota } from '../firebase'; 

export default function FormMascota() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [numPets, setNumPets] = useState(0);
  const [pets, setPets] = useState([]);
  const [mascotasCargadas, setMascotasCargadas] = useState(false);

  const handleNumPetsChange = (event) => {
    const num = parseInt(event.target.value);
    setNumPets(num);
    const newPets = Array.from({ length: num }, (_, index) => ({
      id: index,
      nombre: '',
      especie: '',
      raza: '',
      tamaño: '',
      cumpleaños: '',
      foto: null,
      uid: uid,
    }));
    setPets(newPets);
  };

  const handlePetInputChange = (event, index, fieldName) => {
    const value = event.target.value;
    const updatedPets = [...pets];
    updatedPets[index] = {
      ...updatedPets[index],
      [fieldName]: value,
    };
    setPets(updatedPets);
  };

  const handlePetImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const petName = pets[index].nombre;
      const fileName = `${petName}-${uid}`;
      subirFotoMascota(file, fileName)
        .then(url => {
          const updatedPets = [...pets];
          updatedPets[index] = {
            ...updatedPets[index],
            foto: url,
          };
          setPets(updatedPets);
        })
        .catch(error => {
          console.error("Error al subir la foto de la mascota:", error);
        });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (numPets > 0) {
      registrarMascotas(pets)
        .then(() => {
          setMascotasCargadas(true);
        })
        .catch(error => {
          console.error("Error al registrar mascotas:", error);
        });
    } else {
      setMascotasCargadas(true);
    }
  };

  useEffect(() => {
    if (mascotasCargadas) {
      redirect('/datosTerminos');
    }
  }, [mascotasCargadas]);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-300 p-6 rounded-lg">
      <section className="mt-8 mx-auto max-w-md">
        <p className="mb-4 text-gray-700">
          Por favor, completa la información de tus mascotas con cuidado. Es importante proporcionar datos precisos para garantizar un servicio adecuado.
        </p>
        <p className="mb-4 text-gray-700">
          Recuerda que el tamaño y la especie son factores importantes para determinar el costo del servicio y el manejo durante el traslado.
        </p>
        <p className="mb-4 text-gray-700">
          Si no tienes mascotas, puedes continuar este paso sin problemas.
        </p>
      </section>
      <label className="block mb-4 text-gray-700">
        Cantidad de mascotas:
        <select 
          value={numPets} 
          onChange={handleNumPetsChange} 
          className="border border-gray-300 rounded-md p-2 w-full text-gray-800">
          {[...Array(10)].map((_, index) => (
            <option 
              value={index} 
              key={index}>
                {index}
            </option>
          ))}
        </select>
      </label>

      {[...Array(numPets)].map((_, index) => (
        <div key={index} className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Mascota #{index + 1}</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="mb-4 flex flex-col">
              <label className="text-white font-bold mb-2">Nombre:</label>
              <input
                type="text"
                name={`nombre-${index}`}
                value={pets[index]?.nombre || ''}
                onChange={(event) => handlePetInputChange(event, index, 'nombre')}
                className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4 flex flex-col">
              <label className="text-white font-bold mb-2">Especie:</label>
              <select
                name={`especie-${index}`}
                value={pets[index]?.especie || ''}
                onChange={(event) => handlePetInputChange(event, index, 'especie')}
                className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Selecciona</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
              </select>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="text-white font-bold mb-2">Foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handlePetImageChange(event, index)}
                className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4 flex flex-col">
              <label className="text-white font-bold mb-2">Cumpleaños:</label>
              <input
                type="date"
                name={`cumpleaños-${index}`}
                value={pets[index]?.cumpleaños || ''}
                onChange={(event) => handlePetInputChange(event, index, 'cumpleaños')}
                className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4 flex flex-col">
              <label className="text-white font-bold mb-2">Raza:</label>
              <input
                type="text"
                name={`raza-${index}`}
                value={pets[index]?.raza || ''}
                onChange={(event) => handlePetInputChange(event, index, 'raza')}
                className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4 flex flex-col">
              <label className="text-white font-bold mb-2">Tamaño:</label>
              <select
                name={`tamaño-${index}`}
                value={pets[index]?.tamaño || ''}
                onChange={(event) => handlePetInputChange(event, index, 'tamaño')}
                className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Selecciona</option>
                <option value="Toy">Toy</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
                <option value="Muy Grande">Muy Grande</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      <button type="submit" className="btn bg-red-500 p-2 bg-sky-500 w-full ml-auto mr-auto text-xl rounded mt-10">Siguiente paso</button>
    </form>
  );
}
