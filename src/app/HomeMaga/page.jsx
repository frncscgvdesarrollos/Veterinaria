import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getTurnosPeluqueria, getTurnosTransporte } from '../firebase'; // Importar las funciones correctas
import LlamarA from '../components/llamarA';
import TurnosParaMañana from '../components/TurnosParaMañana';

export default function Page() {
    const { user } = UserAuth();
    const uid = user?.uid;

    const [turnosPeluqueria, setTurnosPeluqueria] = useState([]);
    const [isLoadingPeluqueria, setIsLoadingPeluqueria] = useState(true);
    const [turnosTransporte, setTurnosTransporte] = useState([]);
    const [isLoadingTransporte, setIsLoadingTransporte] = useState(true);

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

    useEffect(() => {
        const fetchDataTransporte = () => {
            getTurnosTransporte() // Corregir llamada a la función de transporte
                .then(data => {
                    setTurnosTransporte(data);
                    setIsLoadingTransporte(false);
                })
                .catch(error => {
                    console.error('Error fetching turnos de transporte:', error);
                });
        };

        if (isLoadingTransporte) {
            fetchDataTransporte();
        }
    }, [isLoadingTransporte]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="col-span-2 lg:col-span-2 bg-white shadow-md rounded-md overflow-hidden bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-lg font-bold text-cyan-800 mb-4">Llamar para confirmar</h2>
                <LlamarA />
            </div>
            <div className="col-span-1 bg-white shadow-md rounded-md overflow-hidden bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
                Caja
            </div>
            <div className="col-span-3 bg-white shadow-md rounded-md overflow-hidden bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
                <h1 className="text-2xl sm:text-lg font-bold text-cyan-800 mb-4">Transporte</h1>
                <div className="">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                {/* Añadir las cabeceras faltantes */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Renderizar los datos de los turnos de transporte */}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-span-3 bg-white shadow-md rounded-md overflow-hidden bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-lg font-bold text-cyan-800 mb-4">Peluquería</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Añadir las cabeceras para la tabla de peluquería */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Renderizar los datos de los turnos de peluquería */}
                    </tbody>
                </table>
            </div>
            <div className="col-span-3 bg-white shadow-md rounded-md overflow-hidden bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-lg font-bold text-cyan-800 mb-4">Turnos Para Confirmar</h2>
                <TurnosParaMañana />
            </div>
        </div>
    );
}
