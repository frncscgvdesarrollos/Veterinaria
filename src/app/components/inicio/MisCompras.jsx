'use client';
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { misCompras } from '@/app/firebase';

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
    if (!timestamp) return ""; // Manejar el caso en que el timestamp es nulo o indefinido
    const date = new Date(timestamp.seconds * 1000); // Convertir el objeto Timestamp a una fecha de JavaScript
    return date.toLocaleDateString('es-AR'); // Puedes ajustar el formato según tus preferencias
  };

  return (
    <div className="mt-10">
      <h1 className="text-5xl font-bold mb-4 text-blue-600 text-center py-4">¡¡Tienes Compras en espera!!</h1>
      <div className="h-full w-full bg-blue-200 bg-opacity-50 rounded-lg p-4 element2">
        <h2 className="text-3xl font-bold mb-4 text-blue-600">Mis compras</h2>
        {isLoading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="">
            <table className="w-full border-collapse border border-blue-600">
              <thead>
                <tr>
                  <th className="border border-blue-600 px-4 py-2">Fecha</th>
                  <th className="border border-blue-600 px-4 py-2">Producto</th>
                  <th className="border border-blue-600 px-4 py-2">Cantidad</th>
                  <th className="border border-blue-600 px-4 py-2">Estado</th>
                  <th className="border border-blue-600 px-4 py-2">Precio Total</th>
                  <th className="border border-blue-600 px-4 py-2">Efectivo</th>
                  <th className="border border-blue-600 px-4 py-2">MP</th>
                  <th className="border border-blue-600 px-4 py-2">Entrega</th>
                </tr>
              </thead>
              <tbody>
                {registrosVenta.map((venta, index) => (
                <tr key={index}>     	
                    <td className="border border-blue-600 px-4 py-2">{formatDate(venta.createdAt)}</td>
                    <td className="border border-blue-600 px-4 py-2">{venta.items[0]?.nombre}</td>
                    <td className="border border-blue-600 px-4 py-2">{venta.items[0]?.cantidad}</td>
                    <td className="border border-blue-600 px-4 py-2">{venta.confirmado ? 'Confirmado' : 'No confirmado'}</td>
                    <td className="border border-blue-600 px-4 py-2">{venta?.precio}</td>
                    <td className="border border-blue-600 px-4 py-2">{venta.efectivo ? 'Sí' : 'No'}</td>
                    <td className="border border-blue-600 px-4 py-2">{venta.mp ? 'Sí' : 'No'}</td>
                    <td className="border border-blue-600 px-4 py-2 bg-red-200 text-white">{venta.entrega == "entregar" ? 'Esperando' : 'Camino'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* {registrosVenta.length > 1 && (
              <button
                onClick={toggleExpand}
                className="w-full mt-4 bg-blue-500 bg-opacity-70 text-white px-4 py-2 rounded-md"
              >
                {expanded ? 'Ocultar compras' : `Mostrar ${registrosVenta.length - 1} compras adicionales`}
              </button>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}
