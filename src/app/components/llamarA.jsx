'use client'
import React, { useState, useEffect } from 'react';
import { avanzarEstadoTurno, cancelarTurnoPeluqueria, getTurnosPeluqueria } from '../firebase';

export default function LlamarA() {
    const [turnosAConfirmar, setTurnosAConfirmar] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Obtener la fecha actual
    const currentDate = new Date();

    // Calcular la fecha del día anterior a las 18:00 horas
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    yesterday.setHours(18, 0, 0, 0); // Establecer las 18:00 horas del día anterior

    useEffect(() => {
        if (isLoading) {
            handleTurnos()
                .then(() => setIsLoading(false))
                .catch(error => console.error('Error al cargar los turnos:', error));
        }
    }, [isLoading]);

    function handleTurnos() {
        return new Promise((resolve, reject) => {
            getTurnosPeluqueria()
                .then(turnos => {
                    // Filtrar los turnos desde las 18:00 del día anterior hasta la fecha y hora actual
                    const filteredTurnos = turnos.filter(turno => {
                        const turnoDate = new Date(turno.selectedDate);
                        return turnoDate >= yesterday && turnoDate <= currentDate;
                    });
                    setTurnosAConfirmar(filteredTurnos);
                    resolve(filteredTurnos);
                })
                .catch(error => {
                    console.error('Error al obtener los turnos a confirmar:', error);
                    reject(error);
                });
        });
    }

    function handleConfirmar(id) {
        return new Promise((resolve, reject) => {
            avanzarEstadoTurno(id)
                .then(() => {
                    // Actualizar la lista de turnos después de la confirmación
                    setTurnosAConfirmar(turnosAConfirmar.filter(turno => turno.id !== id));
                    resolve();
                })
                .catch(error => {
                    console.error('Error al confirmar el turno:', error);
                    reject(error);
                });
        });
    }

    function handleCancelar(id) {
        return new Promise((resolve, reject) => {
            cancelarTurnoPeluqueria(id)
                .then(() => {
                    // Actualizar la lista de turnos después de la cancelación
                    setTurnosAConfirmar(turnosAConfirmar.filter(turno => turno.id !== id));
                    resolve();
                })
                .catch(error => {
                    console.error('Error al cancelar el turno:', error);
                    reject(error);
                });
        });
    }

    return (
        <div className='w-full m-auto p-4 bg-violet-300 rounded-lg'>
            {turnosAConfirmar.map((turno) => (
                <div key={turno.id} className='flex justify-space-around items-center'>
                    {turno.estadoDelTurno !== "confirmar" ? null :
                        <>
                            <div className='flex  mr-auto justify-around items-center'>
                                <span className='w-1/3 mx-2 '>{turno.nombre}</span>
                                <span className='w-1/3 mx-2 '>{turno.telefono}</span>
                            </div>
                            <span className='w-1/3'>
                                {turno.estadoDelTurno === "confirmar" &&
                                    <div className='flex mr-auto justify-around'>
                                        <button onClick={() => handleConfirmar(turno.id)} className='bg-blue-500 text-white rounded-lg p-2 m-2'>Confirmar</button>
                                        <button onClick={() => handleCancelar(turno.id)} className='bg-red-500 text-yellow-300 rounded-lg p-2 m-2'>Cancelar</button>
                                    </div>
                                }
                            </span>
                        </>
                    }
                </div>
            ))}
        </div>
    );
}
