'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { avanzarEstadoTurno, cancelarTurnoPeluqueria, getTurnosPeluqueria } from '../../firebase';

export default function LlamarA() {
  const [turnosParaHoy, setTurnosParaHoy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    getTurnosPeluqueria()
      .then(turnos => {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Obtener la fecha de mañana
        const todayAt6pm = new Date(today);
        todayAt6pm.setHours(18, 0, 0, 0); // Establecer la hora a las 6 de la tarde de hoy
        const turnosParaHoy = turnos.filter(turno => {
          const turnoDate = turno.selectedDate.toDate ? turno.selectedDate.toDate() : new Date(turno.selectedDate);
          return turnoDate >= todayAt6pm && turnoDate < tomorrow && turno.estadoDelTurno === "confirmar";
        });

        setTurnosParaHoy(turnosParaHoy);
        setIsLoading(true);
      })
      .catch(error => {
        console.error("Error al obtener los turnos para hoy:", error);
      });
  }, [isLoading]);

  const confirmarTurno = useCallback((id) => {
    avanzarEstadoTurno(id).then(() => {
      setTurnosParaHoy(prevTurnos => prevTurnos.filter(turno => turno.id !== id));
    });
  }, []);

  const cancelarTurno = useCallback((id) => {
    cancelarTurnoPeluqueria(id).then(() => {
      setTurnosParaHoy(prevTurnos => prevTurnos.filter(turno => turno.id !== id));
    });
  }, []);

  const turnosManana = turnosParaHoy.filter(turno => turno.selectedTurno === "mañana");
  const turnosTarde = turnosParaHoy.filter(turno => turno.selectedTurno === "tarde");

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Turnos para mañana</h1>
      <div className="grid gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Turnos para la mañana:</h2>
          {turnosManana.map((turno, index) => (
            <div key={turno.id} className="bg-violet-300 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:gap-4">
                <div className="flex gap-2 md:flex-row md:gap-2 text-purple-800">
                  <p className="text-lg mb-2 md:text-xl">{`${index + 1}. ${turno.nombre}`}</p>
                  <p className="text-lg md:text-xl">{turno.telefono}</p>
                </div>
                <div className="flex gap-2 md:flex-row md:gap-2 text-purple-800">
                  <p className="text-lg md:text-xl">{turno.selectedPet}</p>
                  <p className="text-lg md:text-xl">{turno.selectedTurno}</p>
                  <p className="text-lg md:text-xl">{turno.precio}</p>
                </div>
                <div className="flex gap-2 md:gap-4 ml-auto">
                  <button onClick={() => confirmarTurno(turno.id)} className="bg-blue-600 text-white rounded-lg py-2 px-4 md:py-3 md:px-6 text-base md:text-lg">Confirmar</button>
                  <button onClick={() => cancelarTurno(turno.id)} className="bg-red-600 text-white rounded-lg py-2 px-4 md:py-3 md:px-6 text-base md:text-lg">Cancelar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Turnos para la tarde:</h2>
          {turnosTarde.map((turno, index) => (
            <div key={turno.id} className="bg-violet-300 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:gap-4">
                <div className="flex gap-2 md:flex-row md:gap-2 text-purple-800">
                  <p className="text-lg mb-2 md:text-xl">{`${index + 1}. ${turno.nombre}`}</p>
                  <p className="text-lg md:text-xl">{turno.telefono}</p>
                </div>
                <div className="flex gap-2 md:flex-row md:gap-2 text-purple-800">
                  <p className="text-lg md:text-xl">{turno.selectedPet}</p>
                  <p className="text-lg md:text-xl">{turno.selectedTurno}</p>
                  <p className="text-lg md:text-xl">{turno.precio}</p>
                </div>
                <div className="flex gap-2 md:gap-4 ml-auto">
                  <button onClick={() => confirmarTurno(turno.id)} className="bg-blue-600 text-white rounded-lg py-2 px-4 md:py-3 md:px-6 text-base md:text-lg">Confirmar</button>
                  <button onClick={() => cancelarTurno(turno.id)} className="bg-red-600 text-white rounded-lg py-2 px-4 md:py-3 md:px-6 text-base md:text-lg">Cancelar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
