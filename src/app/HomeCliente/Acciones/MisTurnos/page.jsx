'use client';
import { useState, useEffect, useMemo, memo } from 'react';
import { getMisTurnos, registroVenta, confirmarPagos } from '@/app/firebase';
import { UserAuth } from '@/app/context/AuthContext';
import { useSearchParams } from 'next/navigation';

// Función para agrupar los turnos por fecha
function groupTurnosByDate(turnos) {
  return turnos.reduce((turnosPorFecha, turno) => {
    const fecha = new Date(turno.selectedDate.seconds * 1000).toLocaleDateString();
    turnosPorFecha[fecha] = turnosPorFecha[fecha] || [];
    turnosPorFecha[fecha].push(turno);
    return turnosPorFecha;
  }, {});
}

// Componente para mostrar los turnos de una fecha en una tabla
const TurnosPorFecha = memo(({ turnos }) => {
  TurnosPorFecha.displayName = 'TurnosPorFecha'; // Agregar nombre de visualización

  return (
    <div className="mb-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Mascota</th>
            <th className="px-4 py-2">Estado del pago</th>
            <th className="px-4 py-2">Transporte</th>
            <th className="px-4 py-2">Dirección de retiro</th>
            <th className="px-4 py-2">Estado del turno</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno, index) => (
            <tr key={index} className="border border-gray-800 bg-violet-200 rounded-lg text-xl">
              <td className="px-4 py-2">{turno.selectedPet}</td>
              <td className="px-4 py-2">{turno.pago ? 'Pagado' : 'No pagado'}</td>
              <td className="px-4 py-2">{turno.transporte ? 'Con transporte' : 'Sin transporte'}</td>
              <td className="px-4 py-2">{turno.direccion || '-'}</td>
              <td className={`px-4 py-2 ${turno.estadoDelTurno === 'confirmar' ? 'bg-red-500' : turno.estadoDelTurno === 'buscado' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {turno.estadoDelTurno === 'confirmar' ? 'Confirmar - Recibirá un llamado de la veterinaria.' : turno.estadoDelTurno === 'buscado' ? 'En la Peluquería' : 'Confirmado - El servicio se realizará sin problemas.'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// Componente principal MisTurnos
export default function MisTurnos() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [turnosCliente, setTurnosCliente] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const status = searchParams.get('collection_status');

  const turnosPorFecha = useMemo(() => groupTurnosByDate(turnosCliente), [turnosCliente]);

  const fetchTurnos = async () => {
    setIsLoading(true);
    try {
      const turnos = await getMisTurnos(uid);
      setTurnosCliente(turnos);
    } catch (error) {
      setError('Error al obtener los turnos');
      console.error('Error fetching turnos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    try {
      await confirmarPagos(uid);
      await registroVenta(uid);
    } catch (error) {
      setError('Error al confirmar el pago');
      console.error('Error confirming payment:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        await fetchTurnos();
      }
      if (status === 'approved') {
        await handlePaymentConfirmation();
      }
    };

    const fetchDataWrapper = () => {
      fetchData();
    };
    fetchDataWrapper();
  }, [uid, status]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Mis turnos de peluquería</h1>
      <div className="bg-violet-300 rounded-lg p-4">
        {Object.entries(turnosPorFecha).map(([fecha, turnos], index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold mt-4 mb-2">{fecha}</h2>
            <TurnosPorFecha turnos={turnos} />
          </div>
        ))}
      </div>
    </div>
  );
}