import MyCalendar from "@/app/components/pedirturnos/MesTurnero";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 bg-violet-100">
      <div className="flex flex-col lg:flex-row justify-center items-center">
        <div className="w-full lg:w-1/3 lg:mr-8 mb-8 lg:mb-0">
          <div className="bg-white p-6 rounded-lg mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-8 mb-4">Servicio de Veterinaria</h2>
            <p className="text-lg text-gray-700 mb-4">¡Reserva tus turnos en línea y acumula puntos para obtener consultas <span className='font-bold text-green-500'>GRATIS!</span></p>
            <p className="text-lg text-gray-700">El servicio de Veterinaria está diseñado para brindar el mejor cuidado y atención a tu mascota no solo en la veterinaria sino también a domicilio. Agradecemos tu confianza y recompensamos tu fidelidad con nuestro programa de puntos.</p>
            <div className="text-lg text-gray-700 mt-8 border-b-2 text-yellow-300 bg-gray-800 p-4 rounded-lg">
              <p className="text-xl">Puntos actuales: 03 </p>
              <p className="text-xl">Necesitas 7 puntos más para obtener una consulta gratuita</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl lg:text-2xl font-semibold mb-4">Verifica el turno antes de ejecutar el pago</h3>
            <p className="text-base lg:text-lg">Comprueba la validez de tus datos antes de realizar el pago.</p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-8 mb-4">Completa el formulario</h2>
          <MyCalendar />
        </div>
      </div>
    </div>
  );
}
