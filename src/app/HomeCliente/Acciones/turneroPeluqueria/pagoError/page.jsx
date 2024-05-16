'use client'
import Link from 'next/link';
import { UserAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { ventaEnCurso, ventaEnCursoFalse, marcarPagoEfectivo } from '@/app/firebase';

export default function PagoTurnoPeluqueriaError() {
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
  }, [uid]);

  return (
    <div>
      <h2>No se pudo realizar el pago por MercadoPago.</h2>
      <h3>El turno de peluquería quedó registrado para pagar en efectivo.</h3>
      <h4>Cualquier duda o consulta, llame a la Veterinaria.</h4>
      <Link href='/HomeCliente'>Volver</Link>
    </div>
  );
}
