import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore , collection, addDoc , getDocs, getDoc ,setDoc,  deleteDoc ,query, where, doc , updateDoc, arrayUnion , orderBy, limit ,writeBatch } from "firebase/firestore";
import { getStorage , ref,  uploadBytes, getDownloadURL, getBytes  } from "firebase/storage";

//--------------configuracion de firebase 
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

//---inicializacion de firebase 

const app = initializeApp(firebaseConfig);
export  const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)

//Cliente... 
export async function registrarCliente({ datosCliente }) { // Modificación aquí
  console.log("estos son los datos del cliente", datosCliente);
  const docRef = await addDoc(collection(db, "clientes"), datosCliente);
  return docRef;
}

export async function clienteExiste(uid) {
  try {
    const q = query(collection(db, "clientes"), where("usuarioid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si hay documentos en el snapshot, devolvemos el primer documento encontrado
      const cliente = querySnapshot.docs[0].data();
      // console.log(cliente); // Imprime los datos del cliente en la consola para depuración
      return cliente;
    } else {
      // Si el snapshot está vacío, no se encontró ningún cliente
      console.log("No se encontró ningún cliente con el UID proporcionado:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error al consultar el cliente:", error.message);
    throw error;
  }
}
export async function clienteExisteConTerminosTRUE(uid) {
  try {
    // Construye la consulta para buscar un cliente con el UID proporcionado y que tenga "terminos" en true
    const clientesQuery = query(
      collection(db, "clientes"), 
      where("usuarioId", "==", uid),
      where("terminos", "==", true)
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
      where("usuarioid", "==", uid),
      where("esPremium", "==", true)
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
    const q = query(collection(db, 'clientes'), where("usuarioid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    // Verificar si se encontró un documento que cumpla con la condición
    if (!querySnapshot.empty) {
      // Obtener la referencia del primer documento encontrado
      const firstDoc = querySnapshot.docs[0];
      const docRef = doc(db, 'clientes', firstDoc.id);

      // Actualizar el campo "terminos" a true
      await updateDoc(docRef, {
        'terminos': true
      });
      
      console.log('Campo "terminos" actualizado a true con éxito.');
    } else {
      console.error('No se encontró ningún documento con el usuario ID proporcionado:', uid);
    }
  } catch (error) {
    console.error('Error al actualizar campo "terminos":', error);
  }
}
export async function modificarCampoCliente(uid, campo, valor) {
  try {
    // Obtener la referencia del documento que cumple con la condición
    const q = query(collection(db, 'clientes'), where("usuarioid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    // Verificar si se encontró un documento que cumpla con la condición
    if (!querySnapshot.empty) {
      // Obtener la referencia del primer documento encontrado
      const firstDoc = querySnapshot.docs[0];
      const docRef = doc(db, 'clientes', firstDoc.id);

      // Crear un objeto con el campo y valor que se desea modificar
      const updateData = {};
      updateData[campo] = valor;

      // Actualizar el campo especificado con el valor proporcionado
      await updateDoc(docRef, updateData);
      
      console.log(`Campo "${campo}" actualizado a "${valor}" con éxito.`);
    } else {
      console.error('No se encontró ningún documento con el usuario ID proporcionado:', uid);
    }
  } catch (error) {
    console.error(`Error al actualizar campo "${campo}":`, error);
  }
}

export async function getMisTurnos(uid) {
  const turnos = [];
  const q = query(collection(db, "turnosPeluqueria"), where("usuarioid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    turnos.push(doc.data()); // Aquí se obtienen los datos del documento utilizando el método data()
  });
  return turnos;
}


export async function sumarTurnoPeluqueria(uid) {
  console.log(uid)
  try {
    const q = query(collection(db, 'clientes'), where("usuarioid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const suma = doc.data().turnosPeluqueria + 1;
      await updateDoc(doc.ref, {
        'turnosPeluqueria': suma
      });
    });
  } catch (error) {
    console.log(error);
  }
}
export async function sumarTurnoChekeo(uid) {
  console.log(uid)
  try {
    const q = query(collection(db, 'clientes'), where("usuarioid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const suma = doc.data().turnosConsulta + 1;
      await updateDoc(doc.ref, {
        'turnosConsulta': suma
      });
    });
  } catch (error) {
    console.log(error);
  }
}
export async function sumarTurnoPeluqueriaMascota(uid) {
  try {
    const q = query(collection(db, 'mascotas'), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const suma = doc.data().turnosPeluqueria + 1;
      await updateDoc(doc.ref, {
        'turnosPeluqueria': suma
      });
    });
  } catch (error) {
    console.log(error);
  }
}
export async function sumarTurnoCheckeoMascota(uid, mascota) {
  try {
    const q = query(collection(db, 'mascotas'), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async doc => {
      if (doc.data().nombre === mascota) {
        const turnosConsultaActualizados = doc.data().turnosConsulta + 1;
        await updateDoc(doc.ref, { turnosConsulta: turnosConsultaActualizados });
      }
    });
  } catch (error) {
    console.error(error);
  }
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


//funciones de vista
export async function mascotasEnAdopcion() {
  const q = query(collection(db, "mascotas"), where("estadoCivil", "==", "En adopción"));
  const querySnapshot = await getDocs(q);
  return querySnapshot
}
export async function getClientes() {
  const clientes = [];
  const q =  query(collection(db, "clientes"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    clientes.push(doc.data());
  })
  console.log(clientes)
  return clientes
}
export async function getMascotas(uid) {
  const mascotas = [];
  if(uid){
  try {
    const q = query(collection(db, "mascotas"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // Extraer los datos del documento
      const data = doc.data();
      // Agregar los datos al array de mascotas
      mascotas.push({ id: doc.id, ...data });
    });
    return mascotas;
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    throw error;
  }
}
else {
  const q = query(collection(db, "mascotas"));
  const docs = await getDocs(q);
  docs.forEach(doc => {
    const data = doc.data();
    // Agregar los datos al array de mascotas
    mascotas.push(data);
  })
  return mascotas
}
}

//------------------------------------------------------------------
//------------------------------------------------------------------
//------------------------------------------------------------------

//mascotas
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

//pagos 
export async function confirmarPagos(uid) {
  const turnosPagados = [];
  const q = query(collection(db, 'turnosPeluqueria'), where("usuarioid", "==", uid), where("pago", "==", false));
  const querySnapshot = await getDocs(q);

  const batch = writeBatch(db);

  querySnapshot.forEach((docs) => {
    if (!docs.data().pagado) {
      const docRef = doc(db, 'turnosPeluqueria', docs.id);
      batch.update(docRef, { 'pago': true });
      turnosPagados.push({ ...docs.data(), pago: true });
    }
  });

  await batch.commit();
  
  return turnosPagados;
}
export async function registroVenta(venta) {
  const docRef = await addDoc(collection(db, "ventas"), venta);
  return docRef
}

//TURNOS
export async function registerTurno(registro) {
  const docRef = await addDoc(collection(db, "turnos"), registro);
  return docRef
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
export async function getLastTurnoChekeoId() {
  let idUltimo = 0;
  const q = query(collection(db, "turnosCheckeo"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.data().id > idUltimo) {
      idUltimo = doc.data().id;
    }
  })
  console.log(idUltimo)
  idUltimo++
  return idUltimo
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
export async function cancelarTurnoPeluqueria(id) {
  try {
    const q = query(collection(db, "turnosPeluqueria"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, { estadoDelTurno: "cancelado" });
    });

    return true;
  } catch (error) {
    console.error("Error al cancelar el turno de peluquería:", error);
    return false;
  }
}
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


export async function getPreciosPorTamaño(servicio, tamaño) {
  console.log(servicio, tamaño)
  try {
    const preciosRef = collection(db, 'preciosDeServicios', servicio); // Combina servicio y tamaño en una sola cadena
    const preciosSnapshot = await getDocs(preciosRef);
    const precios = [];
    preciosSnapshot.forEach(doc => {
      precios.push({ id: doc.id, ...doc.data() });
    });
    return precios;
  } catch (error) {
    console.error('Error al obtener los precios:', error);
    throw error;
  }
}
export async function getPrecioConsulta() {
  try {
    const preciosRef = doc(db, 'preciosDeServicios', 'ConsultaVeterinaria');
    const preciosDoc = await getDoc(preciosRef);

    if (preciosDoc.exists()) {
      const precio = preciosDoc.data().precio;
      return precio;
    } else {
      throw new Error('No se encontró el precio de la consulta veterinaria');
    }
  } catch (error) {
    console.error('Error al obtener el precio de la consulta veterinaria:', error);
    throw new Error('Error al obtener el precio de la consulta veterinaria');
  }
}


export async function getNextTurn(uid) {
  const turnos = [];
  const q = await query(collection(db, "turnosCheckeo"), where("usuarioid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    turnos.push(doc.data());
  })
  console.log(turnos)
  return turnos
}
export async function verificarCapacidadTurno(selectedDate, selectedTurno) {
  try {
    // Obtener todos los turnos para la fecha y turno seleccionados
    const q = query(
      collection(db, "turnosPeluqueria"),
      where("selectedDate", "==", selectedDate),
      where("selectedTurno", "==", selectedTurno)
    );
    const querySnapshot = await getDocs(q);

    // Inicializar el objeto de capacidad con valores predeterminados
    let capacidadTurno = {
      gigante: 0,
      grande: 0,
      mediano: 0,
      toy: 0
    };

    // Contar el número de perros de cada tamaño en los turnos encontrados
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.tamaño === "gigante") {
        capacidadTurno.gigante++;
      } else if (data.tamaño === "grande") {
        capacidadTurno.grande++;
      } else if (data.tamaño === "mediano") {
        capacidadTurno.mediano++;
      } else if (data.tamaño === "toy") {
        capacidadTurno.toy++;
      }
    });

    // Verificar si se excede la capacidad permitida
    if (capacidadTurno.gigante === 1) {
      // Si ya hay un perro gigante, no se permite guardar otro
      return false;
    } else if (capacidadTurno.grande === 1) {
      // Si hay un perro grande, se aplican las restricciones para medianos y toys
      return capacidadTurno.mediano <= 2 && capacidadTurno.toy <= 3;
    } else if (capacidadTurno.mediano === 3) {
      // Si hay 3 perros medianos, se aplican las restricciones para toys
      return capacidadTurno.toy <= 3;
    } else {
      // Si no hay restricciones previas, se permiten solo toys hasta un máximo de 6
      return capacidadTurno.toy < 6;
    }
  } catch (error) {
    console.error("Error al verificar capacidad del turno:", error);
    return false; // Error al verificar la capacidad
  }
}




export async function borrarTodosLosTurnos() {
  const q = query(collection(db, "turnosPeluqueria"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });  
}


export async function avanzarEstadoTurno(id) {
  try {
    // Crear la consulta para obtener el documento del turno con el ID proporcionado
    const q = query(collection(db, "turnosPeluqueria"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No se encontró ningún documento con el ID especificado");
    }

    const turnoDoc = querySnapshot.docs[0];
    const turnoData = turnoDoc.data();
    const estadoActual = turnoData.estadoDelTurno;
    console.log("Estado actual del turno:", estadoActual);
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

    // Obtener la referencia del documento del turno
    const turnoRef = doc(db, "turnosPeluqueria", turnoDoc.id);

    // Actualizar el estado del turno en la base de datos
    await updateDoc(turnoRef, { estadoDelTurno: nuevoEstado });

    return { id: turnoDoc.id, ...turnoData, estadoDelTurno: nuevoEstado };
  } catch (error) {
    console.error("Error avanzando estado del turno:", error);
    throw error;
  }
}




export async function getLastTurnoPeluqueriaId() {
  let idUltimo = 0;
  const q = query(collection(db, "turnosPeluqueria"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.data().id > idUltimo) {
      idUltimo = doc.data().id;
    }
  })
  console.log(idUltimo)
  idUltimo++
  return idUltimo
}




export async function updateCanil(id, canil) {
  try {
    const q = query(collection(db, "turnosPeluqueria"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(db, "turnosPeluqueria", querySnapshot.docs[0].id);
      await updateDoc(docRef, { canilPeluqueria: canil });
      console.log('Canil actualizado correctamente.');
    } else {
      console.log('No se encontró el documento con el id proporcionado.');
    }
  } catch (error) {
    console.error('Error actualizando el canil:', error);
    throw error;
  }
}

//-------------------------------------------------------
//---------------------------------------------------
//------------------------------
//--------------
//_-----
//---
//-



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

export async function deleteProduct(id) {
  const q = query(collection(db, "productos"), where("id", "==", id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref)
  })
}


export async function updateProduct(id, product) {
  const q = query(collection(db, "productos"), where("id", "==", id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    updateDoc(doc.ref, product)
  })
}




export async function crearPrecioDeServicio(selectedServicio, precios) {
  // Agrega un documento con un ID específico a la colección "preciosDeServicios"
  try {
    await db.collection("preciosDeServicios").doc(selectedServicio).set(precios);
    console.log("Precio de servicio creado exitosamente");
  } catch (error) {
    console.error("Error al crear precio de servicio: ", error);
  }
}


export async function obtenerPrecioPorServicioYTamaño(servicio, tamaño) {
  try {
    const preciosRef = collection(db, 'preciosDeServicios'); // referencia a la colección 'preciosDeServicios'
    const docRef = doc(preciosRef, servicio); // referencia al documento 'servicio' dentro de la colección 'preciosDeServicios'
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const precioServicio = docSnap.data();
      const precio = precioServicio[tamaño];
      return precio;
    } else {
      console.log('No se encontró el servicio.');
      return 0; // O cualquier otro valor predeterminado que desees
    }
  } catch (error) {
    console.error('Error al obtener el precio del servicio:', error);
    throw error;
  }
}

// Función para leer un documento de preciosDeServicios por ID
export async function obtenerPreciosDeServicios() {
  try {
    const preciosData = [];
    const querySnapshot = await getDocs(collection(db, "preciosDeServicios"));
    console.log(querySnapshot);
    querySnapshot.forEach(doc => {
      preciosData.push({ id: doc.id, ...doc.data() });
    });
    return preciosData;
  } catch (error) {
    console.error("Error al obtener precios de servicios: ", error);
    throw error;
  }
}

// Función para actualizar un documento de preciosDeServicios por ID
// Función para actualizar un documento de preciosDeServicios por nombre de servicio
export async function actualizarPrecioDeServicio(nombreServicio, nuevosPrecios) {
  try {
    // Mapeo de valores numéricos a nombres de servicio
    const servicioMapping = {
      0: "BañoCorteHigienico",
      1: "BañoCorteHigienicoPelar",
      2: "BañoCorteHigienicoCepillar",
      3: "BañoCorteHigienicoCorte"
    };

    // Verificar si el valor numérico es válido
    if (!(nombreServicio in servicioMapping)) {
      throw new Error("El valor numérico proporcionado no es válido");
    }

    // Obtener el nombre de servicio correspondiente
    const nombreServicioActualizado = servicioMapping[nombreServicio];

    // Obtener la referencia a la colección "preciosDeServicios"
    const preciosRef = collection(db, "preciosDeServicios");

    // Consultar los documentos que coinciden con el nombre de servicio actualizado
    const querySnapshot = await getDocs(query(preciosRef, where("id", "==", nombreServicio)));

    // Almacenar las referencias de los documentos que necesitan ser actualizados
    const docsToUpdate = [];
    const preciosActuales = []; // Almacenar los precios actuales de los documentos
    querySnapshot.forEach(doc => {
      docsToUpdate.push(doc.ref);
      preciosActuales.push(doc.data());
    });

    // Actualizar los documentos en paralelo
    const updatePromises = docsToUpdate.map((docRef, index) => {
      // Combinar precios actuales y nuevos precios
      const preciosActualizados = { ...preciosActuales[index], ...nuevosPrecios };
      return updateDoc(docRef, preciosActualizados);
    });

    // Esperar a que todas las actualizaciones se completen
    await Promise.all(updatePromises);

    console.log("Precios de servicio actualizados exitosamente");
  } catch (error) {
    console.error("Error al actualizar precios de servicio: ", error);
    throw error;
  }
}





// Función para eliminar un documento de preciosDeServicios por ID
export async function eliminarPrecioDeServicio(selectedServicio) {
  // Elimina el documento de la colección "preciosDeServicios" con el ID especificado
  try {
    await db.collection("preciosDeServicios").doc(selectedServicio).delete();
    console.log("Precio de servicio eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar precio de servicio: ", error);
  }
}







export async function situacionMascota(estadoCivil, id) {
  const q = query(collection(db, "mascotas"), where("id", "==", id));
  const docs = await getDocs(q);
  docs.forEach(doc => {
    updateDoc(doc.ref, { estadoCivil: estadoCivil });
  });
}
