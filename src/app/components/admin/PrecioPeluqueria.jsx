'use client';
import { useEffect, useState } from 'react';
import {
  obtenerPreciosDeServicios,
  crearPrecioDeServicio,
  actualizarPrecioDeServicio,
  eliminarPrecioDeServicio,
} from '../../firebase';

export default function PrecioPeluqueria() {
  const [servicios, setServicios] = useState([
    'BañoCorteHigienico',
    'BañoCorteHigienicoPelar',
    'BañoCorteHigienicoCepillado',
    'BañoCorteHigienicoCorte'
  ]); // Aquí deberías tener los nombres de los servicios
  const [precios, setPrecios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [precioSeleccionado, setPrecioSeleccionado] = useState(null);
  const [nuevoPrecio, setNuevoPrecio] = useState({ toy: '', mediano: '', grande: '', gigante: '' });
  const [selectedServicio, setSelectedServicio] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPrecios();
  }, []);

  const cargarPrecios = () => {
    obtenerPreciosDeServicios()
      .then(data => {
        console.log(data);
        setPrecios(data);
        setError(null);
      })
      .catch(error => {
        console.error(error);
        setError('Error al cargar los precios');
      });
  };

  const abrirModal = (precio) => {
    setPrecioSeleccionado(precio);
    setSelectedServicio(precio.id); // Aquí debería establecerse el servicio seleccionado al abrir el modal de actualización
    setModalOpen(true);
  };
  

  const cerrarModal = () => {
    setPrecioSeleccionado(null);
    setModalOpen(false);
    setNuevoPrecio({ toy: '', mediano: '', grande: '', gigante: '' });
    setSelectedServicio('');
    setError(null);
  };

  const crearPrecio = () => {
    const nuevoPrecioObj = {
      toy: parseFloat(nuevoPrecio.toy),
      mediano: parseFloat(nuevoPrecio.mediano),
      grande: parseFloat(nuevoPrecio.grande),
      gigante: parseFloat(nuevoPrecio.gigante)
    };

    if (!selectedServicio) {
      setError('Por favor, seleccione un servicio.');
      return;
    }

    crearPrecioDeServicio(selectedServicio, nuevoPrecioObj)
      .then(() => {
        cargarPrecios();
        cerrarModal();
        setError(null);
      })
      .catch(error => {
        console.error(error);
        setError('Error al crear el precio');
      });
  };
  const actualizarPrecioExistente = () => {
    // Convertir los valores de los precios a números
    const nuevoPrecioObj = {
      toy: parseFloat(nuevoPrecio.toy),
      mediano: parseFloat(nuevoPrecio.mediano),
      grande: parseFloat(nuevoPrecio.grande),
      gigante: parseFloat(nuevoPrecio.gigante)
    };
  
    if (!selectedServicio) {
      setError('Por favor, seleccione un servicio.');
      return Promise.reject('No se ha seleccionado ningún servicio.'); // Rechaza la promesa si no se ha seleccionado un servicio
    }
  
    return new Promise((resolve, reject) => {
      // Obtener el precio existente
      const precioExistente = precios.find(precio => precio.id === precioSeleccionado.id);
      if (!precioExistente) {
        setError('No se encontró el precio para actualizar.');
        reject('No se encontró el precio para actualizar.');
        return;
      }
  
      // Actualizar solo los valores proporcionados, dejando los anteriores intactos si no se proporciona un nuevo valor
      const precioActualizado = {
        toy: nuevoPrecioObj.toy || precioExistente.toy,
        mediano: nuevoPrecioObj.mediano || precioExistente.mediano,
        grande: nuevoPrecioObj.grande || precioExistente.grande,
        gigante: nuevoPrecioObj.gigante || precioExistente.gigante
      };
  
      // Actualizar el precio
      actualizarPrecioDeServicio(precioSeleccionado.id, precioActualizado)
        .then(() => {
          cargarPrecios();
          cerrarModal();
          setError(null);
          resolve(); // Resuelve la promesa si la actualización se realiza con éxito
        })
        .catch(error => {
          console.error(error);
          setError('Error al actualizar el precio');
          reject(error); // Rechaza la promesa si hay un error al actualizar el precio
        });
    });
  };
  

  const eliminarPrecio = (id) => {
    eliminarPrecioDeServicio(id)
      .then(() => {
        cargarPrecios();
        setError(null);
      })
      .catch(error => {
        console.error(error);
        setError('Error al eliminar el precio');
      });
  };
