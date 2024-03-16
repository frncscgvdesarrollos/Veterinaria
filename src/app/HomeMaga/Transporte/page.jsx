'use client'
import { useState, useEffect } from 'react';
import { postNuevoEstadoTransporte, getTurnosPeluqueriaBuscar } from '../../firebase';

function TransporteHome() {
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTurnosPeluqueriaBuscar();
        setTurnos(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching turnos:', error);
      }
    };

    if (isLoading) {
      fetchData();
    }
  }, [isLoading]);

  const handleEstadoUpdate = async (id) => {
    try {
      await postNuevoEstadoTransporte(id);
      // Actualizar el estado local después de la actualización exitosa
      setTurnos(turnos.map(turno => {
        if (turno.id === id) {
          // Cambiar el estado según la lógica requerida
          turno.estadoTransporte = turno.estadoTransporte === "buscar" ? "buscado" : "En Veterinaria";
        }
        return turno;
      }));
    } catch (error) {
      console.error('Error updating turno:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-3xl font-bold underline text-center mb-6">Transporte</h1>
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
              <th>Proximo estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {turnos.map(turno => (
              <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                <td className="px-6 py-4 whitespace-nowrap">{turno.id + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{turno.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{turno.apellido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{turno.direccion}</td>
                <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${turno.estadoTransporte === 'buscar' || turno.estadoTransporte === 'buscado' || turno.estadoTransporte === 'En Veterinaria' ? 'bg-red-500 text-yellow-300' : 'bg-orange-500 text-yellow-300'}`}>
                  {turno.estadoTransporte}
                </td>
                <td>
                  {turno.estadoTransporte === 'buscar' || turno.estadoTransporte === 'buscado' || turno.estadoTransporte === 'En Veterinaria' ? (
                    <button className='btn' onClick={() => handleEstadoUpdate(turno.id)}>
                      {turno.estadoTransporte === 'buscar' ? 'Buscado' : 'En veterinaria'}
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransporteHome;
