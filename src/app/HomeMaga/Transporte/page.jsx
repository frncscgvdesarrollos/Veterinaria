'use client';
import { useState, useEffect } from 'react';
import { avanzarEstadoTurno, getTurnosPeluqueria, ventasEntregar, cancelarEntrega, entregarVenta } from '../../firebase';
import Image from 'next/image';

export default function TransporteHome() {
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ventas, setVentas] = useState([]);

  function handleVentas() {
    ventasEntregar()
      .then(data => {
        const filteredVentas = data.filter(venta => venta.entregar === "entregar");
        setVentas(filteredVentas);
      })
      .catch(error => {
        console.error('Error fetching ventas:', error);
      });
  }

  function handleCancelarEntrega(id) {
    cancelarEntrega(id)
      .then(() => {
        alert('Entrega cancelada correctamente, volver el pedido a la veterinaria');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error cancelando entrega:', error);
      });
  }

  function handleEntregarVenta(id) {
    entregarVenta(id)
      .then(() => {
        alert('Entrega realizada correctamente');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error entregando venta:', error);
      });
  }

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

    handleVentas();
  }, [isLoading , ventas]);

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
    <div className="bg-purple-200 p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg">
      <h1 className="text-3xl font-bold underline text-center mb-6">Transporte</h1>
      
        <h1 className="text-xl font-bold">Turno mañana</h1>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Esquina</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Canil</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">{turno.esquina}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><Image src={turno.foto} alt="canil" width={50} height={50} className='rounded-full' /></td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.canilPeluqueria}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.pago ? "Si" : `Cobrar: ${turno.precio}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.estadoDelTurno}</td>
                  <td>
                    {turno.estadoDelTurno === "confirmado" &&
                      <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-blue-500 p-2 m-2 text-white'>Buscado</button>
                    }
                    {turno.estadoDelTurno === "buscado" &&
                      <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-cyan-500 p-2 m-2 text-white'>En Veterinaria</button>
                    }
                    {turno.estadoDelTurno === "En Veterinaria" &&
                      <p className='bg-ambar-500 p-2 m-2 text-black'>Esperando</p>
                    }
                    {turno.estadoDelTurno === "esperando" &&
                      <p className='bg-violet-500 p-2 m-2 text-white'>Esperando</p>
                    }
                    {turno.estadoDelTurno === "devolver" &&
                      <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-orange-500 p-2 m-2 text-white'>Devolviendo</button>
                    }
                    {turno.estadoDelTurno === "devolviendo" &&
                      <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-red-500 p-2 m-2 text-white'>Finalizar</button>
                    }
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>



        <h1 className="text-xl font-bold">Turno tarde</h1>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Esquina</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Canil</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th>Próximo estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {turnos.map(turno => (
              (turno.estadoDelTurno !== 'confirmar' && turno.estadoDelTurno !== 'finalizado' && turno.estadoDelTurno !== 'cancelado' && turno.selectedTurno === 'tarde') && (
                <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.esquina}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><Image src={turno.foto} alt="canil" width={50} height={50} className='rounded-full' /></td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.canilPeluqueria}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.pago ? "Si" : `Cobrar: ${turno.precio}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{turno.estadoDelTurno}</td>
                  <td>
                    {turno.estadoDelTurno === "confirmado" &&
                      <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-blue-500 p-2 m-2 text-white'>Buscado</button>
                    }
                    {turno.estadoDelTurno === "buscado" &&
                      <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-cyan-500 p-2 m-2 text-white'>En Veterinaria</button>
                    }
                    {turno.estadoDelTurno === "En Veterinaria" &&
                      <p className='bg-ambar-500 p-2 m-2 text-black'>Esperando</p>
                    }
                    {turno.estadoDelTurno === "esperando" &&
                      <p className='bg-violet-500 p-2 m-2 text-white'>Esperando</p>
                    }
                    {turno.estadoDelTurno === "devolver" &&
                      <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-orange-500 p-2 m-2 text-white'>Devolviendo</button>
                    }
                    {turno.estadoDelTurno === "devolviendo" &&
                      <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-red-500 p-2 m-2 text-white'>Finalizar</button>
                    }
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>



        <h1 className="text-xl font-bold">Ventas a Entregar</h1>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cobrar</th>      
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ventas.map((venta, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'}>
                <td className="px-6 py-4 whitespace-nowrap">{venta.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {venta.items.map((item, index) => (
                    <div key={index}>
                      <span>{item.nombre} : {item.cantidad}</span>
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{venta.direccion}</td>
                <td className="px-6 py-4 whitespace-nowrap">{venta.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap">{venta.entregar}</td>
                <td className='px-6 py-4 whitespace-nowrap '>{venta.efectivo ? `$${venta.precio}	` : "ya esta pago"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center items-center gap-4">
                    <button onClick={() => handleEntregarVenta(venta.id)} className="bg-green-500 p-2 m-2 text-white">Entregar</button>
                    <button onClick={() => handleCancelarEntrega(venta.id)} className="bg-red-500 p-2 m-2 text-white">Cancelar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  );
}
