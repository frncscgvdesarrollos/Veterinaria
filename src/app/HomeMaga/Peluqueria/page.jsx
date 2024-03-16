'use client';
import { useState, useEffect } from 'react';
import { getTurnosPeluqueriaEsperando } from '../../firebase';

export default function Peluqueria() {
    
    const [turnos, setTurnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = () => {
        getTurnosPeluqueriaEsperando()
          .then(data => {
            setTurnos(data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching turnos:', error);
          });
      };
  
      if (isLoading) {
        fetchData();
      }
    }, [isLoading]);
  
    // Filtrar los turnos por mañana y tarde
    const turnosManana = turnos.filter(turno => turno.selectedTurno === 'mañana');
    const turnosTarde = turnos.filter(turno => turno.selectedTurno === 'tarde');
    const turnosOrdenados = [...turnosManana, ...turnosTarde];
  
    return (
      <div className="bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-bold underline text-center mb-6">Peluquería</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {turnosOrdenados.map(turno => (
                <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.id + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                {turno.estadoPeluqueria === "esperando" || turno.estadoPeluqueria === "En Peluqueria" || turno.estadoPeluqueria === "Finalizado" ?
                <td className='px-6 py-4 whitespace-nowrap'>{turno.estadoPeluqueria}</td>    
                :  null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

