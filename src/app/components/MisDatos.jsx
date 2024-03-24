'use client'
import { UseClient } from "../context/ClientContext";

export default function MisDatos() {
  const { datosCliente } = UseClient();
  const {nombre , apellido, direccion, telefono, esquina , esPremium, cortesTotales, chequeosTotales, tieneMascotas } = datosCliente;

  return (
    <div className="h-screen bg-gray-400 rounded-lg shadow-lg p-6 flex flex-col sm:w-full lg:w-full text-white">
      <h1 className="text-3xl font-semibold mb-4 text-gray-900">Informacion Personal</h1>
      <p className="p-2 text-lg mb-2 bg-gray-700 rounded-lg text-yellow-300">Recuerde que tanto la veracidad de sus datos como la de su mascota son vitales para un correcto servicio!</p>
      {datosCliente && (
        <div className="mt-4 space-y-2 text-gray-900">
          <p className="text-lg mb-2"><span className="font-semibold">Nombre:</span> {nombre}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Apellido:</span> {apellido}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Dirección:</span> {direccion}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Esquina con:</span> {esquina}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Teléfono:</span> {telefono}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Es Premium:</span> {esPremium ? 'Sí' : 'No'}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Tiene Mascota:</span> {tieneMascotas ? 'Sí' : 'No'}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Cortes Totales:</span> {cortesTotales}</p>
          <p className="text-lg mb-2"><span className="font-semibold">Chequeos Totales:</span> {chequeosTotales}</p>       
       </div>
      )}
      <div className="mt-4 flex justify-end">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-4">
          Editar
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
          Eliminar
        </button>
      </div>
    </div>
  );
}

