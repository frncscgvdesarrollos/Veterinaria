'use client';
import React, { useState, useEffect } from 'react';
import { getClientes, getMascotas } from '@/app/firebase';
import Image from 'next/image';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buscar, setBuscar] = useState(false);
  const [codigoBuscar, setCodigoBuscar] = useState('');
  const [mascotasUsuario, setMascotasUsuario] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

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

  const handleBuscarClick = () => {
    if (codigoBuscar.trim() !== '') {
      if (!buscar) {
        setBuscar(true);
        setClienteSeleccionado(null);
      }
      getMascotas(codigoBuscar)
        .then((mascotas) => {
          setMascotasUsuario(mascotas);
        })
        .catch((error) => {
          console.error('Error al obtener mascotas del usuario:', error);
        });
    }
  };

  const handleCancelarClick = () => {
    if (buscar) {
      setBuscar(false);
      setCodigoBuscar('');
      setMascotasUsuario([]);
    } else {
      setCodigoBuscar('');
    }
  };

  const handleCodigoChange = (event) => {
    setCodigoBuscar(event.target.value);
  };

  const handleClickCliente = (clienteId) => {
    setBuscar(true);
    setCodigoBuscar(clienteId);
    setClienteSeleccionado(clienteId);
    getMascotas(clienteId)
      .then((mascotas) => {
        setMascotasUsuario(mascotas);
      })
      .catch((error) => {
        console.error('Error al obtener mascotas del usuario:', error);
      });
  };

  return (
    <div className="p-6 bg-purple-100 rounded-lg">
      <h1 className="text-3xl mb-6">Lista de clientes registrados</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="px-4 py-2 border rounded-lg"
          placeholder="Código Único Dueño"
          value={codigoBuscar}
          onChange={handleCodigoChange}
        />
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <button
            className={`bg-${buscar ? 'red' : 'blue'}-500 hover:bg-${
              buscar ? 'red' : 'blue'
            }-600 text-white px-4 py-2 rounded-lg`}
            onClick={buscar ? handleCancelarClick : handleBuscarClick}
          >
            {buscar ? 'Cancelar' : 'Buscar'}
          </button>
          {buscar && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={handleCancelarClick}
            >
              Recargar
            </button>
          )}
        </div>
      </div>
      {isLoading ? (
        <p>Cargando clientes...</p>
      ) : (
        <>
          {buscar || clienteSeleccionado ? (
            <div className="w-full mt-10 mb-10 p-6 font-semibold text-gray-700 rounded-lg bg-violet-200">
              {clientes.find((cliente) => cliente.usuarioid === codigoBuscar) ? (
                <>
                  <ul className="mx-auto text-gray-600 gap-2 bg-purple-300 text-gray-700 p-4 rounded-lg">
                    {clientes
                      .filter((cliente) => cliente.usuarioid === codigoBuscar)
                      .map((cliente, index) => (
                        <React.Fragment key={index}>
                          <div className="w-full flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 p-4">
                              <ul className="text-gray-600 gap-2 bg-purple-400 text-gray-700 p-4 rounded-lg flex gap-10">
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
                                    <span className="font-semibold">Teléfono:</span> {cliente.telefono}
                                  </li>
                                </div>
                                <div>
                                  <li className="py-4">
                                    <span className="font-semibold">Términos:</span> {cliente.terminos ? 'Si' : 'No'}
                                  </li>
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
                              </ul>
                            </div>
                            <div className="w-full md:w-1/2 p-4 ">
                              <div className="mascotas-grid flex h-[200px] gap-6 items-center border border-gray-200 rounded-lg p-4 gradient bg-violet-500">
                                {mascotasUsuario.map((mascota, index) => (
                                  <div key={index} className="mascota-item mx-auto  rounded-lg">
                                    <Image src={mascota.foto} alt={mascota.nombre} width={100} height={100} className="rounded-full" />
                                    <p className="mascota-nombre">{mascota.nombre}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-4 mt-4">
                                <button className="bg-blue-600 hover:bg-blue-600 hover:text-pink-300 text-white px-4 py-2 rounded-lg w-full h-10" onClick={handleCancelarClick}>
                                  Editar
                                </button>
                                <button className="bg-blue-500 hover:bg-blue-500 hover:text-pink-300 text-white px-4 py-2 rounded-lg w-full h-10" onClick={handleCancelarClick}>
                                  Libreta
                                </button>
                                <button className="bg-blue-400 hover:bg-blue-400 hover:text-pink-600 text-white px-4 py-2 rounded-lg w-full h-10" onClick={handleCancelarClick}>
                                  Registros
                                </button>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                  </ul>
                </>
              ) : (
                <p>No se encontraron clientes con el código único especificado.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg w-full mx-auto">
              <table className="w-full table-auto bg-white border border-purple-200 rounded-lg shadow-md">
                <thead className="text-lg bg-violet-200">
                  <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Apellido</th>
                    <th className="px-4 py-2">Dirección</th>
                    <th className="px-4 py-2">Teléfono</th>
                    <th className="px-4 py-2">Términos</th>
                    <th className="px-4 py-2">Es Premium</th>
                    <th className="px-4 py-2">Chequeos Totales</th>
                    <th className="px-4 py-2">Cortes Totales</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-purple-300' : 'bg-violet-200'} onClick={() => handleClickCliente(cliente.usuarioid)}>
                      <td className="px-4 py-2">{cliente.nombre}</td>
                      <td className="px-4 py-2">{cliente.apellido}</td>
                      <td className="px-4 py-2">{cliente.direccion}</td>
                      <td className="px-4 py-2">{cliente.telefono}</td>
                      <td className={cliente.terminos ? 'px-4 py-2 text-orange-400 text-center text-lg' : 'px-4 py-2  text-red-300 text-center'}>{cliente.terminos ? 'Si' : 'No'}</td>
                      <td className={cliente.esPremium ? 'px-4 py-2  text-center text-orange-400 text-lg' : 'px-4 py-2  text-center text-red-300'}>{cliente.esPremium ? 'Si' : 'No'}</td>
                      <td className="px-4 py-2">{cliente.chequeosTotales}</td>
                      <td className="px-4 py-2">{cliente.cortesTotales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
