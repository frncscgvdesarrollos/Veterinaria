'use client'
import { UserAuth } from '@/app/context/AuthContext';
import { registroVentaPeluqueria } from '@/app/firebase';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function PagoTurnoPeluqueriaMPexitoso() {
    const { user } = UserAuth();
    const uid = user?.uid;
    // State to hold the venta object
    const [venta, setVenta] = useState({
      id: 0,
      userId: uid,
      createdAt: new Date(),
      precio: 0, // Set a default value for precio
      productoOservicio: "Peluqueria Canina",
      efectivo: false,
      mp: true,
      confirmado: false,
    });
  
    // State to hold the extracted query parameters
    const [queryParams, setQueryParams] = useState({});
    const [ventaRegistrada, setVentaRegistrada] = useState(false);
  
    const extractQueryParams = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const params = {};
      for (const [key, value] of queryParams) {
        params[key] = value;
      }
      setQueryParams(params);
    }
  
    // Call the extractQueryParams function once when the component mounts
    useEffect(() => {
      extractQueryParams();
    }, []);
  
    // Function to handle the registration of venta
    const registrarVenta = () => {
      // Register venta if necessary
      if (!ventaRegistrada) {
        registroVentaPeluqueria(venta);
        setVentaRegistrada(true); // Set the flag to true after registration
      }
    }
  
    // Call the registration function only once after component mount
    let num = 1;
    useEffect(() => {
      if (num === 1){
      registrarVenta();
      num = num + 1;
      }
    }, []); 
  
    return (
      <div>
        <h2>Pago completado correctamente!</h2>
        <h3>El turno de peluquería quedó registrado.</h3>
        <h4>Cualquier duda o consulta, llame a la Veterinaria.</h4>
        <div>
          <h5>Información de los parámetros:</h5>
          <ul>
            {Object.entries(queryParams).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </div>
        <Link href='/HomeCliente'>Volver</Link>
      </div>
    )
  }
  