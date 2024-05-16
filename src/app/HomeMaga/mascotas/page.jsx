'use client'
import React, { useState, useEffect } from 'react';
import { getMascotas, getClientes, aplicarVacuna } from '@/app/firebase';
import Image from 'next/image';

export default function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nombreBuscar, setNombreBuscar] = useState('');
  const [mascotasEncontradas, setMascotasEncontradas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      return getClientes()
        .then(clientesData => {
          setClientes(clientesData);
          return getMascotas();
        })
        .then(mascotasData => {
          setMascotas(mascotasData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };

    fetchData();
  }, []);

  const buscarMascota = (nombre) => {
    const mascotasEncontradas = mascotas.filter(mascota => mascota.nombre.toLowerCase() === nombre.toLowerCase());
    setMascotasEncontradas(mascotasEncontradas);
  };

  const handleBuscarClick = () => {
    if (nombreBuscar.trim() !== '') {
      buscarMascota(nombreBuscar);
    }
  };

  const handleNombreChange = (event) => {
    setNombreBuscar(event.target.value);
  };

  const abrirModal = (mascota) => {
    setMascotaSeleccionada(mascota);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const handleAplicarVacuna = (tipoVacuna) => {
    aplicarVacuna(mascotaSeleccionada.uid, mascotaSeleccionada.nombre, tipoVacuna)
      .then(() => {
        console.log("Vacuna aplicada correctamente.");
        // Actualizar datos de mascotas después de aplicar la vacuna
        return getMascotas();
      })
      .then(mascotasData => {
        setMascotas(mascotasData);
      })
      .catch(error => {
        console.error("Error al aplicar la vacuna:", error);
      });
  };

  return (
    <div className="p-4 md:p-8 bg-purple-50 rounded-lg">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl text-purple-800 mb-4 font-bold">Lista de mascotas registradas</h1>
        <div className='flex flex-col md:flex-row items-center bg-purple-200 p-4 rounded-lg'>
          <input
            type="text"
            className="px-4 py-2 border border-purple-400 rounded-lg mb-4 md:mb-0 md:mr-4 w-full md:w-2/3 focus:outline-none focus:ring focus:border-purple-500"
            placeholder='Nombre de la mascota'
            value={nombreBuscar}
            onChange={handleNombreChange}
          />
          <button
            className='bg-purple-600 text-white px-6 py-2 rounded-lg w-full md:w-1/3 hover:bg-purple-700 focus:outline-none focus:ring focus:border-purple-500'
            onClick={handleBuscarClick}
          >
            Buscar
          </button>
        </div>
      </div>
      {isLoading ? (
        <p className="text-purple-800">Cargando mascotas...</p>
      ) : (
        <>
          {mascotasEncontradas.length > 0 ? (
            mascotasEncontradas.map((mascota, index) => (
              <div key={index} className="bg-purple-200 p-4 mb-4 rounded-lg flex flex-col md:flex-row items-center">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:border-purple-500" onClick={() => setMascotasEncontradas([])}>Cerrar</button>
                <div className="m-auto bg-purple-300 p-4 rounded-lg">
                  <p className="text-purple-800"><span className="font-semibold">Nombre:</span> {mascota.nombre}</p>
                  <p className="text-purple-800"><span className="font-semibold">Raza:</span> {mascota.raza}</p>
                  <p className="text-purple-800"><span className="font-semibold">Tamaño:</span> {mascota.tamaño}</p>
                  <p className="text-purple-800"><span className="font-semibold">Cumpleaños:</span> {mascota.cumpleaños}</p>
                  <p className="text-purple-800"><span className="font-semibold">Cliente:</span> {mascota.uid}</p>
                </div>
                <div className="m-auto">
                  <Image src={mascota.foto} alt="fotomascota" width={150} height={100} className='rounded-full'/>
                </div>
              </div>
            ))
          ) : null}

          <div className="overflow-x-auto bg-purple-200 p-4 rounded-lg">
            <table className="w-full md:w-2/3 mx-auto text-center bg-purple-300 rounded-lg">
              <thead className="text-xl">
                <tr>
                  <th className="px-4 py-2 text-purple-800">Nombre</th>
                  <th className="px-4 py-2 text-purple-800">Raza</th>
                  <th className="px-4 py-2 text-purple-800">Tamaño</th>
                  <th className="px-4 py-2 text-purple-800">Cumpleaños</th>
                  <th className="px-4 py-2 text-purple-800">Cliente</th>
                  <th className="px-4 py-2 text-purple-800">Foto</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((mascota, index) => (
                  <tr key={index} onClick={() => abrirModal(mascota)} style={{cursor: 'pointer'}}>
                    <td className="px-4 py-2 text-purple-800">{mascota.nombre}</td>
                    <td className="px-4 py-2 text-purple-800">{mascota.raza}</td>
                    <td className="px-4 py-2 text-purple-800">{mascota.tamaño}</td>
                    <td className="px-4 py-2 text-purple-800">{mascota.cumpleaños}</td>
                    <td className="px-4 py-2 text-purple-800">{mascota.uid}</td>
                    <td className="px-4 py-2">
                      <Image
                        src={mascota.foto}
                        alt={mascota.nombre}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {modalAbierto && (
        <div className="absolute top-14 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-purple-800">Detalles de la mascota</h2>
            <p className="text-purple-800 mb-2">Nombre: {mascotaSeleccionada.nombre}</p>
            <p className="text-purple-800 mb-2">Raza: {mascotaSeleccionada.raza}</p>
            <p className="text-purple-800 mb-2">Tamaño: {mascotaSeleccionada.tamaño}</p>
            <p className="text-purple-800 mb-2">Cumpleaños: {mascotaSeleccionada.cumpleaños}</p>
            <p className="text-purple-800 mb-2">Cliente: {mascotaSeleccionada.uid}</p>
            <p className="text-purple-800 mb-2">Carnet Sanitario:</p>
            {mascotaSeleccionada.carnetSanitario && mascotaSeleccionada.carnetSanitario.map((seccion, index) => (
              <div key={index} className="mb-4 bg-purple-200 p-4 rounded-lg">
                <p className="text-purple-800 mb-2">{Object.keys(seccion)[0]}:</p>
                <ul className='flex flex-col'>
                {Object.values(seccion)[0].map((item, i) => (
                    <li key={i} className="mb-1">
                      {Object.entries(item).map(([key, value], j) => (
                        <p key={j} className="text-purple-800 mb-1">{key}: {value}</p>
                      ))}
                    </li>
                  ))}

                </ul>
                <button onClick={() => handleAplicarVacuna(Object.keys(seccion)[0])} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:border-purple-500 mt-2">Aplicación</button>
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg mr-4 hover:bg-purple-700 focus:outline-none focus:ring focus:border-purple-500" onClick={cerrarModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
