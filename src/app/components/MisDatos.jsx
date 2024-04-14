'use client'
import { UseClient } from "../context/ClientContext";

export default function MisDatos() {
  const { datosCliente } = UseClient();
  const { nombre, apellido, direccion, telefono, esquina, esPremium, cortesTotales, chequeosTotales, tieneMascotas } = datosCliente;

  return (
    <div className="max-w-xl mx-auto bg-violet-100 rounded-lg shadow-lg p-6 flex flex-col sm:w-full lg:w-full text-white">
      <h1 className="text-3xl font-semibold mb-4 text-gray-900">Informacion Personal</h1>
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
      <div className="mt-6 flex justify-end">
        <button className="bg-violet-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-4">
          Editar
        </button>
      </div>
    </div>
  );
}
