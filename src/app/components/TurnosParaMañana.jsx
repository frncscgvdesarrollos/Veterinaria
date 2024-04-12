'use client';
import { useState, useEffect } from 'react';
import { getTurnosPeluqueria } from '../firebase';

export default function TurnosParaMañana() {
    const [turnosHoy, setTurnosHoy] = useState([]);
    const [turnosMañana, setTurnosMañana] = useState([]);
    const [turnosPasado, setTurnosPasado] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [verMasTurnos, setVerMasTurnos] = useState(false);

    const toDay = new Date();
    const tomorrow = new Date(toDay);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pasadoMañana = new Date(toDay);
    pasadoMañana.setDate(pasadoMañana.getDate() + 2);

    const getTurnos = () => {
        getTurnosPeluqueria()
            .then((turnosPeluqueria) => {
                const hoy = turnosPeluqueria.filter(
                    (turno) => {
                        const selectedDate = turno.selectedDate.toDate ? turno.selectedDate.toDate() : new Date(turno.selectedDate);
                        return selectedDate.toDateString() === toDay.toDateString() && turno.estadoDelTurno === 'confirmar';
                    }
                );
                const mañana = turnosPeluqueria.filter(
                    (turno) => {
                        const selectedDate = turno.selectedDate.toDate ? turno.selectedDate.toDate() : new Date(turno.selectedDate);
                        return selectedDate.toDateString() === tomorrow.toDateString() && turno.estadoDelTurno === 'confirmar';
                    }
                );
                const pasado = turnosPeluqueria.filter(
                    (turno) => {
                        const selectedDate = turno.selectedDate.toDate ? turno.selectedDate.toDate() : new Date(turno.selectedDate);
                        return selectedDate.toDateString() === pasadoMañana.toDateString() && turno.estadoDelTurno === 'confirmar';
                    }
                );
                setTurnosHoy(hoy);
                setTurnosMañana(mañana);
                setTurnosPasado(pasado);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching turnos:', error);
            });
    };

    useEffect(() => {
        getTurnos();
    });

    return (
        <div className="m-4 container mx-auto bg-violet-100 p-4 rounded-lg">
            {isLoading && <p className="text-center">Cargando turnos...</p>}
            {!isLoading && (
                <div className="prose mx-auto">
                    <h2 className="text-lg font-bold mb-2">Turnos para hoy: {turnosHoy.length ? <>{turnosHoy.length}</> : '0'}</h2>
                    <ul className=" p-4 rounded-md mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {turnosHoy.map((turno) => {
                            return turno.estadoDelTurno === 'confirmar' && (
                                <li key={turno.id} className="mb-2 p-4 bg-white rounded-md shadow">
                                    <p><span className="font-semibold">Cliente:</span> {turno.nombre}</p>
                                    <p><span className="font-semibold">Teléfono:</span> {turno.telefono}</p>
                                    <p><span className="font-semibold">Mascota:</span> {turno.selectedPet}</p>
                                    <p><span className="font-semibold">Turno:</span> {turno.selectedTurno}</p>
                                    <p><span className="font-semibold">Transporte:</span> {turno.transporte ? 'Sí' : 'No'}</p>
                                    <p className={`font-semibold p-2 rounded-lg border-2 ${turno.estadoDelTurno === 'confirmar' ? 'text-cyan-900 bg-blue-200' : 'text-green-500 bg-green-100'}`}><span className="font-semibold text-black">Estado:</span> {turno.estadoDelTurno}</p>
                                </li>
                            )
                        })}
                        {turnosHoy.length === 0 && <p className="text-center">No hay turnos para hoy</p>}
                    </ul>
    
                    <h2 className="text-lg font-bold mb-2">Turnos para mañana: {turnosMañana.length ? <>{turnosMañana.length}</> : '0'}</h2>
                    <ul className="bg-violet-200 p-4 rounded-md mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {turnosMañana.map((turno) => (
                            <li key={turno.id} className="mb-2 p-4 bg-white rounded-md shadow">
                                <p><span className="font-semibold">Cliente:</span> {turno.nombre}</p>
                                <p><span className="font-semibold">Teléfono:</span> {turno.telefono}</p>
                                <p><span className="font-semibold">Mascota:</span> {turno.selectedPet}</p>
                                <p><span className="font-semibold">Turno:</span> {turno.selectedTurno}</p>
                                <p><span className="font-semibold">Transporte:</span> {turno.transporte ? 'Sí' : 'No'}</p>
                                <p className={`font-semibold p-2 rounded-lg border-2 ${turno.estadoDelTurno === 'confirmar' ? 'text-cyan-900 bg-blue-200' : 'text-green-500 bg-green-100'}`}><span className="font-semibold text-black">Estado:</span> {turno.estadoDelTurno}</p>
                            </li>
                        ))}
                        {turnosMañana.length === 0 && <p className="text-center">No hay turnos para mañana</p>}
                    </ul>
    
                    <h2 className="text-lg font-bold mb-2">Turnos para pasado mañana: {turnosPasado.length ? <>{turnosPasado.length}</> : '0'}</h2>
                    <ul className="bg-violet-300 p-4 rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {turnosPasado.map((turno) => (
                            <li key={turno.id} className="mb-2 p-4 bg-white rounded-md shadow">
                                <p><span className="font-semibold">Cliente:</span> {turno.nombre}</p>
                                <p><span className="font-semibold">Teléfono:</span> {turno.telefono}</p>
                                <p><span className="font-semibold">Mascota:</span> {turno.selectedPet}</p>
                                <p><span className="font-semibold">Turno:</span> {turno.selectedTurno}</p>
                                <p><span className="font-semibold">Transporte:</span> {turno.transporte ? 'Sí' : 'No'}</p>
                                <p className={`font-semibold p-2 rounded-lg border-2 ${turno.estadoDelTurno === 'confirmar' ? 'text-cyan-900 bg-blue-200' : 'text-green-500 bg-green-100'}`}><span className="font-semibold text-black">Estado:</span> {turno.estadoDelTurno}</p>
                            </li>
                        ))}
                        {turnosPasado.length === 0 && <p className="text-center">No hay turnos para pasado mañana</p>}
                    </ul>
                </div>
            )}
            <div className="bg-violet-600 mt-4 flex justify-end p-2 rounded-lg">
                <button className={verMasTurnos ? 'mr-32 bg-violet-300 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded' : 'bg-violet-300 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded'} onClick={()=> setVerMasTurnos(!verMasTurnos)}>
                    {verMasTurnos ? 'Ocultar turnos' : 'Ver más turnos'}
                </button>
            </div>
        </div>
    );
}
