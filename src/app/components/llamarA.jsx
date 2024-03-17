'use client'
import { useState, useEffect } from 'react';
import { turnosPeluqueriaPagosYaConfirmar } from '../firebase';

export default function LlamarA() {
    const [turnosAConfirmar, setTurnosAConfirmar] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function handleTurnos() {
        return new Promise((resolve, reject) => {
            turnosPeluqueriaPagosYaConfirmar()
                .then(turnos => {
                    setTurnosAConfirmar(turnos);
                    resolve(turnos);
                })
                .catch(error => {
                    console.error('Error al obtener los turnos a confirmar:', error);
                    reject(error);
                });
        });
    }

    useEffect(() => {
        if (isLoading) {
            handleTurnos()
                .then(() => setIsLoading(false))
                .catch(error => console.error('Error al cargar los turnos:', error));
        }
    }, [isLoading]);

    const confirmarTurno = (id) => {
        // Aquí puedes implementar la lógica para confirmar el turno con el ID proporcionado
        console.log("Confirmar turno con ID:", id);
    };

    return (
        <div className='w-3/4 m-auto p-4 bg-violet-300 rounded-lg'>
            <h3>Llamar a :</h3>
            {turnosAConfirmar.map((turno) => (
                <div key={turno.id} className='flex justify-space-around items-center'>
                    <li className='w-1/3'>{turno.nombre}</li>
                    <li className='w-1/3'>{turno.telefono}</li>
                    <button className='w-1/3'>
                        {turno.estadoDelTurno === "confirmar" && 
                            <span onClick={() => confirmarTurno(turno.id)}>Confirmar</span>
                        }
                    </button>
                </div>
            ))}            
        </div>
    );
}

