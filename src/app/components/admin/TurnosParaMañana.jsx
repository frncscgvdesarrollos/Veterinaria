'use client';
import { useState, useEffect } from 'react';
import { getTurnosPeluqueria } from '../../firebase';

export default function TurnosParaMañana() {
    const [turnosHoy, setTurnosHoy] = useState([]);
    const [turnosMañana, setTurnosMañana] = useState([]);
    const [turnosPasado, setTurnosPasado] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [verMasTurnos, setVerMasTurnos] = useState(false);
    const [todosLosTurnos, setTodosLosTurnos] = useState([]);

    useEffect(() => {
        const toDay = new Date();
        const tomorrow = new Date(toDay);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const pasadoMañana = new Date(toDay);
        pasadoMañana.setDate(pasadoMañana.getDate() + 2);

        const getTurnos = () => {
            getTurnosPeluqueria()
                .then((turnosPeluqueria) => {
                    const filterTurnosByDate = (date) => turnosPeluqueria.filter(turno => {
                        const selectedDate = turno.selectedDate.toDate ? turno.selectedDate.toDate() : new Date(turno.selectedDate);
                        return selectedDate.toDateString() === date.toDateString() && turno.estadoDelTurno === 'confirmar';
                    });

                    const hoy = filterTurnosByDate(toDay);
                    const mañana = filterTurnosByDate(tomorrow);
                    const pasado = filterTurnosByDate(pasadoMañana);

                    const turnosFuturos = turnosPeluqueria.filter(turno => {
                        const selectedDate = turno.selectedDate.toDate ? turno.selectedDate.toDate() : new Date(turno.selectedDate);
                        return selectedDate > toDay && turno.estadoDelTurno === 'confirmar';
                    });

                    setTurnosHoy(hoy);
                    setTurnosMañana(mañana);
                    setTurnosPasado(pasado);
                    setTodosLosTurnos(turnosFuturos);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching turnos:', error);
                    setIsLoading(false);
                });
        };

        getTurnos();
    }, []);

    return (
        <div className="m-4 container mx-auto bg-violet-100 p-4 rounded-lg">
            {isLoading ? (
                <p className="text-center">Cargando turnos...</p>
            ) : (
                <div className="prose mx-auto">
                    <TurnoSection title="Turnos para hoy" turnos={turnosHoy} />
                    <TurnoSection title="Turnos para mañana" turnos={turnosMañana} />
                    <TurnoSection title="Turnos para pasado mañana" turnos={turnosPasado} />
                </div>
            )}

            <button 
                className={verMasTurnos ? 'mt-4 bg-violet-300 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded relative center' : 'bg-violet-300 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded'}
                onClick={() => setVerMasTurnos(!verMasTurnos)}
            >
                {verMasTurnos ? 'Ocultar turnos' : 'Ver todos los turnos'}
            </button>

            {verMasTurnos && (
                <div className="bg-violet-300 mt-4 flex justify-end p-2 rounded-lg">
                    <TurnosTable turnos={todosLosTurnos} />
                </div>
            )}
        </div>
    );
}

function TurnoSection({ title, turnos }) {
    return (
        <div>
            <h2 className="text-lg font-bold mb-2">{title}: {turnos.length ? <>{turnos.length}</> : '0'}</h2>
            <ul className="p-4 rounded-md mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {turnos.length > 0 ? (
                    turnos.map((turno) => (
                        <li key={turno.id} className="mb-2 p-4 bg-white rounded-md shadow">
                            <p><span className="font-semibold">Fecha:</span> {turno.selectedDate.toDate ? turno.selectedDate.toDate().toLocaleDateString() : new Date(turno.selectedDate).toLocaleDateString()}</p>
                            <p><span className="font-semibold">Cliente:</span> {turno.nombre}</p>
                            <p><span className="font-semibold">Teléfono:</span> {turno.telefono}</p>
                            <p><span className="font-semibold">Mascota:</span> {turno.selectedPet}</p>
                            <p><span className="font-semibold">Turno:</span> {turno.selectedTurno}</p>
                            <p><span className="font-semibold">Transporte:</span> {turno.transporte ? 'Sí' : 'No'}</p>
                            <p className={`font-semibold p-2 rounded-lg border-2 ${turno.estadoDelTurno === 'confirmar' ? 'text-cyan-900 bg-blue-200' : 'text-green-500 bg-green-100'}`}><span className="font-semibold text-black">Estado:</span> {turno.estadoDelTurno}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-center">No hay turnos para {title.toLowerCase()}</p>
                )}
            </ul>
        </div>
    );
}

function TurnosTable({ turnos }) {
    return (
        <table className="w-full text-sm text-left text-gray-800">
            <thead className='text-xs text-gray-700 uppercase bg-violet-200'>
                <tr className="text-center p-2">
                    <th className="text-center p-2">Fecha</th>
                    <th className="text-center p-2">Cliente</th>
                    <th className="text-center p-2">Teléfono</th>
                    <th className="text-center p-2">Mascota</th>
                    <th className="text-center p-2">Turno</th>
                    <th className="text-center p-2">Transporte</th>
                    <th className="text-center p-2">Estado</th>
                </tr>
            </thead>
            <tbody>
                {turnos.map((turno) => (
                    <tr key={turno.id}>
                        <td className="text-center p-2 font-semibold">{turno.selectedDate.toDate ? turno.selectedDate.toDate().toLocaleDateString() : new Date(turno.selectedDate).toLocaleDateString()}</td>
                        <td className="text-center p-2 font-semibold">{turno.nombre}</td>
                        <td className="text-center p-2 font-semibold">{turno.telefono}</td>
                        <td className="text-center p-2 font-semibold">{turno.selectedPet}</td>
                        <td className="text-center p-2 font-semibold">{turno.selectedTurno}</td>
                        <td className="text-center p-2 font-semibold">{turno.transporte ? 'Sí' : 'No'}</td>
                        <td className="text-center p-2 font-semibold">{turno.estadoDelTurno}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
