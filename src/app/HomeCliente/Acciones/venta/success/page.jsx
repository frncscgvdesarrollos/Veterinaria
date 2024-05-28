'use client'
import Link from 'next/link';
import { UserAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { ventaEnCursoFalse, marcarPagoMercadoPago, confirmarPagos } from '@/app/firebase';

export default function ExitosoTienda() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [ventaTurno, setVentaTurno] = useState(null);
  let num = 0;

  useEffect(() => {
    console.log('efecto'+ num);
    num++;
    if (uid) {
      // Marcar la venta como no en curso, confirmar el pago y marcarlo como MercadoPago
      Promise.all([
        ventaEnCursoFalse(uid), // Marcar la venta como no en curso
        confirmarPagos(uid), // Confirmar los pagos de los turnos de peluquería
        marcarPagoMercadoPago(uid) // Marcar el pago como MercadoPago
      ])
      .then(() => {
        console.log('La venta y el pago han sido actualizados correctamente.');
        setVentaTurno(true); // Actualizar el estado si es necesario
      })
      .catch((error) => {
        console.error("Error al modificar la venta y el pago:", error);
      });
    }
  }, [uid, num]); // Include num in the dependency array
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">¡Pago exitoso por MercadoPago!</h2>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">El turno de peluquería ha sido pagado correctamente.</h3>
      <h4 className="text-md text-gray-600 mb-6">¡Gracias por tu compra!</h4>
      <Link href='/HomeCliente' className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Volver
      </Link>
    </div>
  );
  
}
