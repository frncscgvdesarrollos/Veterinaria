'use client';
import { getTurnosPeluqueria } from '@/app/firebase';
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

    return (
        <div className="container text-center text-gray-800 px-4 w-3/4">
            <h1 className="text-2xl font-bold my-4 text-left mb-10 mt-10 underline text-lime-600">Turnos de Peluquería para hoy:</h1>
            <table className="max-w-full mx-auto divide-y divide-gray-200 border-separate border-spacing-2">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Apellido</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Teléfono</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Dirección</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Turno</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                    {turnos && turnos.map((turno, index) => (
                        <React.Fragment key={index}>
                            <tr className={index % 2 === 0 ? 'bg-gray-100 ' : ' bg-gray-200'}>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.apellido}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.telefono}</td>
                                <td className="px-6 py-4 whitespace-nowrap bg-green-300">{turno.direccion}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{turno.selectedTurno}</td>
                            </tr>
                            <tr className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                                <td  className="px-6 py-4 whitespace-nowrap">Mascota: {turno.selectedPet}</td>
                                <td  className="px-6 py-4 whitespace-nowrap">Raza: {turno.raza}</td>
                                <td className="px-6 py-4 whitespace-nowrap"> Corte: {turno.largo}</td>
                                <td className="px-6 py-4 whitespace-nowrap w-[150px]">Info: {turno.info}</td>
                                <td className="px-6 py-4 whitespace-nowrap">Transporte: {turno.transporte ? 'Sí' : 'No'}</td>
                                <td className={turno.pago? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 whitespace-nowrap bg-red-500'}>Pago: {turno.pago? 'Sí' : 'No'}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
