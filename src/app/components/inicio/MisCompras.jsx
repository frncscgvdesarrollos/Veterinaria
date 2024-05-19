'use client';
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { misCompras } from '../../firebase';

export default function MisCompras() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [registrosVenta, setRegistrosVenta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchRegistrosVenta = () => {
      setIsLoading(true);
      if (uid) {
        misCompras(uid)
          .then(ventasSnapshot => {
            setRegistrosVenta(ventasSnapshot);
          })
          .catch(error => {
            setError('Error al obtener los registros de venta');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };

    if (uid) {
      fetchRegistrosVenta();
    }
  }, [uid]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const formatDate = timestamp => {
    if (!timestamp || !timestamp.toDate) return ""; // Manejar el caso en que el timestamp es nulo o indefinido
    const date = timestamp.toDate(); // Convertir el objeto Timestamp a una fecha de JavaScript
    return date.toLocaleDateString('es-AR'); // Puedes ajustar el formato según tus preferencias
  };

  return (
    <div className="h-full bg-blue-200 bg-opacity-50 rounded-lg p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Mis compras</h1>
      {isLoading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {registrosVenta.length > 0 && (
            <React.Fragment>
              <div className="bg-blue-300 bg-opacity-70 rounded-lg p-2 h-auto">
                <div key={0} className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">{formatDate(registrosVenta[0].fecha)}</h2>
                  <ul>
                    <li className="mb-2">
                      <strong className='text-lg'>Producto:</strong> {registrosVenta[0].producto}
                    </li>
                    <li className="mb-2">
                      <strong className='text-lg'>Cantidad:</strong> {registrosVenta[0].cantidad}
                    </li>
                    <li className="mb-2">
                      <strong className='text-lg'>Estado:</strong> {registrosVenta[0].estado}
                    </li>
                    <li className='mb-2'>
                      <strong className='text-lg'>Precio Total:</strong> {registrosVenta[0].precioTotal}
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="bg-blue-500 bg-opacity-70 text-white px-4 py-2 rounded-md"
              >
                {expanded ? 'Ocultar compras' : `Mostrar ${registrosVenta.length - 1} compras adicionales`}
              </button>
              {expanded && (
                <div className="bg-blue-300  rounded-lg p-2 h-auto flex flex-col gap-4">
                  {registrosVenta.slice(1).map((venta, index) => (
                    <div key={index + 1} className="mb-4">
                      <h2 className="text-xl font-semibold mb-2">{formatDate(venta.fecha)}</h2>
                      <ul>
                        <li className="mb-2">
                          <strong className='text-lg'>Producto:</strong> {venta.producto}
                        </li>
                        <li className="mb-2">
                          <strong className='text-lg'>Cantidad:</strong> {venta.cantidad}
                        </li>
                        <li className="mb-2">
                          <strong className='text-lg'>Estado:</strong> {venta.estado}
                        </li>
                        <li className='mb-2'>
                          <strong className='text-lg'>Precio Total:</strong> {venta.precioTotal}
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}
