'use client';
import { useEffect, useState } from 'react';
import { getMisTurnos } from '../../../firebase';
import { UserAuth } from '@/app/context/AuthContext';

// Función para agrupar los turnos por fecha
function groupTurnosByDate(turnos) {
  const turnosPorFecha = {};
  turnos.forEach(turno => {
    const fecha = turno.selectedDate.toDate().toLocaleDateString();
    if (!turnosPorFecha[fecha]) {
      turnosPorFecha[fecha] = [];
    }
    turnosPorFecha[fecha].push(turno);
  });
  return turnosPorFecha;
}

// Función para convertir un objeto Timestamp a una cadena de fecha y hora legible
function convertirTimestampAFechaHora(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return date.toLocaleString(); // Puedes ajustar el formato según tus preferencias
}

// Componente para mostrar los turnos de una fecha en una tabla// Componente para mostrar los turnos de una fecha en una tabla
function TurnosPorFecha({ turnos }) {
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
              <td className="px-4 py-2">{turno.direccion ? turno.direccion : '-'}</td>
              <td className={`px-4 py-2 ${turno.estadoDelTurno === 'confirmar' ? 'bg-red-500' : turno.estadoDelTurno === 'buscado' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {turno.estadoDelTurno === 'confirmar' ?
                  'Confirmar - Recibirá un llamado de la veterinaria.'
                  : turno.estadoDelTurno === 'buscado' ?
                  'En la Peluquería'
                  : 'Confirmado - El servicio se realizará sin problemas.'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente principal MisTurnos
export default function MisTurnos() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [turnosCliente, setTurnosCliente] = useState([]);

  function getTurnos() {
    return new Promise((resolve, reject) => {
      getMisTurnos(uid)
        .then(result => {
          setTurnosCliente(result);
          if(!result) {
            reject(new Error('No se encontraron turnos'));
          }
        })
        .catch(error => {
          console.error('Error fetching turnos:', error);
          reject(error);
        });
    });
  }

  useEffect(() => {
    if (uid) {
      getTurnos();
    }
  }, [uid]);

  // Agrupar los turnos por fecha
  const turnosPorFecha = groupTurnosByDate(turnosCliente);

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

