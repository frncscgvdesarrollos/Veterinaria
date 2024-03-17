'use client';
import { useState, useEffect } from 'react';
import { getTurnosPeluqueria, avanzarEstadoTurno } from '../../firebase';

export default function Peluqueria() {
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
            case 'En Peluqueria':
                proximoEstado = 'Finalizado';
                break;
            default:
                proximoEstado = '';
        }

        avanzarEstadoTurno(id)
            .then(() => {
                setIsLoading(true)
                setTurnos(turnos.map(turno => {
                    if (turno.id === id) {
                        turno.estadoPeluqueria = proximoEstado;
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
            <h1 className="text-3xl font-bold underline text-center mb-6">Peluquería</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corte</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Largo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3">Proximo estado</th> {/* Celda extra para el botón */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {turnos.map(turno => (
                            <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                                {turno.estadoDelTurno != "confirmar" &&  turno.estadoDelTurno != "finalizado" ?
                                <> 
                                <td className="px-6 py-4 whitespace-nowrap">{turno.id + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.corte}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.largo}</td>
                                {/*Renderizado del estado Actual*/}
                                    {turno.estadoDelTurno === "confirmado" ?
                                    <td className="px-6 py-4 whitespace-nowrap">Esperando</td>
                                    : turno.estadoDelTurno === "buscado" ? 
                                    <td className='px-6 py-4 whitespace-nowrap'>Esperando</td>
                                    : turno.estadoDelTurno === "veterinaria" ?
                                    <td className='px-6 py-4 whitespace-nowrap'>En Peluqueria</td>
                                    : turno.estadoDelTurno === "proceso" ?
                                    <td className='px-6 py-4 whitespace-nowrap'>En Proceso</td>
                                    : turno.estadoDelTurno === "devolver" ?
                                    <td className='px-6 py-4 whitespace-nowrap'>Finalizado</td>
                                    : turno.estadoDelTurno === "devolviendo" ?
                                    <td className='px-6 py-4 whitespace-nowrap'>Finalizado</td>
                                    :null}
                                
                                <td>
                                    {/* Renderización condicional del botón o span */}
                                    {turno.estadoDelTurno === "confirmado" ?
                                    <p className='bg-blue-500 p-2 m-2 text-black' >Esperando</p>
                                    :turno.estadoDelTurno === "buscado" ?
                                    <p className='bg-blue-500 p-2 m-2 text-black' >Esperando</p>
                                    :turno.estadoDelTurno === "veterinaria" ?
                                    <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-red-500 p-2 m-2 text-white' >En proceso</button>
                                    :turno.estadoDelTurno === "proceso" ?
                                    <button onClick={()=> handleEstadoUpdate(turno.id)} className='bg-red-500 p-2 m-2 text-white' >Terminado</button>
                                    :null
                                }
                                </td>
                                </>
                                :null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
