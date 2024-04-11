'use client'
import React, { useState, useEffect } from 'react';
import { avanzarEstadoTurno, cancelarTurnoPeluqueria, getTurnosPeluqueria } from '../firebase';

export default function LlamarA() {
  const [turnosParaHoy, setTurnosParaHoy] = useState([]);

  useEffect(() => {
    getTurnosPeluqueria()
      .then(turnos => {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Obtener la fecha de mañana
        const todayAt6pm = new Date(today);
        todayAt6pm.setHours(18, 0, 0, 0); // Establecer la hora a las 6 de la tarde de hoy
  
        const tomorrowAt6pm = new Date(tomorrow);
        tomorrowAt6pm.setHours(18, 0, 0, 0); // Establecer la hora a las 6 de la tarde de mañana
  
        const turnosParaHoy = turnos.filter(turno => {
          const turnoDate = turno.selectedDate.toDate ? turno.selectedDate.toDate() : new Date(turno.selectedDate);
          return turnoDate >= todayAt6pm && turnoDate < tomorrowAt6pm;
        });
  
        setTurnosParaHoy(turnosParaHoy);
      })
      .catch(error => {
        console.error("Error al obtener los turnos para hoy:", error);
      });
  }, []);
  

  const confirmarTurno = (id) => {
    avanzarEstadoTurno(id).then(() => {
      window.location.reload();
    })
  };

  const cancelarTurno = (id) => {
    cancelarTurnoPeluqueria(id);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Turnos para hoy</h1>
      {turnosParaHoy.map(turno => (
        turno.estadoDelTurno === "confirmar" && (
          <div key={turno.id} className="bg-violet-300 rounded-lg p-4 flex justify-between">
            <div className="flex flex-row gap-4 text-purple-800 m-2">
              <p className="text-lg mb-2">{turno.nombre}</p>
              <p className="text-lg">{turno.telefono}</p>
              <p className="text-lg">{turno.selectedPet}</p>
              <p className="text-lg">{turno.precio}</p>
              <p className="text-lg">{turno.pago}</p>
              <p className="text-lg">{turno.selectedTurno}</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <button onClick={() => confirmarTurno(turno.id)} className="bg-blue-600 text-white rounded-lg py-2 px-6 md:py-3 md:px-8">Confirmar</button> 
              <button onClick={() => cancelarTurno(turno.id)} className="bg-red-600 text-white rounded-lg py-2 px-6 md:py-3 md:px-8">Cancelar</button>
            </div>
          </div>
        )
      ))}
    </div>
  );
}
