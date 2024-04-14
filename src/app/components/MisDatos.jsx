'use client'
import { UseClient } from "../context/ClientContext";
import { useState } from "react";
import { modificarCampoCliente } from "../firebase"; // Importamos la función de utilidad

export default function MisDatos() {
  const { datosCliente } = UseClient();
  const { nombre, apellido, direccion, telefono, esquina, esPremium, cortesTotales, chequeosTotales, tieneMascotas } = datosCliente;
  const [editingNombre, setEditingNombre] = useState(false);
  const [editingApellido, setEditingApellido] = useState(false);
  const [editingDireccion, setEditingDireccion] = useState(false);
  const [editingTelefono, setEditingTelefono] = useState(false);
  const [editingEsquina, setEditingEsquina] = useState(false);
  
  const [nombreNuevo, setNombreNuevo] = useState(nombre);
  const [apellidoNuevo, setApellidoNuevo] = useState(apellido);
  const [direccionNueva, setDireccionNueva] = useState(direccion);
  const [telefonoNuevo, setTelefonoNuevo] = useState(telefono);
  const [esquinaNueva, setEsquinaNueva] = useState(esquina);

  const handleEditNombre = () => {
    setEditingNombre(!editingNombre);
  }

  const handleEditApellido = () => {
    setEditingApellido(!editingApellido);
  }

  const handleEditDireccion = () => {
    setEditingDireccion(!editingDireccion);
  }

  const handleEditTelefono = () => {
    setEditingTelefono(!editingTelefono);
  }

  const handleEditEsquina = () => {
    setEditingEsquina(!editingEsquina);
  }

  const handleNombreChange = (newValue) => {
    setNombreNuevo(newValue);
  }

  const handleApellidoChange = (newValue) => {
    setApellidoNuevo(newValue);
  }

  const handleDireccionChange = (newValue) => {
    setDireccionNueva(newValue);
  }

  const handleTelefonoChange = (newValue) => {
    setTelefonoNuevo(newValue);
  }

  const handleEsquinaChange = (newValue) => {
    setEsquinaNueva(newValue);
  }

  const handleSubmit = () => {
    if (editingNombre) {
      modificarCampoCliente(datosCliente.usuarioid, 'nombre', nombreNuevo)
        .then(() => {
          console.log('Nombre actualizado exitosamente.');
          setEditingNombre(false);
        })
        .catch(error => console.error('Error al actualizar nombre:', error));
    }
    
    if (editingApellido) {
      modificarCampoCliente(datosCliente.usuarioid, 'apellido', apellidoNuevo)
        .then(() => {
          console.log('Apellido actualizado exitosamente.');
          setEditingApellido(false);
        })
        .catch(error => console.error('Error al actualizar apellido:', error));
    }
    
    if (editingDireccion) {
      modificarCampoCliente(datosCliente.usuarioid, 'direccion', direccionNueva)
        .then(() => {
          console.log('Dirección actualizada exitosamente.');
          setEditingDireccion(false);
        })
        .catch(error => console.error('Error al actualizar dirección:', error));
    }
    
    if (editingTelefono) {
      modificarCampoCliente(datosCliente.usuarioid, 'telefono', telefonoNuevo)
        .then(() => {
          console.log('Teléfono actualizado exitosamente.');
          setEditingTelefono(false);
        })
        .catch(error => console.error('Error al actualizar teléfono:', error));
    }
    
    if (editingEsquina) {
      modificarCampoCliente(datosCliente.usuarioid, 'esquina', esquinaNueva)
        .then(() => {
          console.log('Esquina actualizada exitosamente.');
          setEditingEsquina(false);
        })
        .catch(error => console.error('Error al actualizar esquina:', error));
    }
  }

  return (
    <div className="bg-violet-200 p-4 w-1/2 mx-auto h-[600px] rounded-lg">
      <h1 className="text-3xl font-semibold mb-4 text-gray-900">Mis datos</h1>
      <div className="max-w-xl mx-auto bg-violet-100 rounded-lg shadow-lg p-6 flex flex-col sm:w-full lg:w-full text-white h-[450px]  ">
        {datosCliente && (
          <div className="mt-4 space-y-2 text-gray-900">
            <p className="text-lg mb-2">
              <span className="font-semibold">Nombre:</span> {editingNombre ? <input type="text" value={nombreNuevo} onChange={(e) => handleNombreChange(e.target.value)} /> : nombre} 
              {!editingNombre && <button className="text-sm ml-2 text-blue-500" onClick={handleEditNombre}>Editar</button>}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Apellido:</span> {editingApellido ? <input type="text" value={apellidoNuevo} onChange={(e) => handleApellidoChange(e.target.value)} /> : apellido} 
              {!editingApellido && <button className="text-sm ml-2 text-blue-500" onClick={handleEditApellido}>Editar</button>}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Dirección:</span> {editingDireccion ? <input type="text" value={direccionNueva} onChange={(e) => handleDireccionChange(e.target.value)} /> : direccion} 
              {!editingDireccion && <button className="text-sm ml-2 text-blue-500" onClick={handleEditDireccion}>Editar</button>}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Teléfono:</span> {editingTelefono ? <input type="text" value={telefonoNuevo} onChange={(e) => handleTelefonoChange(e.target.value)} /> : telefono} 
              {!editingTelefono && <button className="text-sm ml-2 text-blue-500" onClick={handleEditTelefono}>Editar</button>}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Esquina con:</span> {editingEsquina ? <input type="text" value={esquinaNueva} onChange={(e) => handleEsquinaChange(e.target.value)} /> : esquina} 
              {!editingEsquina && <button className="text-sm ml-2 text-blue-500" onClick={handleEditEsquina}>Editar</button>}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Es Premium:</span> {esPremium ? 'Sí' : 'No'}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Cortes Totales:</span> {cortesTotales}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Chequeos Totales:</span> {chequeosTotales}
            </p>
          </div>
        )}
      </div>
      <button className="bg-violet-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4" onClick={handleSubmit}>Guardar Cambios</button>
    </div>
  );
}
