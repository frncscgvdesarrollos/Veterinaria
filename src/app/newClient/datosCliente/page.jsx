'use client';
import React, { useEffect, useState , useCallback } from 'react';
import FormCliente from '../../components/nuevosClientes/FormCliente';
import { clienteExisteConTerminosTRUE } from '../../firebase';
import { UserAuth } from '../../context/AuthContext';
import { redirect } from 'next/navigation'; // Importar useRouter para navegación
import { crearOActualizarCliente } from '../../firebase'; // Importar la función de utilidad

export default function DatosCliente() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [errorVerificacion, setErrorVerificacion] = useState(null);

  useEffect(() => {
    if (user) {
      clienteExisteConTerminosTRUE(uid)
        .then((response) => {
          if (response) {
            setTerminosAceptados(true);
          } else {
            console.error("Terms not accepted for user:", uid);
            // Mostrar un mensaje de error o redireccionar al usuario a la página de términos
          }
        })
        .catch((error) => {
          console.error("Error verifying terms:", error);
          setErrorVerificacion(error);
        });
    }
  }, [user, uid]);

  useEffect(() => {
    if (terminosAceptados) {
      redirect('/HomeCliente'); // Redireccionar al usuario a HomeCliente si acepta los términos
    }
  }, [terminosAceptados]);

  // Función para manejar el envío del formulario
  const handleSubmit = (formData) => {
    // Validaciones del formulario aquí
    const requiredFields = ['nombre', 'apellido', 'direccion', 'telefono1', 'email', 'edad'];

    // Verificar que todos los campos requeridos estén completos
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`El campo '${field}' es obligatorio.`);
        return;
      }
    }

    // Verificar que la edad esté dentro de los límites
    const minEdad = 18;
    const maxEdad = 100;
    if (formData.edad < minEdad || formData.edad > maxEdad) {
      alert(`La edad debe estar entre ${minEdad} y ${maxEdad} años.`);
      return;
    }

    // Crear o actualizar el cliente
    crearOActualizarCliente(uid, formData)
      .then(() => {
        setTerminosAceptados(true); // Marcar los términos como aceptados
      })
      .catch((error) => {
        console.error("Error creating/updating client:", error);
        // Manejar el error de creación/actualización del cliente
      });
  };

  return (
    <div className='bg-gray-800 h-auto p-5'>
      <h1 className='text-4xl text-center font-bold mt-5 mb-5 text-red-400 underline'>
        Informacion personal
      </h1>
      {errorVerificacion && (
        <p className='text-red-500 text-center mb-5'>
          Error al verificar la aceptación de términos: {errorVerificacion.message}
        </p>
      )}
      <FormCliente onSubmit={handleSubmit} /> {/* Pasar la función handleSubmit al formulario */}
    </div>
  );
}
