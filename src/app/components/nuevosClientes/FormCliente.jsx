'use client';
import { useState, useEffect } from 'react';
import { registrarCliente } from '../../firebase';
import { redirect } from 'next/navigation';
import { UserAuth } from '../../context/AuthContext';

export default function FormCliente() {
  const { user } = UserAuth();
  useEffect(() => {
    if (user) {
      setDatosForm((prevState) => ({
        ...prevState,
        usuarioid: user?.uid
      }));
    }
  }, [user]);
  
  const [datosForm, setDatosForm] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    esquina: '',
    telefono: '',
    telefono2: '',
    usuarioid: user?.uid || '',
    terminos: false,
    turnosPeluqueria: 0,
    turnosConsulta: 0,
    esPremium: false,
    cliente: true,
  });

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedDatosForm = { ...datosForm, usuarioid: user?.uid };

    console.log("formData" , datosForm);
    return new Promise((resolve, reject) => {
      registrarCliente({ datosCliente: updatedDatosForm })
        .then(() => {

          resolve(window.location.href = '/HomeCliente');
          })
        .catch((error) => {
          // Manejar cualquier error
          console.error('Error al registrar cliente:', error);
          reject(error);
        });
    });
  };
  
  const handleChange = (event) => {
    console.log(datosForm)
    const { name, value, type, checked } = event.target;
    setDatosForm((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-gray-200 p-6 rounded-lg">
        <div className="mb-4">
          <p className="text-gray-700 text-lg mb-2">
            Por favor, completa los siguientes campos con información veraz y actualizada. Esta información es valiosa para poder ofrecerte un servicio de calidad.
          </p>
        </div>
        <label className="block mb-4">
          <span className="text-gray-700">Nombre:</span>
          <input
            type="text"
            name="nombre"
            value={datosForm.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Apellido:</span>
          <input
            type="text"
            name="apellido"
            value={datosForm.apellido}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Dirección:</span>
          <input
            type="text"
            name="direccion"
            value={datosForm.direccion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Esquina:</span>
          <input
            type="text"
            name="esquina"
            value={datosForm.esquina}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Teléfono:</span>
          <input
            type="text"
            name="telefono"
            value={datosForm.telefono}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Teléfono 2:</span>
          <input
            type="text"
            name="telefono2"
            value={datosForm.telefono2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3"
          />
        </label>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="terminos"
              checked={datosForm.terminos}
              onChange={handleChange}
              className="form-checkbox text-indigo-600"
            />
            <span className="ml-2 text-gray-700 cursor-pointer" onClick={toggleModal}>
              Acepto los términos y condiciones <span className="underline text-indigo-600">Ver terminos</span>
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Enviar
        </button>
      </form>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Términos y Condiciones</h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={toggleModal}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <section className="w-full bg-gray-700 text-white rounded-lg mb-8 p-5">
                  <h2 className="text-2xl font-bold text-center mb-5">Nuestra forma de trabajo</h2>
                  <div className="overflow-auto mb-8">
                    <p className="text-lg">
                      Términos y Condiciones - Servicios Veterinarios y de Peluquería Canina <br /><br />
                      1. Reservas y Confirmación de Turnos Veterinarios: <br /><br />
                      Las reservas para los servicios de chequeo veterinario se realizan a través de nuestra plataforma en línea. <br /><br />
                      Los horarios de chequeo veterinario quedan a confirmar siempre telefónicamente después de realizar la reserva en línea. Un miembro de nuestro equipo se pondrá en contacto contigo para confirmar la disponibilidad y acordar el horario final del turno. <br /><br />
                      2. Servicio de Peluquería Canina - Recolección y Devolución de Mascotas: <br /><br />
                      El servicio de peluquería canina incluye momentos específicos de recolección y devolución de las mascotas. <br /><br />
                      Las mascotas programadas para el servicio de la mañana (8:00 - 10:00) serán recogidas en ese intervalo y devueltas entre las 12:00 y las 14:00 horas. <br /><br />
                      Las mascotas programadas para el servicio de la tarde serán recogidas entre las 12:00 y las 14:00 horas, y se devolverán a partir de las 16:00 hasta las 18:00 horas. <br /><br />
                      Se espera que los dueños estén disponibles durante estos horarios para facilitar la recolección y devolución de las mascotas. <br /><br />
                      3. Cambios en los Horarios: Cualquier cambio en los horarios acordados debe ser comunicado con anticipación y está sujeto a disponibilidad. Nos reservamos el derecho de ajustar los horarios en caso de circunstancias imprevistas, lo cual será comunicado a los clientes tan pronto como sea posible. <br /><br />
                      4. Responsabilidades del Cliente: <br /><br />
                      Es responsabilidad del cliente proporcionar información precisa y actualizada al momento de realizar la reserva. <br /><br />
                      Los clientes deben asegurarse de que sus mascotas estén disponibles para la recolección y devolución en los horarios acordados. <br /><br />
                      Estos términos y condiciones están sujetos a cambios, y cualquier actualización se comunicará a los clientes de manera oportuna. Al utilizar nuestros servicios, aceptas cumplir con estos términos y condiciones. Para cualquier pregunta o aclaración, no dudes en ponerte en contacto con nuestro equipo. ¡Gracias por confiar en nuestros servicios!
                    </p>
                  </div>
                  <button className="btn bg-blue-600 hover:bg-blue-400 w-full" onClick={toggleModal}>
                    Acepto
                  </button>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


