'use client';
import { useState, useEffect } from 'react';
import { avanzarEstadoTurno, getTurnosPeluqueria } from '../../firebase';

function TransporteHome() {
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      getTurnosPeluqueria()
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

  const handleEstadoUpdate = (id, estadoActual) => {
    let proximoEstado;

    switch (estadoActual) {
      case 'buscar':
        proximoEstado = 'buscado';
        break;
      case 'buscado':
        proximoEstado = 'En Veterinaria';
        break;
      case 'En Veterinaria':
        proximoEstado = 'esperando';
        break;
      default:
        proximoEstado = '';
    }

    avanzarEstadoTurno(id)
      .then(() => {
        setIsLoading(true);
        setTurnos(prevTurnos => prevTurnos.map(turno => {
          if (turno.id === id) {
            return { ...turno, estadoDelTurno: proximoEstado };
          }
          return turno;
        }));
      })
      .catch(error => {
        console.error('Error updating turno:', error);
      });
  };
  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-3xl font-bold underline text-center mb-6">Transporte</h1>
      <div className="overflow-x-auto">
        <h1 className="text-xl font-bold">turno mañana</h1>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th>Próximo estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {turnos.map(turno => (
              (turno.estadoDelTurno !== 'confirmar' && turno.estadoDelTurno !== 'finalizado' && turno.estadoDelTurno !== 'cancelado' && turno.selectedTurno !== 'tarde') && (
                <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                  {/*Renderizado del estado Actual*/}
                  {turno.estadoDelTurno === "confirmado" ?
                  <td className="px-6 py-4 whitespace-nowrap">Buscar</td>
                  : turno.estadoDelTurno === "buscado" ? 
                  <td className='px-6 py-4 whitespace-nowrap'>Buscado</td>
                  : turno.estadoDelTurno === "veterinaria" ?
                  <td className='px-6 py-4 whitespace-nowrap'>Esperando</td>
                  : turno.estadoDelTurno === "proceso" ?
                  <td className='px-6 py-4 whitespace-nowrap'>esperando</td>
                  : turno.estadoDelTurno === "devolver" ?
                  <td className='px-6 py-4 whitespace-nowrap'>retirar</td>
                  : turno.estadoDelTurno === "devolviendo" ?
                  <td className='px-6 py-4 whitespace-nowrap'>devolviendo</td>
                  :null}
                  <td>
                    {/* Renderización condicional del botón o span */}
                    {turno.estadoDelTurno === "confirmado" ?
                      <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-blue-500 p-2 m-2 text-white' >Buscado</button>
                    :turno.estadoDelTurno === "buscado" ?
                    <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-cyan-500 p-2 m-2 text-white' >En Veterinaria</button>
                    :turno.estadoDelTurno === "veterinaria" ?
                    <p className='bg-ambar-500 p-2 m-2 text-black' >Retirar</p>
                    :turno.estadoDelTurno === "proceso" ?
                      <p className='bg-violet-500 p-2 m-2 text-white' >Retirar</p>
                    :turno.estadoDelTurno === "devolver" ?
                    <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-orange-500 p-2 m-2 text-white' >devolviendo</button>
                    :turno.estadoDelTurno === "devolviendo" ?
                    <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-red-500 p-2 m-2 text-white' >Finalizar</button>
                    :null
                  }
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <h1 className="text-xl font-bold">turno tarde</h1>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th>Próximo estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {turnos.map(turno => (
              (turno.estadoDelTurno !== 'confirmar' && turno.estadoDelTurno !== 'finalizado' && turno.estadoDelTurno !== 'cancelado' && turno.selectedTurno !== 'mañana') && (
                <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                  {/*Renderizado del estado Actual*/}
                  {turno.estadoDelTurno === "confirmado" ?
                  <td className="px-6 py-4 whitespace-nowrap">Buscar</td>
                  : turno.estadoDelTurno === "buscado" ? 
                  <td className='px-6 py-4 whitespace-nowrap'>Buscado</td>
                  : turno.estadoDelTurno === "veterinaria" ?
                  <td className='px-6 py-4 whitespace-nowrap'>Esperando</td>
                  : turno.estadoDelTurno === "proceso" ?
                  <td className='px-6 py-4 whitespace-nowrap'>esperando</td>
                  : turno.estadoDelTurno === "devolver" ?
                  <td className='px-6 py-4 whitespace-nowrap'>retirar</td>
                  : turno.estadoDelTurno === "devolviendo" ?
                  <td className='px-6 py-4 whitespace-nowrap'>devolviendo</td>
                  :null}
                  <td>
                    {/* Renderización condicional del botón o span */}
                    {turno.estadoDelTurno === "confirmado" ?
                      <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-blue-500 p-2 m-2 text-white' >Buscado</button>
                    :turno.estadoDelTurno === "buscado" ?
                    <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-cyan-500 p-2 m-2 text-white' >En Veterinaria</button>
                    :turno.estadoDelTurno === "veterinaria" ?
                    <p className='bg-ambar-500 p-2 m-2 text-black' >Retirar</p>
                    :turno.estadoDelTurno === "proceso" ?
                      <p className='bg-violet-500 p-2 m-2 text-white' >Retirar</p>
                    :turno.estadoDelTurno === "devolver" ?
                    <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-orange-500 p-2 m-2 text-white' >devolviendo</button>
                    :turno.estadoDelTurno === "devolviendo" ?
                    <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-red-500 p-2 m-2 text-white' >Finalizar</button>
                    :null
                  }
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransporteHome;
