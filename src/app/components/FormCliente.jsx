'use client';
import { useState , useEffect } from 'react';
import { clienteExiste, registrarCliente } from '../firebase';
import { redirect } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';

export default function FormCliente() {
  const { user } = UserAuth();
  const {uid }= user;
  const [yaEsCliente, setYaEsCliente] = useState(false);
  if(yaEsCliente) {
    handleEsCliente();
  }

  const [datosForm, setDatosForm] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    esquina: '',
    telefono: '',
    telefono2: '',
    usuarioId: uid,
    tieneMascotas:true,
    terminos: false,
    cortesTotales: 0,
    chequeosTotales: 0,
    esPremium: false,
  });
  console.log(datosForm)
  
  function handleEsCliente() {
    clienteExiste(uid)
      .then((esCliente) => {
        console.log(esCliente);
        if(esCliente.length === 0){
          setYaEsCliente(false);
        } 
        setYaEsCliente(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if(yaEsCliente){
      redirect('/datosMascota');
    }
  }, [yaEsCliente]);

  const handleSubmit = (event) => {
    event.preventDefault();
    registrarCliente({ datosCliente: datosForm });
    handleEsCliente();
  }

  const handleChange = (event) => {
    const { name , value: newValue } = event.target;
    setDatosForm(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  }

  return (
<form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-gray-200 p-6 rounded-lg">
    <div className="mb-4">
      <p className='text-gray-700 text-lg mb-2 '> Por favor, completa los siguientes campos con información veraz y actualizada. Esta información es valiosa para
        poder ofrecerte un servicio de calidad.</p>
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
  <button
    type="submit"
    className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
  >
    Enviar
  </button>
</form>


  )
}
