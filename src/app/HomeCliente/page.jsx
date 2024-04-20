'use client';
import Veterinaria from '../components/inicio/Veterinaria';
import MisDatos from '../components/inicio/MisDatos';
import DatosMascotas from '../components/inicio/DatosMascotas';
import Productos from '../components/inicio/Productos';
import MascotasAdopcion from '../components/inicio/MascotasAdopcion';
import MisTurnos from '../components/inicio/MisTurnos';
import { UserAuth } from '../context/AuthContext';
import { redirect } from 'next/navigation';
export default function HomeCliente() {
  const { user } = UserAuth();
  if (!user) {
    return redirect('/newClient/datosCliente');
  }

  return (
    <div className="min-h-screen flex flex-col p-2 lg:container-perspective">
      <div className="rounded-lg mb-8">
        <Veterinaria />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 container-perspective">
        <div className="p-3 lg:p-5 element2 w-2/3 mx-auto h-[300px] lg:h-[400px] rounded-lg bg-violet-100 bg-opacity-50 flex flex-col gap-4">
          <MisDatos />
          <MisTurnos  />
        </div>
        <div className="bg-violet-100 bg-opacity-50 rounded-lg p-3 lg:p-5 element w-3/4 mx-auto">
          <DatosMascotas />
        </div>
      </div>
      <div className="mt-20 container  mx-auto">
        <Productos />
      </div>
      <div className="mt-8">
        <MascotasAdopcion />
      </div>
    </div>
  );
}

