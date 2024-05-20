import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { misCompras } from '@/app/firebase';

// Componente VentaItem.jsx

const VentaItem = ({ venta, formatDate }) => {
  return (
<li className="py-4 border-b border-gray-200">
    <div className="flex flex-col md:flex-row justify-between  items-start">
        <div className="mb-2 md:mb-0">
            <p className="font-bold text-gray-800">{formatDate(venta.createdAt)}</p>
            <p className="text-gray-700">{venta.items[0]?.nombre}</p>
            <p className="text-gray-700">Cantidad: {venta.items[0]?.cantidad}</p>
            <p className="text-gray-700 mt-2">{venta.efectivo ? 'Pago en efectivo' : 'Pago no efectivo'}</p>
            <p className="text-gray-700">{venta.mp ? 'Pago con MercadoPago' : 'No se utilizó MercadoPago'}</p>
            <p className="text-gray-700">{venta.entrega === 'entregar' ? 'Esperando entrega' : 'En camino'}</p>
        </div>
        <div className="flex flex-col items-end">
            <p className={`px-2 py-1 rounded ${
                venta.confirmado ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>{venta.confirmado ? 'Confirmado' : 'No confirmado'}</p>
            <p className="text-gray-800 mt-4 md:mt-0">Precio Total: ${venta?.precio}</p>
        </div>
    </div>
</li>



  );
};


export default function MisCompras() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [registrosVenta, setRegistrosVenta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const formatDate = timestamp => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('es-AR');
  };

  return (
    <div className="mt-5">
      <h1 className="text-5xl font-bold mb-4 text-blue-600 text-center py-4">¡¡Tienes Compras en espera!!</h1>
      <div className="bg-blue-200 bg-opacity-50 rounded-lg p-4 element2">
        <h2 className="text-3xl font-bold mb-4 text-blue-600">Mis compras</h2>
        {isLoading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {registrosVenta.map((venta, index) => (
              <VentaItem key={index} venta={venta} formatDate={formatDate} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
