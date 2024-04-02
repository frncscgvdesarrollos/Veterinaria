'use client'
import React, { useState, useEffect } from 'react';
import { avanzarEstadoTurno, cancelarTurnoPeluqueria, getTurnosPeluqueria } from '../firebase';

export default function LlamarA() {
 const [turnosParaHoy, setTurnosParaHoy] = useState([]);

 function handleTurnos() {
   getTurnosPeluqueria().then(turnos => {
     const today = new Date(); // Obtener la fecha actual
     const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000); // Obtener la fecha del día anterior
     const yesterdayAt6pm = new Date(yesterday.setHours(18, 0, 0, 0)); // Establecer la hora a las 18:00 del día anterior

     const turnosParaHoy = turnos.filter(turno => {
       const turnoDate = new Date(turno.selectedDate.toDate());
       return turnoDate >= yesterdayAt6pm && turnoDate < yesterdayAt6pm.setDate(yesterdayAt6pm.getDate() + 1);
     });

     setTurnosParaHoy(turnosParaHoy);
   });
 }

 useEffect(() => {
   handleTurnos();
 }, []); // Nota el array vacío como segundo argumento

 return (
   <div>
     <h1>Turnos para hoy</h1>
     {turnosParaHoy.map(turno => turno.estadoDelTurno === 'confirmar' && (
       <div key={turno.id} className="flex bg-violet-300 justify-between p-2 rounded-lg my-2 text-gray-800">
         <p>{turno.nombre}</p>
         <p>{turno.telefono}</p>
        <div className='flex gap-2'>
         <button onClick={() => avanzarEstadoTurno(turno.id)} className='bg-blue-600 text-white rounded-lg p-2'>confirmar</button> 
        
         <button onClick={() => cancelarTurnoPeluqueria(turno.id)} className='bg-red-600 rounded-lg p-2 text-white'>cancelar</button>
        </div>
       </div>
     ))}
   </div>
 );
}