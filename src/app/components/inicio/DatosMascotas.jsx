'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import FormAgregarMascota from '@/app/components/inicio/agregarMascota';
import { MascotasContext } from '../../context/MascotaContext';
import Link from 'next/link';

export default function MisMascotas() {
  const { mascota } = MascotasContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [nuevaMascota, setNuevaMascota] = useState(false);
  const [mascotas, setMascotas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setMascotas(mascota); // Actualizar mascotas cuando cambie el contexto
  }, [mascota]);

  const toggleNuevaMascota = () => {
    setNuevaMascota(!nuevaMascota);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage === mascotas.length - 1 ? 0 : prevPage + 1));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage === 0 ? mascotas.length - 1 : prevPage - 1));
  };

  let currentMascota;
  if (!mascotas || mascotas.length === 0) {
    currentMascota = "No tienes ninguna mascota";
  } else {
    currentMascota = mascotas[currentPage];
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="container mx-auto p-4 border-2 border-purple-800 rounded-lg">
      <div className="mb-8 flex justify-between items-center bg-purple-200 bg-opacity-70 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 text-purple-800">Tus Mascotas</h2>
        <button onClick={toggleNuevaMascota} className="bg-purple-800 text-violet-100 bg-opacity-70 rounded-full p-2">
          Agregar mascota
        </button>
      </div>
      {nuevaMascota ? (
        <div className="mb-8">
          <FormAgregarMascota />
          <button className="btn btn-secondary mt-4" onClick={() => setNuevaMascota(false)}>Cancelar</button>
        </div>
      ) : (
        <div className="flex flex-col items-center bg-pink-300 bg-opacity-70 rounded-lg p-4">
          {!mascotas || mascotas.length === 0 ? (
            <>
              <p className="text-gray-600 text-xl p-2 ">No tienes ninguna mascota.</p>
              <Link href="#Adopciones" className="text-purple-800 bg-opacity-70 rounded-full text-xl p-4 my-4 bg-purple-800 text-yellow-300 mx-auto ">Adoptar. </Link>
            </>
          ) : (
            <div className="flex gap-4 relative mb-4">
              <button onClick={prevPage} className="bg-purple-800 text-white bg-opacity-70 rounded-full  w-[50px] h-[70px] my-auto">&#8592;</button>
              <div className="bg-violet-100 rounded-lg overflow-hidden mt-4">
                <div className="relative">
                  {currentMascota && currentMascota.foto ? (
                    <div className="relative" style={{ width: '200px', height: '200px' }}>
                      <Image
                        src={currentMascota.foto}
                        alt={`Foto de ${currentMascota.nombre}`}
                        layout='fill'
                        objectFit='cover'
                        loading='lazy'
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
                      <p className="text-gray-600 text-lg">Foto no disponible</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 bg-purple-900 bg-opacity-75 text-white p-2 w-full">
                    <h2 className="text-lg font-semibold">{currentMascota ? currentMascota.nombre : 'Nombre de la mascota'}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 py-2">Tamaño: {currentMascota ? currentMascota.tamaño : 'Tamaño'}</p>
                  <p className="text-sm text-gray-600 py-2">Raza: {currentMascota ? currentMascota.raza : 'Raza'}</p>
                  <p className="text-sm text-gray-600 py-2">Situación: {currentMascota ? currentMascota.estadoCivil || 'No definida' : 'No definida'}</p>
                  <button onClick={toggleModal} className="bg-purple-800 text-white bg-opacity-70 rounded-full p-2 w-full mt-4">Ver Carnet</button>
                </div>
              </div>
              <button onClick={nextPage} className="bg-purple-800 text-white bg-opacity-70 rounded-full  w-[50px] h-[70px] my-auto cursor-pointer">&#8594;</button>
            </div>
          )}
        </div>
      )}
      {/* Modal para mostrar el carnet sanitario */}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg">
      {/* Contenido del carnet sanitario */}
      <h2 className="text-xl font-semibold mb-4">Carnet Sanitario de {currentMascota.nombre}</h2>
      {/* Renderizado de los datos del carnet sanitario */}
      <div>
        <h3 className="font-semibold mb-2">Ultima Antirrábica:</h3>
        {currentMascota.carnetSanitario && currentMascota.carnetSanitario.antirrabica ? (
          <ul>
            {currentMascota.carnetSanitario.antirrabica.map((vacuna, index) => (
              <li key={index}>{/* Renderizar los detalles de la vacuna antirrábica */}</li>
            ))}
          </ul>
        ) : (
          <p>No hay información disponible</p>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Ultimas Vacunas:</h3>
        {currentMascota.carnetSanitario && currentMascota.carnetSanitario.vacunas ? (
          <ul>
            {currentMascota.carnetSanitario.vacunas.map((vacuna, index) => (
              <li key={index}>{/* Renderizar los detalles de cada vacuna */}</li>
            ))}
          </ul>
        ) : (
          <p>No hay información disponible</p>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Ultima Desparasitaciones:</h3>
        {currentMascota.carnetSanitario && currentMascota.carnetSanitario.desparasitaciones ? (
          <ul>
            {currentMascota.carnetSanitario.desparasitaciones.map((desparasitacion, index) => (
              <li key={index}>{/* Renderizar los detalles de cada desparasitación */}</li>
            ))}
          </ul>
        ) : (
          <p>No hay información disponible</p>
        )}
            </div>
            {/* Botón para cerrar el modal */}
            <button onClick={toggleModal} className="bg-purple-800 text-white rounded-full p-2 w-full mt-4">Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
}
