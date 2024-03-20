import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore , collection, addDoc , getDocs, getDoc ,setDoc,  deleteDoc ,query, where, doc , updateDoc, arrayUnion , orderBy, limit } from "firebase/firestore";
import { getStorage , ref,  uploadBytes, getDownloadURL, getBytes  } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCnY6y3nq7zXbqTq2hNn7VwN7H1qWl6Hv0",
  authDomain: "veterinaria-b1ce8.firebaseapp.com",
  projectId: "veterinaria-b1ce8",
  storageBucket: "veterinaria-b1ce8.appspot.com",
  messagingSenderId: "773108259305",
  appId: "1:773108259305:web:4d70eab6257c44b3ca5378",
  measurementId: "G-V7582EQPKP"
};

const app = initializeApp(firebaseConfig);
export  const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)


//funciones de firebase para la base de datos
export async function mascotasEnAdopcion() {
  const q = query(collection(db, "mascotas"), where("estadoCivil", "==", "En adopción"));
  const querySnapshot = await getDocs(q);
  return querySnapshot
}
export async function registrarCliente(datosCliente) {
  console.log("estos son los datos del cliente" + datosCliente)
  const docRef = await addDoc(collection(db, "clientes"), datosCliente);
  return docRef
}
export async function clienteExiste(uid) {
  try {
    const q = query(collection(db, "clientes"), where("datosCliente.usuarioId", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si hay documentos en el snapshot, devolvemos el primer documento encontrado
      const cliente = querySnapshot.docs[0].data();
      // console.log(cliente); // Imprime los datos del cliente en la consola para depuración
      return cliente;
    } else {
      // Si el snapshot está vacío, no se encontró ningún cliente
      console.log("No se encontró ningún cliente con el UID proporcionado.");
      return null;
    }
  } catch (error) {
    console.error("Error al consultar el cliente:", error);
    throw error;
  }
}
export async function clienteExisteConTerminosTRUE(uid) {
  try {
    // Construye la consulta para buscar un cliente con el UID proporcionado y que tenga "terminos" en true
    const clientesQuery = query(collection(db, "clientes"), 
      where("datosCliente.usuarioId", "==", uid), 
      where("datosCliente.terminos", "==", true)
    );
    
    // Obtiene los documentos que cumplen con la consulta
    const clientesSnapshot = await getDocs(clientesQuery);

    // Verifica si el snapshot no está vacío para asegurarse de que se encontró al menos un cliente
    if (!clientesSnapshot.empty) {
      // Si hay documentos, significa que el cliente existe con "terminos" en true
      return true;
    } else {
      // Si el snapshot está vacío, significa que el cliente no existe o "terminos" no están en true
      return false;
    }
  } catch (error) {
    console.error("Error al verificar si existe el cliente con términos:", error);
    throw error;
  }
}
export async function clienteEsPremium(uid) {
  try {
    // Construye la consulta para buscar un cliente con el UID proporcionado y que tenga "esPremium" en true
    const clientesQuery = query(
      collection(db, "clientes"),
      where("datosCliente.usuarioId", "==", uid),
      where("datosCliente.esPremium", "==", true)
    );

    // Obtiene los documentos que cumplen con la consulta
    const clientesSnapshot = await getDocs(clientesQuery);

    // Verifica si el snapshot no está vacío para asegurarse de que se encontró al menos un cliente
    return !clientesSnapshot.empty;
  } catch (error) {
    console.error("Error checking if client exists with premium status:", error);
    throw error;
  }
}
export async function confirmarTerminos(uid) {
  try {
    // Obtener la referencia del documento que cumple con la condición
    const q = query(collection(db, 'clientes'), where("datosCliente.usuarioId", "==", uid));
    const querySnapshot = await getDocs(q);
    
    // Verificar si se encontró un documento que cumpla con la condición
    if (!querySnapshot.empty) {
      // Obtener la referencia del primer documento encontrado
      const firstDoc = querySnapshot.docs[0];
      const docRef = doc(db, 'clientes', firstDoc.id);

      // Actualizar el campo "terminos" a true
      await updateDoc(docRef, {
        'datosCliente.terminos': true
      });
      
      console.log('Campo "terminos" actualizado a true con éxito.');
    } else {
      console.error('No se encontró ningún documento con el usuario ID proporcionado:', uid);
    }
  } catch (error) {
    console.error('Error al actualizar campo "terminos":', error);
  }
}
export async function sumarTurnoPeluqueria(uid) {
  console.log(uid)
  try {
    const q = query(collection(db, 'clientes'), where("datosCliente.usuarioId", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const suma = doc.data().datosCliente.cortesTotales + 1;
      await updateDoc(doc.ref, {
        'datosCliente.cortesTotales': suma
      });
    });
  } catch (error) {
    console.log(error);
  }
}
export async function cambiarInfoImportanteMascota(uidUsuario, nombreMascota, info) {
  try {
      // Obtener la referencia a la colección 'Mascotas' y realizar la consulta
      const mascotasRef = db.collection('Mascotas');
      const query = mascotasRef.where("mascota.uid", "==", uidUsuario);
      const querySnapshot = await query.get();

      // Verificar si se encontraron mascotas
      if (!querySnapshot.empty) {
          // Iterar sobre los documentos encontrados
          querySnapshot.forEach(doc => {
              // Obtener la lista de mascotas del documento
              const mascotas = doc.data().mascota;

              // Buscar la mascota por su nombre y actualizar su información
              const mascotaIndex = mascotas.findIndex(mascota => mascota.nombre === nombreMascota);
              if (mascotaIndex !== -1) {
                  mascotas[mascotaIndex].info = info;
                  // Actualizar el documento con la lista de mascotas modificada
                  mascotasRef.doc(doc.id).update({ mascota: mascotas });
                  console.log('¡Información importante de la mascota actualizada con éxito!');
              } else {
                  console.log(`No se encontró ninguna mascota con el nombre "${nombreMascota}".`);
              }
          });
      } else {
          console.log('No se encontraron mascotas con el UID proporcionado.');
      }
  } catch (error) {
      console.error('Error al actualizar la información importante de la mascota:', error);
  }
}
export async function registerTurno(registro) {
  const docRef = await addDoc(collection(db, "turnos"), registro);
  return docRef
} 
export async function getNextTurn(uid) {
  const turnos = [];
  const q = await query(collection(db, "turnosCheckeo"), where("usuarioId", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    turnos.push(doc.data());
  })
  console.log(turnos)
  return turnos
}
export async function getMascotasDueño(uid) {
  const mascotas = [];
  const q = await query(collection(db, "mascotas"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    mascotas.push(doc.data());
  })
  // console.log(mascotas)
  return mascotas
} 
export async function registrarMascotas(mascotas) {
  console.log(mascotas)

  const mascotasCollection = collection(db, 'mascotas');
  try {
    for (const mascota of mascotas) {
      await addDoc(mascotasCollection, mascota);
    }
    // console.log('¡Mascotas registradas exitosamente!');
  } catch (error) {
    // console.error('Error al registrar las mascotas:', error);
    throw error;
  }
}
export function subirFotoMascota(photo, fileName) {
  const storage = getStorage();
  const fotosMascotasRef = ref(storage, `fotosMascotas/${fileName}`);
  return uploadBytes(fotosMascotasRef, photo)
    .then(() => getDownloadURL(fotosMascotasRef))
    .catch(error => {
      console.error("Error al subir la foto de la mascota:", error);
      throw error;
    });
}
export async function postTurnoChekeo(turno) {
  console.log(turno);

  try {
    // Verificar si el valor de selectedPet está definido en el objeto turno
    if (!turno.selectedPet) {
      throw new Error('El campo selectedPet no está definido en el objeto turno');
    }

    // Verificar si ya existe un turno con el mismo día y horario
    const existingTurnoQuery = query(
      collection(db, 'turnosCheckeo'),
      where('selectedDate', '==', turno.selectedDate),
      where('selectedTime', '==', turno.selectedTime),
    );

    const existingTurnoSnapshot = await getDocs(existingTurnoQuery);

    if (!existingTurnoSnapshot.empty) {
      // Ya existe un turno con el mismo día y horario
      console.log('El turno ya existe');
      return { error: 'El turno ya existe' };
    }

    // Si no existe, agregar el nuevo turno
    const docRef = await addDoc(collection(db, 'turnosCheckeo'), turno);

    console.log('Turno guardado correctamente:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error al guardar el turno:', error);
    return { error: 'Error al guardar el turno' };
  }
}
export async function getTurnosChekeo() {
  const turnos = [];
  const q = await query(collection(db, "turnosCheckeo"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    turnos.push(doc.data());
  })
  console.log(turnos)
  return turnos
}

export async function postTurnoPeluqueria (formData) {
  try {
    // Añadir un nuevo documento con los datos del formulario a la colección "turnosPeluqueria"
    const docRef = await addDoc(collection(db, "turnosPeluqueria"), formData);
    console.log("Documento creado con ID: ", docRef.id);
    // Aquí puedes manejar cualquier lógica adicional después de guardar el turno
  } catch (error) {
    console.error("Error al agregar el documento: ", error);
    // Manejar cualquier error que ocurra durante el proceso de guardado
  }
};
export async function getTurnosPeluqueria() {
  const turnos = [];
  const q = await query(collection(db, "turnosPeluqueria"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    turnos.push(doc.data());
  })
  console.log(turnos)
  return turnos
}



export async function getClientes() {
  const clientes = [];
  const q = await query(collection(db, "clientes"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    clientes.push(doc.data());
  })
  console.log(clientes)
  return clientes
  
}

//PRODUCTOS 
export async function getProducts() {
  const products = [];
  const q = await query(collection(db, "productos"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.data())
    products.push(doc.data());
  })
  console.log(products)
  return products
}
export async function createProduct(product) {
  try {
    const docRef = await addDoc(collection(db, "productos"), product);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
export  async function deleteProduct(id) {
  try {
    const docRef = doc(db, "productos", id);
    await deleteDoc(docRef);
    console.log("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}
//REVISAR HOY 
// export async function getTurnosPeluqueriaEsperando(){
//   const turnos = [];
//   const q = query(collection(db,"turnosPeluqueria") , where("estadoPeluqueria","==","esperando"))
//   const docs = await getDocs(q);
//   docs.forEach(doc => {
//     turnos.push(doc.data())
//   })
//   console.log(turnos)
//   return turnos
// }
export async function getLastTurnoPeluqueriaId() {
  try {
    const q = query(collection(db, 'turnosPeluqueria'), orderBy('id', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // No hay turnos existentes
      console.log('No hay turnos existentes');
      return 0;
    } else {
      // Retorna el ID del primer turno encontrado (el mayor)
      return querySnapshot.docs[0].data().id;
    }
  } catch (error) {
    console.error('Error al obtener el último ID de turno de peluquería:', error);
    throw error;
  }
}

// export async function turnosPeluqueriaPagosYaConfirmar () {
//   const turnos = [];
//   const q = query(collection(db,"turnosPeluqueria") ,where("estadoDelTurno", "==", "confirmar"))
//   const docs = await getDocs(q);
//   docs.forEach(docs => {
//     turnos.push(docs.data())
//   })
//   console.log(turnos)
//   return turnos
// }
// export async function avanzarEstadoTurno(id) {
//   try {
//     const turnoRef = doc(db, "turnosPeluqueria", id);
//     const turnoSnapshot = await getDoc(turnoRef);

//     if (!turnoSnapshot.exists()) {
//       throw new Error("No se encontró ningún documento con el ID especificado");
//     }

//     const estadoActual = turnoSnapshot.data().estadoDelTurno;
//     let nuevoEstado;

    // switch (estadoActual) {
    //   case "confirmar": // aparecer en llamarA Y CONFIRMA O CANCELA
    //     nuevoEstado = "confirmado";
    //     break;
    //   case "confirmado": // aparecer en transporte como buscar y en peluqueria como esperando
    //     nuevoEstado = "buscado";
    //     break;
    //   case "buscado": // aparecer en transporte como buscado en peluequeria como esperando 
    //     nuevoEstado = "Veterinaria";
    //     break;
    //   case "Veterinaria": // aparecer en trasnporte como esperando y en peluqueria como En peluqueria
    //     nuevoEstado = "Proceso";
    //   case "Proceso":// proceso en trasporte esperando y peluqueria En Proceso
    //     nuevoEstado = "devolver";
    //   case "devolver":// transporte retirar y pelqueuria finalizado 
    //     nuevoEstado = "devolviendo";
    //   case "devolviendo":// transporte devoviendo peluqueria finalizando 
    //     nuevoEstado = "Finalizado";
    //     break;
    //   default:
    //     throw new Error("El estado actual del turno no puede avanzar.");
    // }
//     await updateDoc(turnoRef, { estadoDelTurno: nuevoEstado });

//     return { id: turnoSnapshot.id, ...turnoSnapshot.data(), estadoDelTurno: nuevoEstado };
//   } catch (error) {
//     console.error("Error avanzando estado del turno:", error);
//     throw error;
//   }
// }
export async function avanzarEstadoTurno(id) {
  try {
    const q = query(collection(db, "turnosPeluqueria"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("No se encontró ningún documento con el ID especificado");
    }

    const turnoDoc = querySnapshot.docs[0];
    const estadoActual = turnoDoc.data().estadoDelTurno;

    let nuevoEstado = "";

    switch (estadoActual) {
      case "confirmar":
        nuevoEstado = "confirmado";
        break;
      case "confirmado":
        nuevoEstado = "buscado";
        break;
      case "buscado":
        nuevoEstado = "veterinaria";
        break;
      case "veterinaria":
        nuevoEstado = "proceso";
        break;
      case "proceso":
        nuevoEstado = "devolver";
        break;
      case "devolver":
        nuevoEstado = "devolviendo";
        break;
      case "devolviendo":
        nuevoEstado = "finalizado";
        break;
      default:
        throw new Error("El estado actual del turno no puede avanzar.");
    }

    await updateDoc(doc(db, "turnosPeluqueria", turnoDoc.id), { estadoDelTurno: nuevoEstado });

    return { id: turnoDoc.id, ...turnoDoc.data(), estadoDelTurno: nuevoEstado };
  } catch (error) {
    console.error("Error avanzando estado del turno:", error);
    throw error;
  }
}


export async function cancelarTurnoPeluqueria(id) {
  try {
    const turnoRef = doc(db, "turnosPeluqueria", id);
    const turnoSnapshot = await getDoc(turnoRef);

    if (!turnoSnapshot.exists()) {
      throw new Error("No se encontró ningún documento con el ID especificado");
    }

    await updateDoc(turnoRef, { estadoTurno: "cancelado" });

    return { id: turnoSnapshot.id, ...turnoSnapshot.data(), estadoTurno: "cancelado" };
  } catch (error) {
    console.error("Error cancelando el turno:", error);
    throw error;
  }
}
