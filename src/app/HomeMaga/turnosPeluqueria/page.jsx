'use client'
import { getTurnosPeluqueria } from '@/app/firebase';
import React, { useState, useEffect } from 'react';

export default function VistaTurnosPeluqueriaVeterinaria() {
    const [turnos, setTurnos] = useState([]);
    const [turnosCargados, setTurnosCargados] = useState(false);

    useEffect(() => {
        if (!turnosCargados) {
            getTurnosPeluqueria()
                .then(turnosPeluqueria => {
                    setTurnos(turnosPeluqueria);
                    setTurnosCargados(true);
                })
                .catch(error => {
                    console.log("No se pudo obtener los turnos de la peluqueria", error);
                });
        }
    }, [turnosCargados]);

    return (
        <div className="container  px-4 w-3/4">
            <h1 className="text-2xl font-bold my-4">Turnos Peluqueria hoy:</h1>
            <table className="max-w-full mx-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Info</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {turnos && turnos.map((turno, index) => (
                        <React.Fragment key={index}>
                            <tr className={index % 2 === 0 ? 'bg-gray-300 ' : ' bg-gray-700'}>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.apellido}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.selectedTurno}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.direccion}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                                <td className="px-6 py-4 whitespace-nowrap w-[150px]">{turno.info}</td>
                            </tr>
                            <tr className={index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700'}>
                                <td  className="px-6 py-4 whitespace-nowrap">Mascota: {turno.selectedPet}</td>
                                <td  className="px-6 py-4 whitespace-nowrap">Raza: {turno.raza}</td>
                                <td className="px-6 py-4 whitespace-nowrap"> Largo: {turno.largo}</td>
                                <td className="px-6 py-4 whitespace-nowrap">transporte: {turno.transporte ? 'Sí' : 'No'}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
