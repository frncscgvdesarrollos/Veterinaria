// 'use client'
// import { useEffect, useState } from 'react';
// import FormCliente from '../../components/FormCliente';
// import { clienteExisteConTerminosTRUE } from '../../firebase';
// import { UserAuth } from '../../context/AuthContext';
// import { redirect } from 'next/navigation';

// export default function DatosCliente() {
//   const { user } = UserAuth();
//   console.log("este es el user" +user)
//   console.log("este es el tipo" +typeof(user))
//   console.log("este es el user" + user?.uid)
//   const uid = user?.uid;
//   const [terminosAceptados, setTerminosAceptados] = useState(false);
//   const [errorVerificacion, setErrorVerificacion] = useState(null);

//   useEffect(() => {
//     if (user) {
//       clienteExisteConTerminosTRUE(uid)
//         .then((response) => {
//           if (response) {
//             setTerminosAceptados(true);
//           } else {
//             console.error("Terms not accepted for user:", uid);
//             // Optionally: redirect to terms page or display an error message
//           }
//         })
//         .catch((error) => {
//           console.error("Error verifying terms:", error);
//           setErrorVerificacion(error); // Keep for generic error display
//         });
//     }
//   }, [user]);
  

//   useEffect(() => {
//     if (terminosAceptados) {
//       redirect('/HomeCliente');
//     }
//   }, [terminosAceptados]);

//   return (
//     <div className='bg-gray-800 h-auto p-5'>
//       <h1 className='text-4xl text-center font-bold mt-5 mb-5 text-red-400 underline'>Informacion personal</h1>
//       {errorVerificacion && (
//         <p className='text-red-500 text-center mb-5'>
//           Error al verificar la aceptación de términos: {errorVerificacion.message}
//         </p>
//       )}
//       <FormCliente />
//     </div>
//   );
// }
