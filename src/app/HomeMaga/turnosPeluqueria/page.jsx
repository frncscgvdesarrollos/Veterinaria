'use client';
import CargarTurnoPmanual from '@/app/components/CargarTurnoPmanual';
import { getTurnosPeluqueria } from '@/app/firebase';
import PrecioPeluqueria from '@/app/components/PrecioPeluqueria';
import React, { useState, useEffect } from 'react';

export default function VistaTurnosPeluqueriaVeterinaria() {
    const [turnos, setTurnos] = useState([]);
    const [turnosCargados, setTurnosCargados] = useState(false);

    const cargarTurnosPeluqueria = () => {
        getTurnosPeluqueria()
            .then(turnosPeluqueria => {
                setTurnos(turnosPeluqueria);
            })
            .catch(error => {
                console.log("No se pudo obtener los turnos de la peluqueria", error);
            });
    };
        
    useEffect(() => {
        if (!turnosCargados) {
            cargarTurnosPeluqueria();
            setTurnosCargados(true);
        }
    }, [turnosCargados]);

    const turnosHoy = turnos.filter(turno => new Date(turno.fecha).toDateString() === new Date().toDateString() && turno.estadoDelTurno !== "finalizado" && turno.estadoDelTurno !== "cancelado");
    const turnosFinalizados = turnos.filter(turno => new Date(turno.fecha).toDateString() === new Date().toDateString() && turno.estadoDelTurno === "finalizado");
    const turnosCancelados = turnos.filter(turno => new Date(turno.fecha).toDateString() === new Date().toDateString() && turno.estadoDelTurno === "cancelado");

    return (
        <div className='bg-purple-100 flex flex-col justify-center items-center py-8'>
            <PrecioPeluqueria />
            <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md flex flex-col md:flex-row md:space-x-8">
                <div className="w-full md:w-1/2 overflow-x-auto sm:rounded-lg">
                    <h1 className="text-2xl font-bold my-4 text-center underline text-purple-800 sm:text-left">Turnos de Peluquería para hoy:</h1>
                    <table className="w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Nombre</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Apellido</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Teléfono</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Dirección</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Turno</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {turnosHoy.map((turno, index) => (
                                <React.Fragment key={index}>
                                    <tr className={index % 2 === 0 ? 'bg-green-100' : 'bg-purple-200'}>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.nombre}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.apellido}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.telefono}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.direccion}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.selectedTurno}</td>
                                    </tr>
                                    <tr className={index % 2 === 0 ? 'bg-green-100' : 'bg-purple-200'}>
                                        <td colSpan="5" className="px-3 py-2 whitespace-nowrap">
                                            <span className="font-bold">Mascota:</span> {turno.selectedPet} | 
                                            <span className="font-bold"> Raza:</span> {turno.raza} | 
                                            <span className="font-bold"> Corte:</span> {turno.largo} | 
                                            <span className="font-bold"> Info:</span> {turno.info} | 
                                            <span className="font-bold"> Transporte:</span> {turno.transporte ? 'Sí' : 'No'} | 
                                            <span className={turno.pago ? 'text-green-600 bg-green-200 px-2 py-1 rounded-md' : 'text-yellow-200 bg-red-900 px-2 py-1 rounded-md'}>{turno.pago ? 'Pago: Sí' : 'Pago: No'}</span>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='w-full md:w-1/2 mt-8 md:mt-0'>
                    <CargarTurnoPmanual />
                </div>
            </div>
            <div className="container mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold my-4 text-center underline text-purple-800">Turnos finalizados:</h1>
                <table className="w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Nombre</th>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Apellido</th>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Teléfono</th>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Dirección</th>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Turno</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {turnosFinalizados.map((turno, index) => (
                            <React.Fragment key={index}>
                                <tr className={index % 2 === 0 ? 'bg-green-100' : 'bg-purple-200'}>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.nombre}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.apellido}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.telefono}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.direccion}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.selectedTurno}</td>
                                </tr>
                                <tr className={index % 2 === 0 ? 'bg-green-100' : 'bg-purple-200'}>
                                    <td colSpan="5" className="px-3 py-2 whitespace-nowrap">
                                        <span className="font-bold">Mascota:</span> {turno.selectedPet} | 
                                        <span className="font-bold"> Raza:</span> {turno.raza} | 
                                        <span className="font-bold"> Corte:</span> {turno.largo} | 
                                        <span className="font-bold"> Info:</span> {turno.info} | 
                                        <span className="font-bold"> Transporte:</span> {turno.transporte ? 'Sí' : 'No'} | 
                                        <span className={turno.pago ? 'text-green-600 bg-green-200 px-2 py-1 rounded-md' : 'text-yellow-200 bg-red-900 px-2 py-1 rounded-md'}>{turno.pago ? 'Pago: Sí' : 'Pago: No'}</span>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="container mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold my-4 text-center underline text-purple-800">Turnos cancelados:</h1>
                <table className="w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Nombre</th>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Apellido</th>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Teléfono</th>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Dirección</th>
                            <th className="px-3 py-2 text-left text-gray-600 uppercase">Turno</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {turnosCancelados.map((turno, index) => (
                            <React.Fragment key={index}>
                                <tr className={index % 2 === 0 ? 'bg-green-100' : 'bg-purple-200'}>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.nombre}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.apellido}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.telefono}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.direccion}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{turno.selectedTurno}</td>
                                </tr>
                                <tr className={index % 2 === 0 ? 'bg-green-100' : 'bg-purple-200'}>
                                    <td colSpan="5" className="px-3 py-2 whitespace-nowrap">
                                        <span className="font-bold">Mascota:</span> {turno.selectedPet} | 
                                        <span className="font-bold"> Raza:</span> {turno.raza} | 
                                        <span className="font-bold"> Corte:</span> {turno.largo} | 
                                        <span className="font-bold"> Info:</span> {turno.info} | 
                                        <span className="font-bold"> Transporte:</span> {turno.transporte ? 'Sí' : 'No'} | 
                                        <span className={turno.pago ? 'text-green-600 bg-green-200 px-2 py-1 rounded-md' : 'text-yellow-200 bg-red-900 px-2 py-1 rounded-md'}>{turno.pago ? 'Pago: Sí' : 'Pago: No'}</span>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
