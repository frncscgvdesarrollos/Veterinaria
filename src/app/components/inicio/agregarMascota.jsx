'use client'
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { UserAuth } from '../../context/AuthContext';
import { registrarMascotas, subirFotoMascota } from '../../firebase';

export default function FormAgregarMascota() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [nuevaMascota, setNuevaMascota] = useState({
    uid: uid,
    especie: '',
    raza: '',
    edad: '',
    tamaño: '',
    altura:"",
    peso: '',
    sexo: '',
    pelo: '',
    castrado:'',
    nombre: '',
    foto: '',
    estadoCivil: '',
    postulantes: [],
    info: 'Tiene algun problema de salud?',
    cumpleaños: '',
    internacion:false,
    turnosPeluqueria:0,
    turnosConsulta:0,
    carnetSanitario: [
      {
        antirrabicas : []
      },
      {
        vacunas : []
      },
      {
        desparasitaciones: []
      }
    ],
    mensajes: []
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
    redirect('/HomeCliente');
  }

  return (
    <div className="max-w-xl mx-auto bg-gray-200 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Agregar Nueva Mascota</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <option value="En adopción">En adopción</option>
          <option value="Tránsito">Tránsito</option>
        </select>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              placeholder="Mestizo"
              className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="tamaño">Tamaño:</label>
            <select
              id="tamaño"
              name="tamaño"
              value={nuevaMascota.tamaño}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
            >
              <option value="">Selecciona</option>
              <option value="toy">Toy </option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
              <option value="gigante">Gigante</option>
            </select>
            {nuevaMascota.tamaño === 'gigante' && <span className='text-red-500 font-bold'>Mas de 50 cm y 20 kilos</span>}
            {nuevaMascota.tamaño === 'grande' && <span className='text-red-500 font-bold'>Hasta 60 cm mas de 15 kilos</span>}
            {nuevaMascota.tamaño === 'mediano' && <span className='text-red-500 font-bold'>De 20 a 40 cm y 10 kilos</span>}
            {nuevaMascota.tamaño === 'toy' && <span className='text-red-500 font-bold'>Menos 20 cm y 5 kilos</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="altura">Cruz del perro:</label>
            <select
              id="altura"
              name="altura"
              value={nuevaMascota.altura}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
            >
              <option value="">Selecciona</option>
              <option value="0-20 cm">0-20 cm</option>
              <option value="20-40 cm">20-40 cm</option>
              <option value="40-60 cm">40-60 cm</option>
              <option value="60-80 cm">60-80 cm</option>
            </select>
            <span className='text-red-500 font-bold'>Mira la imagen</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="pelo">Pelo:</label>
          <select
            id="pelo"
            name="pelo"
            value={nuevaMascota.pelo}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          >
            <option value="">Selecciona</option>
            <option value="Corto">Corto</option>
            <option value="Largo">Largo</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="edad">Edad (años): {nuevaMascota.edad}</label>
          <input
            type="range"
            id="edad"
            name="edad"
            min="0"
            max="30"
            value={nuevaMascota.edad}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="peso">Peso (kg): {nuevaMascota.peso}</label>
          <input
            type="range"
            id="peso"
            name="peso"
            min="1"
            max="50"
            value={nuevaMascota.peso}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="sexo">Sexo:</label>
          <div className="flex">
            <label className="inline-flex items-center">
              <input
                type="radio"
                id="sexo-macho"
                name="sexo"
                value="Macho"
                checked={nuevaMascota.sexo === 'Macho'}
                onChange={handleInputChange}
                className="form-radio"
              />
              <span className="ml-2">Macho</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                id="sexo-hembra"
                name="sexo"
                value="Hembra"
                checked={nuevaMascota.sexo === 'Hembra'}
                onChange={handleInputChange}
                className="form-radio"
              />
              <span className="ml-2">Hembra</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="castrado">Castrado:</label>
          <div className="flex">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                id="castrado"
                name="castrado"
                checked={nuevaMascota.castrado}
                onChange={(e) => setNuevaMascota({ ...nuevaMascota, castrado: e.target.checked })}
                className="form-checkbox h-5 w-5 text-red-600"
              />
              <span className="ml-2">Sí</span>
            </label>
          </div>
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
