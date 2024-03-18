'use client';
import { useState, useEffect } from "react";
import { confirmarTerminos } from "../firebase";
import { redirect } from "next/navigation";
import { UserAuth } from "../context/AuthContext";

export default function Terminos() {
  const { user } = UserAuth();
  const uid = user?.uid;

  const [terminos, setTerminos] = useState(false);
  const [modal, setModal] = useState(false);
  const [confirmacion, setConfirmacion] = useState(false);

  const handleConfirmacion = () => {
    return new Promise((resolve, reject) => {
      try {
        setConfirmacion(true);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const handleSetTerminos = () => {
    return new Promise((resolve, reject) => {
      try {
        confirmarTerminos(uid)
          .then(() => {
            setTerminos(true);
            setModal(false);
            handleConfirmacion()
              .then(() => resolve())
              .catch(error => reject(error));
          })
          .catch(error => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    if (confirmacion) {
      redirect("/HomeCliente");
    }
  }, [confirmacion]);

  return (
    <div className="flex flex-col items-center justify-center">
    {!terminos ? (
      <div className="w-full max-w-lg bg-gray-700 text-white rounded-lg mb-8 p-5 mt-5">
        <h1 className="p-5 text-center">Términos y Condiciones de la Veterinaria</h1>
        <p className="p-5 text-center">¡Lee atentamente!</p>
      </div>
    ) : null}
    {modal ? (
      <div className="w-full max-w-lg bg-gray-700 text-white rounded-lg mb-8 ">
        <h2 className="p-5 text-center">Nuestra forma de trabajo</h2>
        <p className="p-5 text-center text-4xl">Vuelve a confirmar los términos y condiciones a continuación.</p>
        <button className="bg-red-500 p-5 m-auto mb-5 w-2/3 rounded-xl text-3xl text-center text-white border-4 border-red-700 ml-24" onClick={handleSetTerminos}>acepto</button>
      </div>
    ) : (
      <section className="w-full max-w-lg bg-gray-700 text-white rounded-lg mb-8">
        <h2 className="p-5 text-center">Nuestra forma de trabajo</h2>
        <div className="overflow-auto p-5">
          <p className="text-justify">
            {/* Texto completo de los términos y condiciones */}
            Términos y Condiciones - Servicios Veterinarios y de Peluquería Canina
            <br />
            <br />
            1. Reservas y Confirmación de Turnos Veterinarios:
            <br />
            <br />
            Las reservas para los servicios de chequeo veterinario se realizan a través de nuestra plataforma en línea.
            <br />
            <br />
            Los horarios de chequeo veterinario quedan a confirmar siempre telefónicamente después de realizar la reserva en línea. Un miembro de nuestro equipo se pondrá en contacto contigo para confirmar la disponibilidad y acordar el horario final del turno.
            <br />
            <br />
            2. Servicio de Peluquería Canina - Recolección y Devolución de Mascotas:
            <br />
            <br />
            El servicio de peluquería canina incluye momentos específicos de recolección y devolución de las mascotas.
            <br />
            <br />
            Las mascotas programadas para el servicio de la mañana (8:00 - 10:00) serán recogidas en ese intervalo y devueltas entre las 12:00 y las 14:00 horas.
            <br />
            <br />
            Las mascotas programadas para el servicio de la tarde serán recogidas entre las 12:00 y las 14:00 horas, y se devolverán a partir de las 16:00 hasta las 18:00 horas.
            <br />
            <br />
            Se espera que los dueños estén disponibles durante estos horarios para facilitar la recolección y devolución de las mascotas.
            <br />
            <br />
            3. Cambios en los Horarios:
            Cualquier cambio en los horarios acordados debe ser comunicado con anticipación y está sujeto a disponibilidad.
            Nos reservamos el derecho de ajustar los horarios en caso de circunstancias imprevistas, lo cual será comunicado a los clientes tan pronto como sea posible.
            <br />
            <br />
            4. Responsabilidades del Cliente:
            <br />
            <br />
            Es responsabilidad del cliente proporcionar información precisa y actualizada al momento de realizar la reserva.
            <br />
            <br />
            Los clientes deben asegurarse de que sus mascotas estén disponibles para la recolección y devolución en los horarios acordados.
            <br />
            <br />
            Estos términos y condiciones están sujetos a cambios, y cualquier actualización se comunicará a los clientes de manera oportuna. Al utilizar nuestros servicios, aceptas cumplir con estos términos y condiciones. Para cualquier pregunta o aclaración, no dudes en ponerte en contacto con nuestro equipo. ¡Gracias por confiar en nuestros servicios!
          </p>
        </div>
        <button className="btn bg-blue-600 hover:bg-blue-400 p-5 w-2/3 ml-24 rounded-xl text-2xl font-bold text-white hover:text-black" onClick={handleModal}>acepto</button>
      </section>
    )}
  </div>
  
  );
}
