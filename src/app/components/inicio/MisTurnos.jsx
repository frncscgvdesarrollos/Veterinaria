'use client';
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { getMisTurnos } from '../../firebase';

export default function MisTurnos() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [turnosCliente, setTurnosCliente] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchTurnosCliente = () => {
      setIsLoading(true);
      if (uid) {
        getMisTurnos(uid)
          .then(turnosSnapshot => {
            setTurnosCliente(turnosSnapshot);
          })
          .catch(error => {
            setError('Error al obtener los turnos del cliente');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };

    if (uid) {
      fetchTurnosCliente();
    }
  }, [uid]);

  const formatDate = timestamp => {
    if (!timestamp || !timestamp.toDate) return ""; // Manejar el caso en que el timestamp es nulo o indefinido
    const date = timestamp.toDate(); // Convertir el objeto Timestamp a una fecha de JavaScript
    return date.toLocaleDateString('es-AR'); // Puedes ajustar el formato según tus preferencias
  };

  const turnosNoFinalizados = turnosCliente.filter(turno => turno.estadoDelTurno !== 'finalizado');

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="h-full bg-violet-200 bg-opacity-50 rounded-lg p-4">
      <h1 className="text-3xl font-bold mb-4 text-violet-600">Mis turnos de peluquería</h1>
      {isLoading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="flex flex-col gap-4 rounded-lg ">
          {turnosNoFinalizados.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-2">Turnos pendientes</h2>
              <div className="bg-violet-300 bg-opacity-70 rounded-lg p-2 mb-4">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold">{formatDate(turnosNoFinalizados[0].selectedDate)}</h2>
                  <ul>
                    <li className="mb-2">
                      <strong className='text-lg'>Mascota:</strong> {turnosNoFinalizados[0].selectedPet}
                    </li>
                    <li className="mb-2">
                      <strong className='text-lg'>Estado del pago:</strong> {turnosNoFinalizados[0].pago ? 'Pagado' : 'No pagado'}
                    </li>
                    <li className='mb-2'>
                      <strong className='text-lg'>Transporte:</strong> {turnosNoFinalizados[0].transporte ? 'Con transporte' : 'Sin transporte'}
                    </li>
                    <li className='mb-2'>
                      <strong className='text-lg'>Dirección de retiro:</strong> {turnosNoFinalizados[0].direccion || '-'}
                    </li>
                    <li className='mb-2'>
                      <strong className='text-lg'>Precio:</strong> {turnosNoFinalizados[0].precio || '-'}
                    </li>
                    <li className=''>
                      <strong className=''>Estado:</strong>
                      <span className={`py-1 px-2 rounded-lg ${turnosNoFinalizados[0].estadoDelTurno === 'confirmar' ? 'bg-red-500' : turnosNoFinalizados[0].estadoDelTurno === 'buscado' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                        {turnosNoFinalizados[0].estadoDelTurno === 'confirmar' ? 'Confirmar - Recibirá un llamado.' : turnosNoFinalizados[0].estadoDelTurno === 'buscado' ? 'En la Peluquería' : 'Confirmado - El servicio se realizará sin problemas.'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="bg-purple-500 bg-opacity-70 text-white px-4 py-2 rounded-md mb-4 w-full"
              >
                {expanded ? 'Ocultar turnos adicionales' : `Mostrar ${turnosNoFinalizados.length - 1} turnos adicionales`}
              </button>
              {expanded && (
                <div className="bg-violet-300 rounded-lg p-2 h-auto flex flex-col gap-4 ">
                  {turnosNoFinalizados.slice(1).map((turno, index) => (
                    <div key={index + 1} className="mb-4 rounded-lg p-2">
                      <h2 className="text-xl font-semibold mb-2">{formatDate(turno.selectedDate)}</h2>
                      <ul className='rounded-lg'>
                        <li className="mb-2">
                          <strong className='text-lg'>Mascota:</strong> {turno.selectedPet}
                        </li>
                        <li className="mb-2">
                          <strong className='text-lg'>Estado del pago:</strong> {turno.pago ? 'Pagado' : 'No pagado'}
                        </li>
                        <li className='mb-2'>
                          <strong className='text-lg'>Transporte:</strong> {turno.transporte ? 'Con transporte' : 'Sin transporte'}
                        </li>
                        <li className='mb-2'>
                          <strong className='text-lg'>Dirección de retiro:</strong> {turno.direccion || '-'}
                        </li>
                        <li className='mb-2'>
                          <strong className='text-lg'>Precio:</strong> {turno.precio || '-'}
                        </li>
                        <li className=''>
                          <strong className=''>Estado:</strong>
                          <span className={`py-1 px-2 rounded-lg ${turno.estadoDelTurno === 'confirmar' ? 'bg-red-500' : turno.estadoDelTurno === 'buscado' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                            {turno.estadoDelTurno === 'confirmar' ? 'Confirmar - Recibirá un llamado.' : turno.estadoDelTurno === 'buscado' ? 'En la Peluquería' : 'Confirmado - El servicio se realizará sin problemas.'}
                          </span>
                        </li>
                      </ul>
                      
                    </div>
                  ))}
                                <button
                onClick={toggleExpand}
                className="bg-red-500 bg-opacity-70 text-white px-4 py-2 rounded-md mb-4 w-full text-center"
              >Cerrar</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
