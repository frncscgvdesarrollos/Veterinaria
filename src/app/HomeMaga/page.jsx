'use client';
import { useState, useEffect } from 'react';
import { getTurnosChekeo, clienteExiste } from '../firebase';

export default function Negocio() {
    const [turnos, setChequeos] = useState([]);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState('turnosVeterinariaHoy');

    useEffect(() => {
        const fetchTurnos = () => {
            getTurnosChekeo()
                .then(turnosData => setChequeos(turnosData))
                .catch(error => console.error('Error al obtener los turnos:', error));
        };

        fetchTurnos();
    }, []);



    const obtenerTurnosHoy = () => {
        const fechaHoy = new Date();
        const turnosHoy = turnos.filter(turno => {
            const fechaTurno = new Date(turno.selectedDate);
            return (
                fechaTurno.getDate() === fechaHoy.getDate() &&
                fechaTurno.getMonth() === fechaHoy.getMonth() &&
                fechaTurno.getFullYear() === fechaHoy.getFullYear()
            );
        });
        return turnosHoy;
    };

    const obtenerTurnosSemana = () => {
        const fechaHoy = new Date();
        const primerDiaSemana = new Date(fechaHoy);
        primerDiaSemana.setDate(fechaHoy.getDate() - fechaHoy.getDay());

        const ultimoDiaSemana = new Date(fechaHoy);
        ultimoDiaSemana.setDate(fechaHoy.getDate() - fechaHoy.getDay() + 6);

        const turnosSemana = turnos.filter(turno => {
            const fechaTurno = new Date(turno.selectedDate);
            return (
                fechaTurno >= primerDiaSemana &&
                fechaTurno <= ultimoDiaSemana
            );
        });
        return turnosSemana;
    };

    let turnosMostrados;
    if (opcionSeleccionada === 'turnosVeterinariaHoy') {
        turnosMostrados = obtenerTurnosHoy();
    } else if (opcionSeleccionada === 'turnosVeterinariaSemana') {
        turnosMostrados = obtenerTurnosSemana();
    } else if (opcionSeleccionada === 'todosTurnosVeterinaria') {
        turnosMostrados = turnos.filter(turno => turno.selectedLocation === 'veterinaria');
    }

    function handleClients(){
        
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
            <h1 className="text-2xl font-semibold mb-4">Home Negocio</h1>
            <div className="flex justify-between mb-6">
                <button
                    className={`p-2 rounded-md ${
                        opcionSeleccionada === 'todosTurnosVeterinaria' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                    }`}
                    onClick={() => setOpcionSeleccionada('todosTurnosVeterinaria')}
                >
                    Todos los Turnos Veterinaria
                </button>
                <button
                    className={`p-2 rounded-md ${
                        opcionSeleccionada === 'turnosVeterinariaHoy' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                    }`}
                    onClick={() => setOpcionSeleccionada('turnosVeterinariaHoy')}
                >
                    Turnos Veterinaria Hoy
                </button>
                <button
                    className={`p-2 rounded-md ${
                        opcionSeleccionada === 'turnosVeterinariaSemana' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                    }`}
                    onClick={() => setOpcionSeleccionada('turnosVeterinariaSemana')}
                >
                    Turnos Veterinaria Semana
                </button>
            </div>
            <div>
                {turnosMostrados.map((turno, index) => (
                    <div key={index} className="bg-white rounded-md shadow-md p-4 mb-4">
                        <p className="text-lg font-semibold">Usuario: {turno.usuarioId}</p>
                        <p className="mb-2">Mascota: {turno.selectedPet}</p>
                        <p className="mb-2">Lugar: {turno.selectedLocation}</p>
                        <p className="mb-2">Hora solicitada: {turno.selectedTime}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
