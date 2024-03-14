'use client'
import React, { useState } from 'react';
import { redirect } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';
import { registrarMascotas, subirFotoMascota } from '../firebase';

export default function FormAgregarMascota() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    cumpleaños: '',
    tamaño: '',
    estadoCivil: '',
    info: '',
    uid: uid,
    foto: ''
  });
  const [mascotaAgregada, setMascotaAgregada] = useState(false);
  const [foto, setFoto] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevaMascota({
      ...nuevaMascota,
      [name]: value
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFoto(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const promises = [];
    if (foto) {
      const fileName = `${nuevaMascota.nombre}-${uid}`;
      promises.push(subirFotoMascota(foto, fileName));
    }
    Promise.all(promises)
      .then((urls) => {
        const fotoURL = urls[0] || '';
        const mascotaConFoto = { ...nuevaMascota, foto: fotoURL };
        const mascotaParaGuardar = [mascotaConFoto];
        return registrarMascotas(mascotaParaGuardar);
      })
      .then(() => {
        setMascotaAgregada(true);
      })
      .catch((error) => {
        console.error('Error al agregar la nueva mascota:', error);
      });
  };

  if (mascotaAgregada) {
    redirect('/HomeCliente/Mismascotas');
  }

  return (
    <div className="max-w-md mx-auto bg-gray-200 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Agregar Nueva Mascota</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nuevaMascota.nombre}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="especie">Especie:</label>
          <select
            id="especie"
            name="especie"
            value={nuevaMascota.especie}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          >
            <option value="">Selecciona</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="raza">Raza:</label>
          <input
            type="text"
            id="raza"
            name="raza"
            value={nuevaMascota.raza}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="edad">Edad:</label>
          <input
            type="text"
            id="edad"
            name="edad"
            value={nuevaMascota.edad}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="cumpleaños">Cumpleaños:</label>
          <input
            type="date"
            id="cumpleaños"
            name="cumpleaños"
            value={nuevaMascota.cumpleaños}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="tamaño">Tamaño:</label>
          <input
            type="text"
            id="tamaño"
            name="tamaño"
            value={nuevaMascota.tamaño}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="estadoCivil">Estado Civil:</label>
          <select
            id="estadoCivil"
            name="estadoCivil"
            value={nuevaMascota.estadoCivil}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          >
            <option value="">Selecciona</option>
            <option value="Adoptado">Adoptado</option>
            <option value="En adopción">En Adopción</option>
            <option value="Tránsito">Tránsito</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="info">Información:</label>
          <textarea
            id="info"
            name="info"
            value={nuevaMascota.info}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full h-32 resize-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="foto">Foto:</label>
          <input
            type="file"
            id="foto"
            name="foto"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <button type="submit" className="btn bg-red-500 p-2 bg-sky-500 w-full ml-auto mr-auto text-xl rounded mt-6">Agregar Mascota</button>
      </form>
    </div>
  );
}
