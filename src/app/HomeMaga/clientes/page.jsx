'use client'
import { useState, useEffect } from 'react';
import { getClientes } from '@/app/firebase';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(clientes);
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
  }, [clientes]);

  return (
    <div>
      <h1>Lista de clientes registrados</h1>
      {isLoading ? (
        <p>Cargando clientes...</p>
      ) : (
        <table className='w-2/3 m-auto text-center'>
          <thead className='w-full text-xl'> 
            <tr className='w-full'>
              <th className='w-auto'>Nombre</th>
              <th className='w-auto'>Apellido</th>
              <th className='w-auto'>Dirección</th>
              <th className='w-auto'>Teléfono</th>
              <th className='w-auto'>Terminos</th>
              <th className='w-auto'>Es Premium</th>
              <th className='w-auto'>Chequeos Totales</th>
              <th className='w-auto'>Cortes Totales</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => (
              <tr key={index}>
                <td>{cliente.datosCliente.nombre}</td>
                <td>{cliente.datosCliente.apellido}</td>
                <td>{cliente.datosCliente.direccion}</td>
                <td>{cliente.datosCliente.telefono}</td>
                <td className={cliente.datosCliente.terminos ? 'bg-green-500 text-white' : 'bg-red-500 text-yellow-300'}  >{cliente.datosCliente.terminos ? 'Si' : 'No'}</td>
                <td className={cliente.datosCliente.esPremium ? 'bg-green-500 text-white' : 'bg-red-500 text-yellow-300'}>{cliente.datosCliente.esPremium ? 'Si' : 'No'}</td>
                <td>{cliente.datosCliente.chequeosTotales}</td>
                <td>{cliente.datosCliente.cortesTotales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

