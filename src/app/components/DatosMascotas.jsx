'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MascotasContext } from '../context/MascotaContext';

export default function DatosMascotas() {
    const { mascota } = MascotasContext();
    const [mascotas, setMascotas] = useState([]);

    useEffect(() => {
        if (mascota && mascota.length > 0) {
            setMascotas(mascota);
        } 
    }, [mascota]);

    return (
        <>{mascota ?
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mascotas.map((mascota, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <div className="relative flex justify-center">
                            {mascota.foto ? (
                                <Image
                                    src={mascota.foto}
                                    alt={`Foto de ${mascota.nombre}`}
                                    width={200}
                                    height={200}
                                    className="rounded-lg object-contain"
                                />
                            ) : (
                                <div className="bg-gray-300 w-full h-32 flex items-center justify-center rounded-lg">
                                    <p className="text-gray-600 text-lg">Foto no disponible</p>
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-75 text-white p-2 w-full rounded-b-lg">
                                <h2 className="text-lg font-semibold mt-[-10px] w-[100px]">{mascota.nombre}</h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-gray-600">Especie: {mascota.especie}</p>
                            <p className="text-sm text-gray-600">Tamaño: {mascota.tamaño}</p>
                            <p className="text-sm text-gray-600">Raza: {mascota.raza}</p>
                            <p className="text-sm text-gray-600">Situación: {mascota.estadoCivil || 'No definida'}</p>
                            {mascota.estadoCivil ? null : (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                                    Definir Situación
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
            : <span>cargando...</span>}
         </>
         );
}
