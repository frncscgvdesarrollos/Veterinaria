'use client'
import React, { useState, useEffect } from 'react';
import { getTurnosPeluqueria, cancelarTurnoPeluqueria } from '@/app/firebase';
import CargarTurnoPmanual from '@/app/components/admin/CargarTurnoPmanual';
import PrecioPeluqueria from '@/app/components/admin/PrecioPeluqueria';

export default function VistaTurnosPeluqueriaVeterinaria() {
    const [turnosActivos, setTurnosActivos] = useState([]);
    const [turnosFinalizados, setTurnosFinalizados] = useState([]);
    const [turnosCancelados, setTurnosCancelados] = useState([]);

    useEffect(() => {
        const cargarTurnosPeluqueria = () => {
            getTurnosPeluqueria()
                .then(turnosPeluqueria => {
                    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
                    const turnosActivosHoy = turnosPeluqueria.filter(turno => {
                        const turnoDate = turno.selectedDate.toDate().toISOString().split('T')[0];
                        return turnoDate === hoy && turno.estadoDelTurno !== 'finalizado' && turno.estadoDelTurno !== 'cancelado';
                    });
                    const turnosFinalizadosHoy = turnosPeluqueria.filter(turno => {
                        const turnoDate = turno.selectedDate.toDate().toISOString().split('T')[0];
                        return turnoDate === hoy && turno.estadoDelTurno === 'finalizado';
                    });
                    const turnosCanceladosHoy = turnosPeluqueria.filter(turno => {
                        const turnoDate = turno.selectedDate.toDate().toISOString().split('T')[0];
                        return turnoDate === hoy && turno.estadoDelTurno === 'cancelado';
                    });
                    setTurnosActivos(turnosActivosHoy);
                    setTurnosFinalizados(turnosFinalizadosHoy);
                    setTurnosCancelados(turnosCanceladosHoy);
                })
                .catch(error => {
                    console.log("No se pudieron obtener los turnos de la peluquería", error);
                });
        };

        cargarTurnosPeluqueria();
    }, []);

    function handleCancelar(id) {
        cancelarTurnoPeluqueria(id)
            .then(() => {
                alert('Turno cancelado correctamente');
            })
            .catch(error => {
                console.error('Error al cancelar el turno:', error);
                alert('Error al cancelar el turno:', error);
            })
    }

    return (
        <div className="bg-purple-100 p-4 sm:p-8 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-2/3">
                    <PrecioPeluqueria />
                </div>
                <div className="w-full sm:w-1/3">
                    <CargarTurnoPmanual />
                </div>
            </div>
            <div className="container mx-auto mt-8 bg-violet-200 rounded-lg p-5 ">
                <h1 className="text-2xl font-bold mb-4  underline text-purple-800">Turnos de Peluquería para hoy:</h1>
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Nombre</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Apellido</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Teléfono</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Dirección</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Turno</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {turnosActivos.map(turno => (
                                <React.Fragment key={turno.id}>
                                    <tr className="bg-purple-200">
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.nombre}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.apellido}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.telefono}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.direccion}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.selectedTurno}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.estadoDelTurno}</td>
                                    </tr>
                                    <tr className="bg-purple-200">
                                        <td colSpan="6" className="px-3 py-2 whitespace-nowrap">
                                            <span className="font-bold">Mascota:</span> {turno.selectedPet} |
                                            <span className="font-bold"> Raza:</span> {turno.raza} |
                                            <span className="font-bold"> Corte:</span> {turno.largo} |
                                            <span className="font-bold"> Info:</span> {turno.info} |
                                            <span className="font-bold"> Transporte:</span> {turno.transporte ? 'Sí' : 'No'} |
                                            <span className={turno.pago ? 'text-green-600 bg-green-200 px-2 py-1 rounded-md' : 'text-yellow-200 bg-red-900 px-2 py-1 rounded-md'}>{turno.pago ? 'Pago: Sí' : 'Pago: No'}</span>
                                            <button onClick={() => handleCancelar(turno.id)} className="text-red-600 bg-red-200 px-2 py-1 rounded-md">Cancelar</button>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="container mx-auto mt-8 bg-violet-200 rounded-lg p-5">
                <h1 className="text-2xl font-bold mb-4  underline text-purple-800">Turnos finalizados:</h1>
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Nombre</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Apellido</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Teléfono</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Dirección</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Turno</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {turnosFinalizados.map(turno => (
                                <React.Fragment key={turno.id}>
                                    <tr className="bg-purple-200">
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.nombre}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.apellido}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.telefono}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.direccion}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.selectedTurno}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.estadoDelTurno}</td>
                                    </tr>
                                    <tr className="bg-purple-200">
                                        <td colSpan="6" className="px-3 py-2 whitespace-nowrap">
                                            <span className="font-bold">Mascota:</span> {turno.selectedPet} |
                                            <span className="font-bold"> Raza:</span> {turno.raza} |
                                            <span className="font-bold"> Corte:</span> {turno.largo} |
                                            <span className="font-bold"> Info:</span> {turno.info} |
                                            <span className="font-bold"> Transporte:</span> {turno.transporte ? 'Sí' : 'No'} |
                                            <span className={turno.pago ? 'text-green-600 bg-green-200 px-2 py-1 rounded-md' : 'text-yellow-200 bg-red-900 px-2 py-1 rounded-md'}>{turno.pago ? 'Pago: Sí' : 'Pago: No'}</span>
                                            <span className="text-red-600 bg-red-200 px-2 py-1 rounded-md">Finalizado</span>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="container mx-auto mt-8 bg-violet-200 rounded-lg p-5">
                <h1 className="text-2xl font-bold mb-4  underline text-purple-800">Turnos cancelados:</h1>
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Nombre</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Apellido</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Teléfono</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Dirección</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Turno</th>
                                <th className="px-3 py-2 text-left text-gray-600 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {turnosCancelados.map(turno => (
                                <React.Fragment key={turno.id}>
                                    <tr className="bg-purple-200">
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.nombre}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.apellido}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.telefono}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.direccion}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.selectedTurno}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{turno.estadoDelTurno}</td>
                                    </tr>
                                    <tr className="bg-purple-200">
                                        <td colSpan="6" className="px-3 py-2 whitespace-nowrap">
                                            <span className="font-bold">Mascota:</span> {turno.selectedPet} |
                                            <span className="font-bold"> Raza:</span> {turno.raza} |
                                            <span className="font-bold"> Corte:</span> {turno.largo} |
                                            <span className="font-bold"> Info:</span> {turno.info} |
                                            <span className="font-bold"> Transporte:</span> {turno.transporte ? 'Sí' : 'No'} |
                                            <span className={turno.pago ? 'text-green-600 bg-green-200 px-2 py-1 rounded-md' : 'text-yellow-200 bg-red-900 px-2 py-1 rounded-md'}>{turno.pago ? 'Pago: Sí' : 'Pago: No'}</span>
                                            <span className="text-red-600 bg-red-200 px-2 py-1 rounded-md">Cancelado</span>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
