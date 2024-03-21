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
        <>
            {mascotas.length > 0 ? (
                <div className="container mx-auto px-4 bg-violet-100 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10">
                        {mascotas.map((mascota, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="relative">
                                    {mascota.foto ? (
                                        <Image
                                            src={mascota.foto}
                                            alt={`Foto de ${mascota.nombre}`}
                                            width={300}
                                            height={300}
                                            className="object-cover w-full h-48 sm:h-56 md:h-64"
                                        />
                                    ) : (
                                        <div className="bg-gray-300 w-full h-48 sm:h-56 md:h-64 flex items-center justify-center">
                                            <p className="text-gray-600 text-lg">Foto no disponible</p>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-75 text-white p-2 w-full">
                                        <h2 className="text-lg font-semibold">{mascota.nombre}</h2>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-600">Especie: {mascota.especie}</p>
                                    <p className="text-sm text-gray-600">Tamaño: {mascota.tamaño}</p>
                                    <p className="text-sm text-gray-600">Raza: {mascota.raza}</p>
                                    <p className="text-sm text-gray-600">Situación: {mascota.estadoCivil || 'No definida'}</p>
                                    {!mascota.estadoCivil && (
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                                            Definir Situación
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-600 text-lg">No hay mascotas disponibles</p>
                </div>
            )}
        </>
    );
}
