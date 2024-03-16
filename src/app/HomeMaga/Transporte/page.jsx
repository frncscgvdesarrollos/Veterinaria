'use client'
import { useState, useEffect } from 'react';
import { getTurnosPeluqueriaBuscar } from '../../firebase';

export default function TransporteHome() {
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTurnosPeluqueriaBuscar();
        setTurnos(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching turnos:', error);
      }
    };

    if (isLoading) {
      fetchData();
    }
  }, [isLoading]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Transporte</h1>
      <ul>
        {turnos.map((turno, index) => (
          <div key={index} className={`flex  ${index % 2 === 0 ? 'bg-violet-100' : 'bg-cyan-100'}`}>
            <p className="m-2">Turno :{index + 1}</p>
            <li className="m-2" >{turno.nombre}</li>
            <li className="m-2">{turno.apellido}</li>
            <li className="m-2">{turno.direccion}</li>
            <li className="m-2">{turno.telefono}</li>
            {turno.estadoTransporte === 'buscar' && (
              <>
              <li className={turno.estadoTransporte==='buscar'? 'm-2 bg-red-500 text-yellow-300': 'm-2'}>Estado: {turno.estadoTransporte}</li>     
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg m-2">buscado</button>
              </>
            )}

          </div>
        ))}
      </ul>
    </div>
  );
}