return(
<>
  <div className="overflow-x-auto p-4 bg-violet-200 rounded-lg shadow-md">
    <h1 className='text-3xl font-bold mb-4 text-purple-800'>Precios de peluquería</h1>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse rounded-lg">
        <thead className='rounded-lg bg-violet-300 '>
          <tr>
            <th className="border px-4 py-2">Servicio</th>
            <th className="border px-4 py-2">Precio Toy</th>
            <th className="border px-4 py-2">Precio Mediano</th>
            <th className="border px-4 py-2">Precio Grande</th>
            <th className="border px-4 py-2">Precio Gigante</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {precios.map((precio, index) => (
            <tr key={index} className="text-center bg-violet-100">
              <td className="border px-4 py-2">{servicios[index]}</td>
              <td className="border px-4 py-2">{precio.toy}</td>
              <td className="border px-4 py-2">{precio.mediano}</td>
              <td className="border px-4 py-2">{precio.grande}</td>
              <td className="border px-4 py-2">{precio.gigante}</td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => abrirModal(precio)}>Actualizar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {modalOpen && (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-gray-500 bg-opacity-75">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full sm:max-w-lg">
          <div className="p-4">
            <h1 className="text-lg font-bold mb-4">
              {precioSeleccionado ? 'Actualizar Precio' : 'Crear Nuevo Precio'}
            </h1>
            {precioSeleccionado && (
              <>
                <h2 className="text-sm font-bold">Precio actual:</h2>
                <div className="mb-4 flex">
                  <p className='p-2'>Toy: {precioSeleccionado.toy}</p>
                  <p className='p-2'>Mediano: {precioSeleccionado.mediano}</p>
                  <p className='p-2'>Grande: {precioSeleccionado.grande}</p>
                  <p className='p-2'>Gigante: {precioSeleccionado.gigante}</p>
                </div>
              </>
            )}

            <div className="mb-4">
              <h2 className="text-sm font-bold">Nuevo precio:</h2>
              <div className="mb-4 flex flex-col">
                <input
                  type="text"
                  placeholder={'Toy'}
                  value={nuevoPrecio.toy}
                  onChange={(e) => setNuevoPrecio({ ...nuevoPrecio, toy: e.target.value })}
                  className="mb-2 border rounded-md px-3 py-2"
                />
                <input
                  type="text"
                  placeholder={'Mediano'}
                  value={nuevoPrecio.mediano}
                  onChange={(e) => setNuevoPrecio({ ...nuevoPrecio, mediano: e.target.value })}
                  className="mb-2 border rounded-md px-3 py-2"
                />
                <input
                  type="text"
                  placeholder={'Grande'}
                  value={nuevoPrecio.grande}
                  onChange={(e) => setNuevoPrecio({ ...nuevoPrecio, grande: e.target.value })}
                  className="mb-2 border rounded-md px-3 py-2"
                />
                <input
                  type="text"
                  placeholder={'Gigante'}
                  value={nuevoPrecio.gigante}
                  onChange={(e) => setNuevoPrecio({ ...nuevoPrecio, gigante: e.target.value })}
                  className="mb-2 border rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={cerrarModal}>Cerrar</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={precioSeleccionado ? actualizarPrecioExistente : crearPrecio}>
                {precioSeleccionado ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</>
)
}
