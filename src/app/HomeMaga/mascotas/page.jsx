'use client';
import React, { useState, useEffect } from 'react';
import { getMascotas, getClientes } from '@/app/firebase';
import Image from 'next/image';

export default function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nombreBuscar, setNombreBuscar] = useState('');
  const [mascotaEncontrada, setMascotaEncontrada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        Promise.all([getClientes(), getMascotas()])
          .then(([clientesData, mascotasData]) => {
            setClientes(clientesData);
            setMascotas(mascotasData);
            setIsLoading(false);
            resolve();
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            reject(error);
          });
      });
    };

    fetchData();
  }, []);

  const buscarMascota = (nombre) => {
    const mascota = mascotas.find(mascota => mascota.nombre.toLowerCase() === nombre.toLowerCase());
    setMascotaEncontrada(mascota);
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

  return (
    <div className="p-4 md:p-8 bg-violet-100 rounded-lg">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl">Lista de mascotas registradas</h1>
        <div className='flex flex-col md:flex-row items-center'>
          <input
            type="text"
            className="px-4 py-2 border rounded-lg mb-4 md:mb-0 md:mr-4 w-full md:w-2/3"
            placeholder='Nombre de la mascota'
            value={nombreBuscar}
            onChange={handleNombreChange}
          />
          <button
            className='bg-purple-500 text-white px-4 py-2 rounded-lg w-full md:w-1/3'
            onClick={handleBuscarClick}
          >
            Buscar
          </button>
        </div>
      </div>
      {isLoading ? (
        <p>Cargando mascotas...</p>
      ) : (
        <>
          {mascotaEncontrada ? (
            <div className="bg-violet-200 p-4 mb-4 rounded-lg text-center flex flex-col md:flex-row gap-4">
              <h3 className="text-lg font-semibold mb-2">Mascota Encontrada:</h3>
              <div className="flex flex-col items-center md:items-start">
                <p>Nombre: {mascotaEncontrada.nombre}</p>
                <p>Raza: {mascotaEncontrada.raza}</p>
                <p>Tamaño: {mascotaEncontrada.tamaño}</p>
                <p>Cumpleaños: {mascotaEncontrada.cumpleaños}</p>
                <p>Cliente: {mascotaEncontrada.uid}</p>
                <Image src={mascotaEncontrada.foto} alt="fotomascota" width={150} height={100} className='rounded-full'/>
              </div>
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full md:w-2/3 mx-auto text-center bg-purple-200 rounded-lg">
              <thead className="text-xl">
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Raza</th>
                  <th className="px-4 py-2">Tamaño</th>
                  <th className="px-4 py-2">Cumpleaños</th>
                  <th className="px-4 py-2">Cliente</th>
                  <th className="px-4 py-2">Foto</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((mascota, index) => (
                  <tr key={index} onClick={() => abrirModal(mascota)} style={{cursor: 'pointer'}}>
                    <td className="px-4 py-2">{mascota.nombre}</td>
                    <td className="px-4 py-2">{mascota.raza}</td>
                    <td className="px-4 py-2">{mascota.tamaño}</td>
                    <td className="px-4 py-2">{mascota.cumpleaños}</td>
                    <td className="px-4 py-2">{mascota.uid}</td>
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Detalles de la mascota</h2>
            <p>Nombre: {mascotaSeleccionada.nombre}</p>
            <p>Raza: {mascotaSeleccionada.raza}</p>
            <p>Tamaño: {mascotaSeleccionada.tamaño}</p>
            <p>Cumpleaños: {mascotaSeleccionada.cumpleaños}</p>
            <p>Cliente: {mascotaSeleccionada.uid}</p>
            <Image src={mascotaSeleccionada.foto} alt="fotomascota" width={150} height={100} className='rounded-full'/>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg mt-4" onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
  
}
