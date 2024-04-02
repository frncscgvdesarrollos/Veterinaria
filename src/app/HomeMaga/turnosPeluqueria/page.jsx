'use client';
import CargarTurnoPmanual from '@/app/components/CargarTurnoPmanual';
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
<div className="container flex mx-auto px-4 py-8 bg-violet-100 w-full">

    <div className="w-1/2 overflow-x-auto sm:rounded-lg">
    <h1 className="text-2xl  font-bold my-4 text-left underline text-violet-800 sm:text-center p-4">Turnos de Peluquería para hoy:</h1>
        <table className="w-full divide-y divide-gray-200 sm:w-1/3 text-sm ">
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
                {turnos && turnos.map((turno, index) => (
                    <React.Fragment key={index}>
                        <tr className={index % 2 === 0 ? 'bg-green-100' : 'bg-violet-200'}>
                            <td className="px-3 py-2 whitespace-nowrap">{turno.nombre}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{turno.apellido}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{turno.telefono}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{turno.direccion}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{turno.selectedTurno}</td>
                        </tr>
                        <tr className={index % 2 === 0 ? 'bg-green-100' : 'bg-violet-200'}>
                            <td colSpan="5" className="px-3 py-2 whitespace-nowrap">
                                <span className="font-bold">Mascota:</span> {turno.selectedPet} | 
                                <span className="font-bold"> Raza:</span> {turno.raza} | 
                                <span className="font-bold"> Corte:</span> {turno.largo} | 
                                <span className="font-bold"> Info:</span> {turno.info} | 
                                <span className="font-bold"> Transporte:</span> {turno.transporte ? 'Sí' : 'No'} | 
                                <span className={turno.pago ? 'text-green-600 bg-green-200 w-full ml-auto' : 'text-yellow-200 bg-red-900  w-full ml-auto'}>{turno.pago ? 'Pago: Sí' : 'Pago: No'}</span>
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    </div>
    <div className='w-1/2'>
    <CargarTurnoPmanual />
    </div>
</div>

    );
}
