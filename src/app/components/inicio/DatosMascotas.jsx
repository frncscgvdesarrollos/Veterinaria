import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import FormAgregarMascota from '@/app/components/inicio/agregarMascota';
import { MascotasContext } from '../../context/MascotaContext';
import Link from 'next/link';
import { postular, rechazarPostulante, confirmarAdopcion } from '@/app/firebase' // Asegúrate de importar las funciones de Firebase

export default function MisMascotas() {
  const { mascota } = MascotasContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [nuevaMascota, setNuevaMascota] = useState(false);
  const [mascotas, setMascotas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [firstVisiblePostulant, setFirstVisiblePostulant] = useState(0);

  useEffect(() => {
    setMascotas(mascota); // Actualizar mascotas cuando cambie el contexto
  }, [mascota]);

  // Calcular el número total de postulantes
  const totalPostulantes = mascotas && mascotas[currentPage] ? (mascotas[currentPage].postulantes?.length || 0) : 0;


  const toggleNuevaMascota = () => {
    setNuevaMascota(!nuevaMascota);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage === mascotas.length - 1 ? 0 : prevPage + 1));
    setFirstVisiblePostulant(0); // Reiniciar el índice del primer postulante visible al cambiar de mascota
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage === 0 ? mascotas.length - 1 : prevPage - 1));
    setFirstVisiblePostulant(0); // Reiniciar el índice del primer postulante visible al cambiar de mascota
  };

  const nextPostulant = () => {
    setFirstVisiblePostulant((prevIndex) => prevIndex + 1);
  };

  const prevPostulant = () => {
    setFirstVisiblePostulant((prevIndex) => Math.max(prevIndex - 1, 0));
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

  const handleAdopcion = (uid) => {
    confirmarAdopcion(uid, currentMascota.nombre, currentMascota.uid)
      .then(() => {
        // Manejar el éxito de la adopción
        alert("Adopción confirmada con éxito");
      })
      .catch((error) => {
        console.error("Error al confirmar adopción: ", error);
        alert("Error al confirmar adopción. Por favor, inténtalo de nuevo más tarde.");
      });
  };
  
  const handleRechazo = (postulante) => {
    rechazarPostulante(postulante, currentMascota.nombre, currentMascota.uid)
      .then(() => {
        // Manejar el éxito del rechazo
        alert("Postulante rechazado con éxito");
      })
      .catch((error) => {
        console.error("Error al rechazar postulante: ", error);
        alert("Error al rechazar postulante. Por favor, inténtalo de nuevo más tarde.");
      });
  };
  

  return (
    <div className="w-[300px] mx-auto p-4 border-2 border-purple-800 rounded-lg">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-purple-200 bg-opacity-70 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Tus Mascotas</h2>
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
              <p className="text-gray-600 text-xl p-2">No tienes ninguna mascota.</p>
              <Link href="#Adopciones" className="text-purple-800 bg-opacity-70 rounded-full text-xl p-4 my-4 bg-purple-800 text-yellow-300 mx-auto">Adoptar</Link>
              <button onClick={prevPage} className="bg-purple-800 text-white bg-opacity-70 rounded-full w-12 h-12 md:w-14 md:h-14 my-auto">&#8592;</button>
            </>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 relative mb-4">
              <button onClick={nextPage} className="ml-auto bg-purple-800 text-white bg-opacity-70 rounded-full w-2/3 h-12 md:w-14 md:h-14 my-auto ">
              Siguiente mascota✨
              </button>
              <div className="bg-violet-500 bg-opacity-70 rounded-lg overflow-hidden mt-4 flex flex-col items-center">
                <div className="relative w-[200px] mx-auto  h-auto">
                  {currentMascota && currentMascota.foto ? (
                    <div>

                      <Image
                          width={200}
                          height={200}
                          src={currentMascota.foto}
                          alt={`Foto de ${currentMascota.nombre}`}
                          loading='lazy'
                        />
                      </div>
                  ) : (
                    <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
                      <p className="text-gray-600 text-lg">Foto no disponible</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 bg-purple-500 bg-opacity-75 text-white p-2 w-full">
                    <h2 className="text-lg font-semibold">{currentMascota ? currentMascota.nombre : 'Nombre de la mascota'}</h2>
                  </div>
                </div>
                <div className="p-4 w-full">
                  <p className="text-sm text-gray-600 py-2">Tamaño: {currentMascota ? currentMascota.tamaño : 'Tamaño'}</p>
                  <p className="text-sm text-gray-600 py-2">Raza: {currentMascota ? currentMascota.raza : 'Raza'}</p>
                  <p className="text-sm text-gray-600 py-2">Esta: {currentMascota ? currentMascota.estadoCivil : 'Edad'}</p>
                  <p className="text-sm text-gray-600 py-2">Total de Postulantes: {totalPostulantes}</p>
                      <div className="p-4 adoptantes mx-auto">
                        {currentMascota.estadoCivil === "En adopción" ? 
                          currentMascota.postulantes?.slice(firstVisiblePostulant, firstVisiblePostulant + 1).map((postulante , index) => (
                            <div key={index} className="p-4 mx-auto bg-pink-500 rounded-lg my-2 w-[300px]">
                              <h3 className="text-2xl text-gray-300">Postulante</h3>
                              <div className='flex flex-col w-full'>
                                <div className='flex flex-col '>
                              <p className="text-xl text-gray-300 py-2">{postulante.nombre} {postulante.apellido}</p>
                              <p className="text-xl text-gray-300 py-2">Tel: {postulante.telefono}</p>
                              </div>
                              <div className='flex flex-col'>
                              <button className="bg-violet-600  border-white border-2 text-white bg-opacity-70 rounded-full p-2 w-full mt-4" onClick={() => handleAdopcion(postulante.uid)}>¡Aceptar Adopción! 🥳</button>
                              <button className='text-white bg-red-600 border-white border-2  rounded-full p-2 w-full mt-4' onClick={() => handleRechazo(postulante.uid)}>Rechazar 🛑</button>
                              </div>
                              </div>
                              <button className='text-white bg-opacity-70 rounded-full p-2 w-full' onClick={nextPostulant}>
  🐾Siguiente🐾
</button>
                            </div>
                          ))
                          : <p>No hay postulantes para esta mascota</p>}
                      </div>
                  <button onClick={toggleModal} className="bg-purple-800 text-white bg-opacity-70 rounded-full p-2 w-full mt-4">Ver Carnet</button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
      {/* Modal para mostrar el carnet sanitario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
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

                              
