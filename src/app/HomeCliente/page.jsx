'use client';
import Veterinaria from '../components/inicio/Veterinaria';
import MisDatos from '../components/inicio/MisDatos';
import DatosMascotas from '../components/inicio/DatosMascotas';
import Productos from '../components/inicio/Productos';
import MascotasAdopcion from '../components/inicio/MascotasAdopcion';
import MisTurnos from '../components/inicio/MisTurnos';
import { UserAuth } from '../context/AuthContext';
import { redirect } from 'next/navigation';
import { clienteExiste } from '../firebase';
export default function HomeCliente() {
  const { user } = UserAuth();
  const uid = user?.uid;

function verificarCliente(uid) {
  return new Promise((resolve, reject) => {
    clienteExiste(uid)
      .then(cliente => {
        if (cliente) {
          // El cliente existe, resolvemos la promesa con el cliente
          resolve(cliente);
        } else {
          // El cliente no existe, rechazamos la promesa
          reject(new Error(`No se encontró ningún cliente con el UID proporcionado: ${uid}`));
        }
      })
      .catch(error => {
        // Manejar cualquier error ocurrido al consultar el cliente
        reject(error);
      });
  });
}

// Ejemplo de uso
verificarCliente(uid)
  .then(cliente => {
    // El cliente existe, puedes hacer lo que necesites aquí
    console.log("El cliente existe:", cliente);
  })
  .catch(error => {
    // El cliente no existe o ocurrió un error
    console.error(error.message);
    // Redirigir a la página de datos del nuevo cliente
    window.location.href = '/newClient/datosCliente';
  });


  if (!user) {
    return redirect('/newClient/datosCliente');
  }

  return (
    <div className="min-h-screen flex flex-col p-2 lg:container-perspective">
      <div className="rounded-lg mb-8">
        <Veterinaria />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 container-perspective">
        <div className="p-3 lg:p-5 element2 w-2/3 mx-auto h-[300px] lg:h-[400px] rounded-lg bg-violet-100 bg-opacity-50 flex flex-col gap-4 my-10">
          <MisDatos />
          <MisTurnos  />
        </div>
        <div className="bg-violet-100 bg-opacity-50 rounded-lg p-3 lg:p-5 element w-3/4 mx-auto my-20">
          <DatosMascotas />
        </div>
      </div>
      <div className="mt-20 p-10  mx-auto">
        <Productos />
      </div>
      <div className="mt-8" id="Adopciones">
        <MascotasAdopcion />
      </div>
    </div>
  );
}

