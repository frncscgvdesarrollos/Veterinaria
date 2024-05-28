'use client'
import Link from 'next/link';
import { UserAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { ventaEnCurso, ventaEnCursoFalse, marcarPagoEfectivo } from '@/app/firebase';

export default function ErrorProducto() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [ventaTurno, setVentaTurno] = useState(null);
  
  let num = 0;
   useEffect(() => {
    console.log('efecto'+ num);
    num++;
    if (uid) {
      // Marcar la venta como no en curso y el pago como efectivo
      ventaEnCurso(uid)
        .then((venta) => {
          if (venta) {
            return Promise.all([
              ventaEnCursoFalse(uid), // Marcar la venta como no en curso
              marcarPagoEfectivo(uid) // Marcar el pago como efectivo
            ]);
          } else {
            throw new Error("ID de venta inválido.");
          }
        })
        .then(() => {
          console.log('La venta y el pago han sido actualizados correctamente.');
          setVentaTurno(true); // Actualizar el estado si es necesario
        })
        .catch((error) => {
          console.error("Error al obtener o modificar la venta:", error);
        });
    }
  }, [uid, num]); // Include num in the dependency array
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">No se pudo realizar el pago por MercadoPago.</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">La compra quedó registrada para pagar en efectivo.</h3>
        <h4 className="text-md text-gray-600 mb-6">Cualquier duda o consulta, llame a la Veterinaria.</h4>
        <Link href="/HomeCliente">
          <a className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Volver
          </a>
        </Link>
      </div>
    </div>
  );
  
}
