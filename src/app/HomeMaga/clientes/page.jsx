'use client'
import React, { useState, useEffect } from 'react';
import { getClientes } from '@/app/firebase';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buscar, setBuscar] = useState(false);
  const [codigoBuscar, setCodigoBuscar] = useState('');

  useEffect(() => {
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        getClientes()
          .then((clientesData) => {
            setClientes(clientesData);
            setIsLoading(false);
            resolve();
          })
          .catch((error) => {
            console.error('Error fetching clientes:', error);
            reject(error);
          });
      });
    };

    if (clientes.length === 0) {
      fetchData();
    }
  }, []);

  const handleBuscarClick = () => {
    if (codigoBuscar.trim() !== '') {
      setBuscar(!buscar);
    }
  };

  const handleCodigoChange = (event) => {
    setCodigoBuscar(event.target.value);
  };

  return (
    <div className="p-6 bg-purple-100 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Lista de clientes registrados</h1>
        <div className='flex w-2/3'>
          <input
            type="text"
            className="px-4 py-2 border rounded-lg w-2/3 mr-4 ml-10"
            placeholder='Código Único Dueño'
            value={codigoBuscar}
            onChange={handleCodigoChange}
          />
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-lg w-1/3'
            onClick={handleBuscarClick}
          >
            {buscar ? 'Cancelar' : 'Buscar'}
          </button>
        </div>
      </div>
      {isLoading ? (
        <p>Cargando clientes...</p>
      ) : (
        <>
          {buscar ?
            <div className='w-3/4 mx-auto mt-10 mb-10 p-6 font-semibold text-gray-700 rounded-lg bg-violet-200'>
              {clientes.find(cliente => cliente.usuarioid === codigoBuscar) ? (
                <ul className="divide-y divide-gray-200 flex gap-10">
  {clientes
    .filter(cliente => cliente.usuarioid === codigoBuscar)
    .map((cliente, index) => (
      <React.Fragment key={index}>
        <div>
        <li className="py-4">
          <span className="font-semibold">Nombre:</span> {cliente.nombre}
        </li>
        <li className="py-4">
          <span className="font-semibold">Apellido:</span> {cliente.apellido}
        </li>
        <li className="py-4">
          <span className="font-semibold">Dirección:</span> {cliente.direccion}
        </li>
        <li className="py-4">
          <span className="font-semibold">Esquina:</span> {cliente.esquina}
        </li>
        <li className="py-4">
          <span className="font-semibold">Teléfono:</span> {cliente.telefono}
        </li>
        </div>
        <div>
        <li className="py-4">
          <span className="font-semibold">Es Premium:</span> {cliente.esPremium ? 'Si' : 'No'}
        </li>
        <li className="py-4">
          <span className="font-semibold">Chequeos Totales:</span> {cliente.chequeosTotales}
        </li>
        <li className="py-4">
          <span className="font-semibold">Cortes Totales:</span> {cliente.cortesTotales}
        </li>
        </div>
        <li className="py-4">
          <span className="font-semibold">Términos:</span> {cliente.terminos ? 'Si' : 'No'}
        </li>
        <li className="py-4">
          <span className="font-semibold">ID de Usuario:</span> {cliente.usuarioid}
        </li>
      </React.Fragment>
    ))}
</ul>

              ) : (
                <p>No se encontraron clientes con el código único especificado.</p>
              )}
            </div>
            :
            <div className="overflow-x-auto rounded-lg w-3/4 mx-auto">
              <table className="w-full table-auto bg-white border border-purple-200 rounded-lg shadow-md">
                <thead className='text-lg bg-violet-200'>
                  <tr>
                    <th className='px-4 py-2'>Nombre</th>
                    <th className='px-4 py-2'>Apellido</th>
                    <th className='px-4 py-2'>Dirección</th>
                    <th className='px-4 py-2'>Teléfono</th>
                    <th className='px-4 py-2'>Términos</th>
                    <th className='px-4 py-2'>Es Premium</th>
                    <th className='px-4 py-2'>Chequeos Totales</th>
                    <th className='px-4 py-2'>Cortes Totales</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente, index) => (
                    <tr key={index} className={(index % 2 === 0) ? 'bg-purple-300' : 'bg-violet-200'}>
                      <td className='px-4 py-2'>{cliente.nombre}</td>
                      <td className='px-4 py-2'>{cliente.apellido}</td>
                      <td className='px-4 py-2'>{cliente.direccion}</td>
                      <td className='px-4 py-2'>{cliente.telefono}</td>
                      <td className={cliente.terminos ? 'px-4 py-2 bg-blue-200 text-white text-center' : 'px-4 py-2 bg-red-200 text-yellow-300 text-center'}>{cliente.terminos ? 'Si' : 'No'}</td>
                      <td className={cliente.esPremium ? 'px-4 py-2 bg-blue-200 text-center text-white' : 'px-4 py-2 bg-red-300 text-center text-yellow-300'}>{cliente.esPremium ? 'Si' : 'No'}</td>
                      <td className='px-4 py-2'>{cliente.chequeosTotales}</td>
                      <td className='px-4 py-2'>{cliente.cortesTotales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </>
      )}
    </div>
  );
  
}
