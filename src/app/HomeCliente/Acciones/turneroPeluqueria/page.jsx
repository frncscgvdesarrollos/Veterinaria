import MyCalendarPeluqueria from '@/app/components/pedirturnos/MesTurneroPeluqueria';
export default function Peluqueria() {
  return (
    <div className="mx-auto p-2 lg:p-10 bg-violet-100 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 lg:pr-4 flex flex-col mb-8 lg:mb-0">
        <div className="bg-white p-6 rounded-lg mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">Servicio de Peluquería Canina</h2>
          <p className="text-lg lg:text-base text-gray-700 mb-4">¡Reserva tus turnos en línea y acumula puntos para obtener cortes <span className='font-bold text-green-500 lg:text-3xl'>GRATIS!</span></p>
          <p className="text-base lg:text-lg text-gray-700">El servicio de peluquería canina está diseñado para brindar el mejor cuidado y atención a tu mascota. No solo garantizamos cortes de calidad, sino que también recompensamos tu fidelidad con nuestro programa de puntos.</p>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl lg:text-2xl font-semibold mb-4">Verifica el turno antes de ejecutar el pago</h3>
          <p className="text-base lg:text-lg">Comprueba la validez de tus datos antes de realizar el pago.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-8 mb-4">Completa el formulario</h2>
        <MyCalendarPeluqueria />
      </div>
    </div>
  );
}
