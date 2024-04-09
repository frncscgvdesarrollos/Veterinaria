'use client';
import { useState, useEffect } from 'react';
import { getTurnosPeluqueria, avanzarEstadoTurno, updateCanil } from '../../firebase';

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
            case 'veterinaria':
                proximoEstado = 'proceso';
                break;
            case 'proceso':
                proximoEstado = 'Finalizado';
                break;
            default:
                proximoEstado = '';
        }

        avanzarEstadoTurno(id)
            .then(() => {
                setIsLoading(true);
                setTurnos(turnos.map(turno => {
                    if (turno.id === id) {
                        turno.estadoDelTurno = proximoEstado;
                    }
                    return turno;
                }));
            })
            .catch(error => {
                console.error('Error updating turno:', error);
            });
    };

    const handleUpdateCanil = (id, newCanil) => {
        updateCanil(id, newCanil)
            .then(() => {
                console.log('Canil updated successfully.');
                setIsLoading(true); // Esto recargará los datos después de cambiar el canil
            })
            .catch(error => {
                console.error('Error updating canil:', error);
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canil</th>
                            <th className="px-6 py-3">Proximo estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {turnos.map((turno, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.corte}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.largo}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>{turno.estadoDelTurno}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={turno.canilPeluqueria}
                                        onChange={(e) => handleUpdateCanil(turno.id, e.target.value)}
                                    >
                                        {["1"," 2","3", "4", "5", "6", "7"].map((canilNumber) => (
                                            <option key={canilNumber} value={canilNumber}>
                                                Canil {canilNumber}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className='flex justify-center'>
                                    {turno.estadoDelTurno === "veterinaria" &&
                                        <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-red-500 p-2 m-2 text-white'>En proceso</button>
                                    }
                                    {turno.estadoDelTurno === "proceso" &&
                                        <button onClick={() => handleEstadoUpdate(turno.id, turno.estadoDelTurno)} className='bg-red-500 p-2 m-2 text-white'>Terminado</button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
