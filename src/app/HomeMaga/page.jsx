'use client'
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getTurnosPeluqueria } from '../firebase'; // Suponiendo que existen funciones para obtener los turnos de peluquería y transporte
import LlamarA from '../components/admin/llamarA';
import TurnosParaMañana from '../components/admin/TurnosParaMañana';
import Caja from './caja/page';

export default function Page() {
    const { user } = UserAuth();
    const uid = user?.uid;

    const [turnosPeluqueria, setTurnosPeluqueria] = useState([]);
    const [isLoadingPeluqueria, setIsLoadingPeluqueria] = useState(true);

    useEffect(() => {
        const fetchTurnosPeluqueria = () => {
            getTurnosPeluqueria()
                .then(data => {
                    setTurnosPeluqueria(data);
                    setIsLoadingPeluqueria(false);
                })
                .catch(error => {
                    console.error('Error fetching turnos de peluquería:', error);
                    setIsLoadingPeluqueria(false);
                });
        };

        if (isLoadingPeluqueria) {
            fetchTurnosPeluqueria();
        }
    }, [isLoadingPeluqueria]);

    return (
        <div className="container mx-auto grid grid-cols-1 bg-purple-200 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-violet-100 shadow-md rounded-md overflow-hidden bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-lg font-bold text-cyan-800 mb-4">Llamar para confirmar</h2>
                <LlamarA />
            </div>
                <Caja />
            {uid === process.env.NEXT_PUBLIC_ADMIN_UID && 
            <div className="col-span-1 order-first md:order-none bg-white shadow-md rounded-md overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-100">
                Caja
            </div>
            }
            <div className="col-span-3 bg-violet-100 shadow-md rounded-md overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10 overflow-x-auto">
                <h1 className="text-2xl sm:text-lg font-bold text-cyan-800 mb-4">Transporte</h1>
                <div className="">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Esquina</th>
                                <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                                <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-violet-100 divide-y divide-gray-200">
                            {isLoadingPeluqueria ? (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap" colSpan="7">Cargando...</td>
                                </tr>
                            ) : (
                                turnosPeluqueria.map(turno => (
                                    (turno.estadoDelTurno !== 'confirmar' && turno.estadoDelTurno !== 'finalizado' && turno.estadoDelTurno !== 'cancelado' && turno.transporte) && (
                                        <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.direccion}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.esquina}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                                            {/* Renderizado del estado Actual */}
                                            {turno.estadoDelTurno === "confirmado" ?
                                                <td className="px-6 py-4 whitespace-nowrap">Buscar</td>
                                                : turno.estadoDelTurno === "buscado" ?
                                                    <td className='px-6 py-4 whitespace-nowrap'>Buscado</td>
                                                    : turno.estadoDelTurno === "veterinaria" ?
                                                        <td className='px-6 py-4 whitespace-nowrap'>Esperando</td>
                                                        : turno.estadoDelTurno === "proceso" ?
                                                            <td className='px-6 py-4 whitespace-nowrap'>esperando</td>
                                                            : turno.estadoDelTurno === "devolver" ?
                                                                <td className='px-6 py-4 whitespace-nowrap'>retirar</td>
                                                                : turno.estadoDelTurno === "devolviendo" ?
                                                                    <td className='px-6 py-4 whitespace-nowrap'>devolviendo</td>
                                                                    : null}
                                        </tr>
                                    )
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        
            <div className="col-span-3 bg-violet-100 shadow-md rounded-md overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-lg font-bold text-cyan-800 mb-4">Peluquería</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                            <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                            <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Corte</th>
                            <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Info</th>
                            <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Transporte</th>
                            <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoadingPeluqueria ? (
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap" colSpan="7">Cargando...</td>
                            </tr>
                        ) : (
                            turnosPeluqueria.map(turno => (
                                <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                                    {turno.estadoDelTurno === "confirmar" || turno.estadoDelTurno === "finalizado" || turno.estadoDelTurno === "cancelado" ?
                                        null
                                        : <>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.selectedTurno}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.selectedServicio}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.info}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{turno.transporte ? "Si" : "No"}</td>
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
                                                                    : null}
                                        </>
                                    }
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="col-span-3 bg-white shadow-md rounded-md overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-lg font-bold text-cyan-800 mb-4">Turnos Para Confirmar</h2>
                <TurnosParaMañana />
            </div>
        </div>
    );
};
