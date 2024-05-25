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
    <div className="w-[320px] md:w-[400px] lg:w-[500px] mx-auto p-4  bg-opacity-10 rounded-lg">
      <div className="mb-8 flex flex-col md:flex-row w-full justify-between items-center bg-purple-200 bg-opacity-70 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Tus Mascotas</h2>
        <button onClick={toggleNuevaMascota} className="bg-purple-800 text-violet-100 bg-opacity-70 rounded-lg p-2">
          Agregar mascota
        </button>
      </div>
      {nuevaMascota ? (
        <div className="mb-8">
          <FormAgregarMascota />
          <button className="btn btn-secondary mt-4" onClick={() => setNuevaMascota(false)}>Cancelar</button>
        </div>
      ) : (
        
        <div className="flex flex-col items-center bg-purple-300 bg-opacity-70 rounded-lg p-4">
          {!mascotas || mascotas.length === 0 ? (
            <>
              <p className="text-gray-600 text-xl p-2">No tienes ninguna mascota.</p>
              <Link href="#Adopciones" className="text-purple-800 bg-opacity-70 rounded-full text-xl p-4 my-4 bg-purple-800 text-yellow-300 mx-auto">Adoptar</Link>
            </>
          ) : (
            <div className="flex flex-col gap-4 relative mb-4 w-[200px] md:w-[350px] lg:w-[450px]">
              <div className="bg-violet-500 bg-opacity-70 rounded-lg overflow-hidden mt-4 flex flex-col items-center">
                <div className="relative w-[200px] md:w-[300px] lg:w-[400px] mx-auto  h-auto">
                              <button className='text-white bg-purple-800 bg-opacity-70 rounded-full p-2 w-full' onClick={nextPostulant}>
                                  Siguiente🐾
                            </button>
                  {currentMascota && currentMascota.foto ? (
                    <div className="w-[200px] md:w-[400px] lg:w-[400px] h-48">
                      <Image
                          src={currentMascota.foto}
                          alt={`Foto de ${currentMascota.nombre}`}
                          loading='lazy'
                          fill={true}
                        />
                      </div>
                  ) : (
                    <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
                      <p className="text-gray-600 text-lg">Foto no disponible</p>
                    </div>
                  )}
                  <div className="absolute w-full bottom-0 left-0 bg-purple-500 bg-opacity-75 text-white p-2">
                    <h2 className="text-lg font-semibold w-full text-center text-purple-200">{currentMascota ? currentMascota.nombre : 'Nombre de la mascota'}</h2>
                  </div>
                </div>
                <div className="p-4 w-full ">
                  <hr></hr>
                  <div className=' flex flex-col'>
                  <div>
                  <p className="text-xl text-violet-900 font-semibold py-2">Tamaño: {currentMascota ? currentMascota.tamaño : 'Tamaño'}</p>
                  <p className="text-xl text-violet-900 font-semibold py-2">Raza: {currentMascota ? currentMascota.raza : 'Raza'}</p>
                  <p className="text-xl text-violet-900 font-semibold  py-2">Esta: {currentMascota ? currentMascota.estadoCivil : null}</p>
                  </div>
                  <hr></hr>
                  <div>
                          <button onClick={toggleModal} className="bg-lime-600 text-white bg-opacity-70 rounded-full p-2 w-full my-4">Ver Carnet</button>
                          <button onClick={nextPage} className="w-full md:w-[200px] md:ml-52 bg-purple-300 text-purple-500 bg-opacity-70 rounded-lg h-12 font-bold  my-4">
                          Siguiente mascota✨
                          </button>
                          </div>
                          <hr></hr>
                          </div>
                      <div className="p-4 adoptantes mx-auto">
                        {currentMascota.estadoCivil === "En adopción" ? 
                          currentMascota.postulantes?.slice(firstVisiblePostulant, firstVisiblePostulant + 1).map((postulante , index) => (
                            <div key={index} className="p-4 mx-auto bg-pink-500 rounded-lg my-2 w-full">
                              <h3 className="text-2xl text-gray-300">Postulante</h3>
                              <div className='flex flex-col w-full'>
                                <div className='flex flex-col '>
                              <p className="text-xl text-gray-300 py-2">{postulante.nombre} {postulante.apellido}</p>
                              <p className="text-xl text-gray-300 py-2">Tel: {postulante.telefono}</p>
                              </div>
                              <div className='flex flex-col'>
                              <button className="bg-violet-400  border-white border-2 text-white bg-opacity-40 rounded-full p-2 w-full my-4 " onClick={() => handleAdopcion(postulante.uid)}>¡Aceptar Adopción! 🥳</button>
                              <button className='text-white bg-red-600 border-white border-2  rounded-full p-2 w-full mt-4' onClick={() => handleRechazo(postulante.uid)}>Rechazar postulante 🛑</button>
                              </div>
                              </div>
                            </div>
                          ))
                          : <p>No hay postulantes para esta mascota</p>}
                      </div>
     
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

                              
