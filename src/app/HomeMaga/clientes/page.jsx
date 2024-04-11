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
        <div className='flex w-full sm:w-2/3'>
          <input
            type="text"
            className="px-4 py-2 border rounded-lg w-full sm:w-2/3 mr-4 ml-4 sm:ml-10"
            placeholder='Código Único Dueño'
            value={codigoBuscar}
            onChange={handleCodigoChange}
          />
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto'
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
            <div className='w-full mt-10 mb-10 p-6 font-semibold text-gray-700 rounded-lg bg-violet-200'>
              {clientes.find(cliente => cliente.usuarioid === codigoBuscar) ? (
                <ul className=" flex mx-auto text-gray-600 gap-2 bg-purple-400 text-gray-700 p-4 w-2/3 rounded-lg">
                  {clientes
                    .filter(cliente => cliente.usuarioid === codigoBuscar)
                    .map((cliente, index) => (
                      <React.Fragment key={index}>
                        <div className='w-full flex flex-col md:w-1/2'>
                          <li className="py-4">
                            <span className="font-semibold">Nombre:</span> {cliente.nombre}
                          </li>
                          <li className="py-4 ">
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
                        <div className='w-full md:w-1/2'>
                          <li className="py-4">
                            <span className="font-semibold">Es Premium:</span> {cliente.esPremium ? 'Si' : 'No'}
                          </li>
                          <li className="py-4">
                            <span className="font-semibold">Chequeos Totales:</span> {cliente.chequeosTotales}
                          </li>
                          <li className="py-4">
                            <span className="font-semibold">Cortes Totales:</span> {cliente.cortesTotales}
                          </li>
                          <li className="py-4">
                            <span className="font-semibold">Términos:</span> {cliente.terminos ? 'Si' : 'No'}
                          </li>
                          <li className="py-4">
                            <span className="font-semibold">ID de Usuario:</span> {cliente.usuarioid}
                          </li>
                          <div className='flex flex-row gap-4'>
                            <button className='bg-blue-600 hover:bg-blue-600 hover:text-pink-300  text-white px-4 py-2 rounded-lg w-full h-10' onClick={handleBuscarClick}>
                              Editar
                            </button>
                            <button className='bg-blue-500 hover:bg-blue-500 hover:text-pink-300 text-white px-4 py-2 rounded-lg w-full h-10' onClick={handleBuscarClick}>
                              Libreta
                            </button>
                            <button className='bg-blue-400 hover:bg-blue-400 hover:text-pink-600  text-white px-4 py-2 rounded-lg w-full h-10' onClick={handleBuscarClick}>
                              Registros
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                </ul>

              ) : (
                <p>No se encontraron clientes con el código único especificado.</p>
              )}
            </div>
            :
            <div className="overflow-x-auto rounded-lg w-full mx-auto">
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
                      <td className={cliente.terminos ? 'px-4 py-2 text-orange-400 text-center text-lg' : 'px-4 py-2  text-red-300 text-center'}>{cliente.terminos ? 'Si' : 'No'}</td>
                      <td className={cliente.esPremium ? 'px-4 py-2  text-center text-orange-400 text-lg' : 'px-4 py-2  text-center text-red-300'}>{cliente.esPremium ? 'Si' : 'No'}</td>
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
