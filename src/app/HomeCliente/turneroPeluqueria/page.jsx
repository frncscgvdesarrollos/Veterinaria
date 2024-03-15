'use client';
import MyCalendarPeluqueria from '@/app/components/MesTurneroPeluqueria';

export default function Peluqueria() {
  return (
    <div className="mx-auto px-4 py-8 bg-violet-100 flex flex-col lg:flex-row">
      <div className=" w-2/3 flex flex-col ml-auto mr-auto">
      <div className="flex flex-col  justify-around ml-auto mr-auto ">
        <div className="lg:w-2/3 lg:ml-auto lg:mr-auto   bg-white p-6 rounded-lg h-full">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Servicio de Peluquería Canina</h2>
          <p className="text-2xl text-gray-700 mb-4">¡Reserva tus turnos en línea y acumula puntos para obtener cortes <span className='font-bold text-green-500 text-3xl'>GRATIS!</span></p>
          <p className="text-lg text-gray-700">El servicio de peluquería canina está diseñado para brindar el mejor cuidado y atención a tu mascota. No solo garantizamos cortes de calidad, sino que también recompensamos tu fidelidad con nuestro programa de puntos.</p>
        </div>
        <div className="lg:w-2/3 lg:ml-auto lg:mr-auto mt-8 bg-white p-6 rounded-lg">
          <h3 className="text-xl lg:text-2xl font-semibold mb-4">Verifica el turno antes de ejecutar el pago</h3>
          <p className="text-base lg:text-lg">Comprueba la validez de tus datos antes de realizar el pago.</p>
        </div>
      </div>
      </div>
      <div className="lg:w-2/3 bg-white p-6 rounded-lg m-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-8 mb-4">Completa el formulario</h2>
          <MyCalendarPeluqueria />
      </div>
    </div>

  );
}
