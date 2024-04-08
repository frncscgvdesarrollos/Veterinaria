'use client';
import { useEffect, useState } from 'react';
import { obtenerPreciosDeServicios } from '../firebase';

const tableCellStyles = "border px-4 py-2";

export default function PrecioPeluqueria() {
  const [precios, setPrecios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPrecios();
  }, []);

  function cargarPrecios() {
    setLoading(true);
    setError(null);
    obtenerPreciosDeServicios()
      .then(data => {
        console.log(data);
        if (data.length > 0) {
          setPrecios(data);
          setLoading(false);
        } else {
          setError("No se encontraron datos de precios.");
          setLoading(false);
        }
      })
      .catch(error => {
        setError("Error al cargar precios: " + error.message);
        setLoading(false);
      });
  }

  if (loading) {
    return <div>Cargando precios...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <h1 className='text-3xl font-bold mb-4'>Precios de peluquería</h1>
    <div className="overflow-x-auto rounded-lg p-4 bg-violet-300">
      <table className="w-full table-auto border-collapse rounded-lg">
        <thead className='rounded-lg'>
          <tr className="rounded-lg">
            <th className="border rounded-lg border-cyan-100 px-4 py-2">Servicio</th>
            <th className="border rounded-lg border-cyan-200 px-4 py-2">Precio Toy</th>
            <th className="border rounded-lg border-cyan-300 px-4 py-2">Precio Mediano</th>
            <th className="border rounded-lg border-cyan-400 px-4 py-2">Precio Grande</th>
            <th className="border rounded-lg border-cyan-500 px-4 py-2">Precio Gigante</th>
          </tr>
        </thead>
        <tbody className='bg-violet-300 rounded-lg'>
          {precios.map(precio => (
            <tr key={precio.id} className="text-center rounded-lg">
              <td className="border px-4 py-2 rounded-lg">{precio.id}</td>
              <td className="border px-4 py-2 rounded-lg">{precio.toy}</td>
              <td className="border px-4 py-2 rounded-lg">{precio.mediano}</td>
              <td className="border px-4 py-2 rounded-lg">{precio.grande}</td>
              <td className="border px-4 py-2 rounded-lg">{precio.gigante}</td>
            </tr>
          ))}
        </tbody >
      </table>
    </div>
  </>
  
  )
}
