'use client'
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getTurnosPeluqueria } from '../firebase';
import LlamarA from '../components/llamarA';

export default function Page() {
    const { user } = UserAuth();
    const uid = user?.uid;

    const [turnosPeluqueria, setTurnosPeluqueria] = useState([]);
    const [isLoadingPeluqueria, setIsLoadingPeluqueria] = useState(true);

    useEffect(() => {
        const fetchDataPeluqueria = () => {
            getTurnosPeluqueria()
                .then(data => {
                    setTurnosPeluqueria(data);
                    setIsLoadingPeluqueria(false);
                })
                .catch(error => {
                    console.error('Error fetching turnos de peluquería:', error);
                });
        };

        if (isLoadingPeluqueria) {
            fetchDataPeluqueria();
        }
    }, [isLoadingPeluqueria]);

    return (
        <div>
            {(uid === "L6nqm2J1UuZCmZ4dS5K7Mhonxx42" || uid === "fgGyxXX05NNN5aMakZ7mRChW0gY2") && (
                <div className="grid grid-cols-2 gap-4 p-16">
                    {/* Tabla de turnos de peluquería */}
                    <div className="bg-green-300">
                        <h2 className="text-xl font-bold text-cyan-800 mb-4">Peluquería</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corte</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Largo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {turnosPeluqueria.map(turno => (
                                    <tr key={turno.id} className={turno.id % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}>
                                        <td className="px-6 py-4 whitespace-nowrap">{turno.selectedPet}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{turno.corte}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{turno.largo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{turno.estadoPeluqueria}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <LlamarA/>
        </div>
    );
}
