'use client'
import { useState, useEffect } from 'react';
import { getTurnosPeluqueria } from '../firebase';

export default function TurnosParaMañana() {
    const [turnosHoy, setTurnosHoy] = useState([]);
    const [turnosMañana, setTurnosMañana] = useState([]);
    const [turnosPasado, setTurnosPasado] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const toDay = new Date();
    const tomorrow = new Date(toDay);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pasadoMañana = new Date(toDay);
    pasadoMañana.setDate(pasadoMañana.getDate() + 2);

    function getTurnos() {
        getTurnosPeluqueria()
            .then((turnosPeluqueria) => {
                const hoy = turnosPeluqueria.filter(
                    (turno) => turno.selectedDate.toDate().toDateString() === toDay.toDateString()
                );
                const mañana = turnosPeluqueria.filter(
                    (turno) => turno.selectedDate.toDate().toDateString() === tomorrow.toDateString()
                );
                const pasado = turnosPeluqueria.filter(
                    (turno) => turno.selectedDate.toDate().toDateString() === pasadoMañana.toDateString()
                );
                setTurnosHoy(hoy);
                setTurnosMañana(mañana);
                setTurnosPasado(pasado);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching turnos:', error);
            });
    }

    useEffect(() => {
        if (isLoading) {
            getTurnos();
        }
    }, [isLoading ,getTurnos ]);

    return (
        <div className="m-4">
            {isLoading && <p>Cargando turnos...</p>}
            {!isLoading && (
                <div>
                    <h2>Turnos para hoy:</h2>
                    <table className="w-full table-fixed bg-blue-100 rounded-lg">
                        <thead>
                            <tr>
                                <th className="w-1/5 text-center p-2">Cliente</th>
                                <th className="w-1/5 text-center p-2">Telefono</th>
                                <th className="w-1/5 text-center p-2">Mascota</th>
                                <th className="w-1/5 text-center p-2">Turno</th>
                                <th className="w-1/5 text-center p-2">Transporte</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosHoy.map((turno) => (
                                <tr key={turno.id}>
                                    <td className="text-center p-2">{turno.nombre}</td>
                                    <td className="text-center p-2">{turno.telefono}</td>
                                    <td className="text-center p-2">{turno.selectedPet}</td>
                                    <td className="text-center p-2">{turno.selectedTurno}</td>
                                    <td className="text-center p-2">{turno.transporte ? <span>si</span> : <span>no</span>}</td>
                                </tr>
                            ))}
                            {turnosHoy.length === 0 && <tr><td colSpan="5" className="text-center p-2">No Hay Turnos</td></tr>}
                        </tbody>
                    </table>

                    <h2>Turnos para mañana:</h2>
                    <table className="w-full table-fixed bg-green-100 rounded-lg">
                        <thead>
                            <tr>
                                <th className="w-1/5 text-center p-2">Cliente</th>
                                <th className="w-1/5 text-center p-2">Telefono</th>
                                <th className="w-1/5 text-center p-2">Mascota</th>
                                <th className="w-1/5 text-center p-2">Turno</th>
                                <th className="w-1/5 text-center p-2">Transporte</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosMañana.map((turno) => (
                                <tr key={turno.id}>
                                    <td className="text-center p-2">{turno.nombre}</td>
                                    <td className="text-center p-2">{turno.telefono}</td>
                                    <td className="text-center p-2">{turno.selectedPet}</td>
                                    <td className="text-center p-2">{turno.selectedTurno}</td>
                                    <td className="text-center p-2">{turno.transporte ? <span>si</span> : <span>no</span>}</td>
                                </tr>
                            ))}
                            {turnosMañana.length === 0 && <tr><td colSpan="5" className="text-center p-2">No Hay Turnos</td></tr>}
                        </tbody>
                    </table>

                    <h2>Turnos para pasado mañana:</h2>
                    <table className="w-full table-fixed bg-yellow-100 rounded-lg">
                        <thead>
                            <tr>
                                <th className="w-1/5 text-center p-2">Cliente</th>
                                <th className="w-1/5 text-center p-2">Telefono</th>
                                <th className="w-1/5 text-center p-2">Mascota</th>
                                <th className="w-1/5 text-center p-2">Turno</th>
                                <th className="w-1/5 text-center p-2">Transporte</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosPasado.map((turno) => (
                                <tr key={turno.id}>
                                    <td className="text-center p-2">{turno.nombre}</td>
                                    <td className="text-center p-2">{turno.telefono}</td>
                                    <td className="text-center p-2">{turno.selectedPet}</td>
                                    <td className="text-center p-2">{turno.selectedTurno}</td>
                                    <td className="text-center p-2">{turno.transporte ? <span>si</span> : <span>no</span>}</td>
                                </tr>
                            ))}
                            {turnosPasado.length === 0 && <tr><td colSpan="5" className="text-center p-2">No Hay Turnos</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

