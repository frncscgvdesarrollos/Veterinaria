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
              console.log("turnosSnapshot", turnosSnapshot);
              setTurnosCliente(turnosSnapshot);
            })
            .catch(error => {
              setError('Error al obtener los turnos del cliente');
              console.error('Error al obtener los turnos del cliente:', error);
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
  
    const toggleExpand = () => {
      setExpanded(!expanded);
    };
  
    const formatDate = timestamp => {
      const date = new Date(timestamp);
      return date.toLocaleDateString('es-AR'); // Puedes ajustar el formato según tus preferencias
    };
  
    return (
      <div className="h-full bg-violet-200 bg-opacity-50 h-full rounded-lg p-4">
        <h1 className="text-3xl font-bold mb-4 text-violet-600">Mis turnos de peluquería</h1>
        {isLoading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {turnosCliente.length > 0 && (
              <React.Fragment>
                <div className="bg-violet-300 bg-opacity-70 rounded-lg p-2 h-auto">
                  <div key={0} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{formatDate(turnosCliente[0].selectedDate)}</h2>
                    <ul>
                      <li className="mb-2">
                        <strong className='text-lg'>Mascota:</strong> {turnosCliente[0].selectedPet}
                      </li>
                      <li className="mb-2">
                        <strong className='text-lg'>Estado del pago:</strong> {turnosCliente[0].pago ? 'Pagado' : 'No pagado'}
                      </li>
                      <li className='mb-2'>
                        <strong className='text-lg'>Transporte:</strong> {turnosCliente[0].transporte ? 'Con transporte' : 'Sin transporte'}
                      </li>
                      <li className='mb-2'>
                        <strong className='text-lg'>Dirección de retiro:</strong> {turnosCliente[0].direccion || '-'}
                      </li>
                      <li className='mb-2'>
                        <strong className='text-lg'>Precio:</strong> {turnosCliente[0].precio || '-'}
                      </li>
                      <li className=''>
                        <strong className=''>Estado:</strong> 
                        <span className={`py-1 rounded-lg ${turnosCliente[0].estadoDelTurno === 'confirmar' ? 'bg-red-500' : turnosCliente[0].estadoDelTurno === 'buscado' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                          {turnosCliente[0].estadoDelTurno === 'confirmar' ? 'Confirmar - Recibirá un llamado.' : turnosCliente[0].estadoDelTurno === 'buscado' ? 'En la Peluquería' : ' El servicio se realizará sin problemas.'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={toggleExpand}
                  className="bg-purple-500 bg-opacity-70 text-white px-4 py-2 rounded-md"
                >
                  {expanded ? 'Ocultar turnos' : `Mostrar ${turnosCliente.length - 1} turnos adicionales`}
                </button>
                {expanded && (
                  <div className="bg-violet-300  rounded-lg p-2 h-auto flex flex-col gap-4">
                    {turnosCliente.slice(1).map((turno, index) => (
                      <div key={index + 1} className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">{formatDate(turno.selectedDate)}</h2>
                        <ul>
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
                            <span className={`py-1 rounded-lg ${turno.estadoDelTurno === 'confirmar' ? 'bg-red-500' : turno.estadoDelTurno === 'buscado' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                              {turno.estadoDelTurno === 'confirmar' ? 'Confirmar - Recibirá un llamado.' : turno.estadoDelTurno === 'buscado' ? 'En la Peluquería' : 'Confirmado - El servicio se realizará sin problemas.'}
                            </span>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    );
  }
  