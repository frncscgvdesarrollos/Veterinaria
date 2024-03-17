'use client'
import { useState, useEffect } from 'react';
import { avanzarEstadoTurno, cancelarTurnoPeluqueria, getTurnosPeluqueria } from '../firebase';
import { redirect } from 'next/navigation'; 
export default function LlamarA() {
    const [turnosAConfirmar, setTurnosAConfirmar] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function handleTurnos() {
        return new Promise((resolve, reject) => {
            getTurnosPeluqueria()
                .then(turnos => {
                    setTurnosAConfirmar(turnos);
                    resolve(turnos);
                })
                .catch(error => {
                    console.error('Error al obtener los turnos a confirmar:', error);
                    reject(error);
                });
        });
    }

    useEffect(() => {
        if (isLoading) {
            handleTurnos()
                .then(() => setIsLoading(false))
                .catch(error => console.error('Error al cargar los turnos:', error));
        }
    }, [isLoading]);

    function handleConfirmar(id) {
       return new Promise((resolve, reject) => {
            avanzarEstadoTurno(id)
                .then(() => {
                    // Actualizar la lista de turnos después de la confirmación
                    setTurnosAConfirmar(turnosAConfirmar.filter(turno => turno.id !== id));
                    resolve(setTimeout(() => window.location.reload(), 10000));
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
            <h3>Llamar a :</h3>
            {turnosAConfirmar.map((turno) => (
                <div key={turno.id} className='flex justify-space-around items-center'>
                {turno.estadoDelTurno != "confirmar" ? null :
                <>
                    <li className='w-1/3'>{turno.nombre}</li>
                    <li className='w-1/3'>{turno.telefono}</li>
                    <span className='w-1/3'>
                        {turno.estadoDelTurno === "confirmar" &&
                            <div className='flex justify-around'>
                                <button onClick={() => handleConfirmar(turno.id)} className='bg-blue-500 text-white rounded-lg p-4 m-2'>Confirmar</button>
                                <button onClick={() => handleCancelar(turno.id)} className='bg-red-500 text-yellow-300 rounded-lg p-4 m-2'>Cancelar</button>
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
