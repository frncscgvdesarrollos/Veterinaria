'use client'
import { useEffect , useState } from 'react'
import FormCliente from '../components/FormCliente'
import { clienteExisteConTerminosTRUE } from '../firebase'
import { UserAuth } from '../context/AuthContext'
import { redirect } from 'next/navigation'



export default function DatosCliente() {
  const { user } = UserAuth();
  console.log(user);
  const uid = user?.uid;
  
  const [terminos, setTerminos] = useState(false);

  function handleTerminosChange() {
    setTerminos(!terminos);
  }
  if(terminos){
    redirect('/HomeCliente');
  }

  useEffect(() => {
    const clienteVerificadoPromise = new Promise((resolve, reject) => {
      if (user) {
        clienteExisteConTerminosTRUE(uid)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.error("Error verifying client with terms:", error);
            reject(error);
          });
      } else {
        resolve(false);
      }
    });
    clienteVerificadoPromise.then((clienteVerificado) => {
      console.log("clienteVerificado:", clienteVerificado);
      if (clienteVerificado) {
        handleTerminosChange();
      }
    });
  }, [user]);
  
  return (
    <div className='bg-gray-800 h-auto p-5'>
        <h1 className='text-4xl text-center font-bold mt-5 mb-5 text-red-400 underline'>Informacion personal </h1>
        <FormCliente/>
    </div>
  )
}
