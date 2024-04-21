'use client';
import React, { useState, useEffect } from 'react';
import { getTurnosChekeo2 } from '@/app/firebase';

export default function Page() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    getTurnosChekeo2().then(turno => {
      setTurnos(turno);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  // Función para filtrar los turnos por día de la semana
  const filtrarTurnosPorDia = (dia) => {
    return turnos.filter(turno => {
      const fecha = new Date(turno.selectedDate);
      return fecha.getDay() === dia - 1; // Restar 1 para que el domingo sea el último día
    });
  };

  // Función para obtener el nombre y el número del próximo día de la semana
  const obtenerProximoDia = (dia) => {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoy = new Date();
    let proximoDia = new Date(hoy.setDate(hoy.getDate() + dia));
    return `${diasSemana[proximoDia.getDay()]} - ${proximoDia.getDate()}`;
  };

  return (
    <div className="bg-purple-100 min-h-screen py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Turnos Veterinaria</h1>

      <div className="flex flex-col w-2/5 bg-violet-300 bg-opacity-50 p-8 ml-10 rounded-lg">
        {[2, 3, 4, 5, 6].map((dia) => (
          <div key={dia} className="overflow-x-auto mb-8">
            <h2 className="text-xl font-semibold mb-4">{obtenerProximoDia(dia)}</h2>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-purple-300 text-white">
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Info</th>
                  <th className="px-4 py-2">Transporte</th>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Pago</th>
                  <th className="px-4 py-2">Precio</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Ubicación</th>
                  <th className="px-4 py-2">Mascota</th>
                  <th className="px-4 py-2">Hora</th>
                  <th className="px-4 py-2">Teléfono</th>
                  <th className="px-4 py-2">Transporte Necesario</th>
                  <th className="px-4 py-2">ID de Usuario</th>
                </tr>
              </thead>
              <tbody>
                {filtrarTurnosPorDia(dia).map((turno, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-violet-200' : 'bg-pink-100 '}>
                    <td className="border">{turno.estadoDelTurno}</td>
                    <td className="border">{turno.info}</td>
                    <td className="border">{turno.needPickup ? 'Sí' : 'No'}</td>
                    <td className="border">{turno.nombre}</td>
                    <td className="border">{turno.pago ? 'Sí' : 'No'}</td>
                    <td className="border">{turno.precio}</td>
                    <td className="border">{new Date(turno.selectedDate).toLocaleString()}</td>
                    <td className="border">{turno.selectedLocation}</td>
                    <td className="border">{turno.selectedPet}</td>
                    <td className="border">{turno.selectedTime}</td>
                    <td className="border">{turno.telefono}</td>
                    <td className="border">{turno.transporte ? 'Sí' : 'No'}</td>
                    <td className="border">{turno.usuarioId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
