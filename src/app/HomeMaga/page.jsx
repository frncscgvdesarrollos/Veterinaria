'use client'
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getTurnosPeluqueria, getTurnosPeluqueriaBuscar } from '../firebase';
import LlamarA from '../components/llamarA';

export default function Page() {
    const { user } = UserAuth();
    const uid = user?.uid;

    const [turnos, setTurnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [turnosTransporte, setTurnosTransporte] = useState([]);
    const [isLoadingTransporte, setIsLoadingTransporte] = useState(true);

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

    useEffect(() => {
        const fetchData = () => {
            getTurnosPeluqueriaBuscar()
                .then(data => {
                    setTurnosTransporte(data);
                    setIsLoadingTransporte(false);
                })
                .catch(error => {
                    console.error('Error fetching turnos:', error);
                });
        };

        if (isLoading) {
            fetchData();
        }
    }, [isLoadingTransporte]);

    // Filtrar los turnos por mañana y tarde
    const turnosManana = turnos.filter(turno => turno.selectedTurno === 'mañana');
    const turnosTarde = turnos.filter(turno => turno.selectedTurno === 'tarde');
    const turnosOrdenados = [...turnosManana, ...turnosTarde];

    const actualizarEstadoPeluqueria = (id, estadoActual) => {
        if (estadoActual === "En Peluqueria") {
            postNuevoEstadoPeluqueria(id)
                .then(() => setIsLoading(true))
                .catch(error => console.error('Error al actualizar estado de peluquería:', error));
        }
    };

    return (
        <div>
            {uid === "L6nqm2J1UuZCmZ4dS5K7Mhonxx42" || uid === "fgGyxXX05NNN5aMakZ7mRChW0gY2" ? (
            <div>
                    <h1 className='text-xl font-bold text-cyan-800'>Oficina</h1>
                    <div className='grid grid-cols-2 gap-4 p-16'>
                        <div className='col-span-1 bg-red-300 '>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {turnos.map(turno => (
                                        <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.direccion}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${turno.estadoTransporte === 'buscar' || turno.estadoTransporte === 'buscado' || turno.estadoTransporte === 'En Veterinaria' ? 'bg-red-500 text-yellow-300' : 'bg-orange-500 text-yellow-300'}`}>
                                                <div className={turno.estadoTransporte === "esperando" ? 'bg-blue-300': 'bg-orange-300'}>
                                                {turno.estadoTransporte}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        <div className='col-span-3 bg-green-300 '>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corte</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Largo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3"></th> {/* Celda extra para el botón */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {turnosOrdenados.map(turno => (
                                        <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.corte}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.largo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.estadoPeluqueria}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <LlamarA/>
                </div>
            ) : null}
        </div>
    );
}
