import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore , collection, addDoc , getDocs, getDoc ,setDoc,  deleteDoc ,query, where, doc , updateDoc, arrayUnion , orderBy, limit ,writeBatch ,arrayRemove} from "firebase/firestore";
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



export async function misCompras(uid){
  let compras = [];
  const q = query(collection(db, "ventas"), where("userId", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    compras.push(doc.data());
  });
  return compras;
}

export async function restarStockProducto(id, cantidad) {
 const q = query(collection(db, "productos"), where("id", "==", id));
 const querySnapshot = await getDocs(q);
 querySnapshot.forEach((doc) => {
   const stockActual = doc.data().stock;
   if(stockActual < cantidad){
     throw new Error("No hay suficiente stock disponible para realizar la compra");
   }
   const nuevoStock = stockActual - cantidad;
   updateDoc(doc.ref, { stock: nuevoStock });
 });

}




export async function idVentas() {
    try {
        const q = collection(db, "ventas");
        const snapshot = await getDocs(q);

        const nuevoID = snapshot.docs.reduce((idMayor, doc) => {
            const id = doc.data().id;
            return id > idMayor ? id : idMayor;
        }, 0) + 1;

        return nuevoID;
    } catch (error) {
        console.error("Error al obtener el ID de ventas:", error);
        throw error;
    }
}

export async function ventaEnCurso(uid) {
  try {
    const ventasRef = collection(db, "ventas");
    const q = query(ventasRef, where("userId", "==", uid), where("enCurso", "==", true));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      return { id: firstDoc.id, ...firstDoc.data() };
    } else {
      throw new Error("No se encontró ninguna venta en curso para este usuario.");
    }
  } catch (error) {
    throw new Error("Error al obtener la venta en curso: " + error.message);
  }
}
export async function ventaEnCursoFalse(uid) {
  try {
    // Obtener la referencia a la colección de ventas que coincidan con el userId y estén en curso
    const ventasRef = collection(db, "ventas");
    const q = query(ventasRef, where("userId", "==", uid), where("enCurso", "==", true));
    const querySnapshot = await getDocs(q);
    
    // Verificar si hay ventas encontradas
    if (!querySnapshot.empty) {
      // Iterar sobre los documentos encontrados (en caso de que hubiera más de uno)
      querySnapshot.forEach(async (doc) => {
        // Actualizar el documento para marcarlo como no en curso
        await updateDoc(doc.ref, { enCurso: false });
        console.log("Venta marcada como no en curso correctamente.");
      });
    } else {
      throw new Error("No se encontró ninguna venta en curso para este usuario.");
    }
  } catch (error) {
    throw new Error("Error al marcar la venta como no en curso: " + error.message);
  }
}

export async function marcarPagoEfectivo(uid) {
  try {
    // Obtener la referencia a la colección de ventas que coincidan con el userId y estén en curso
    const ventasRef = collection(db, "ventas");
    const q = query(ventasRef, where("userId", "==", uid), where("enCurso", "==", true));
    const querySnapshot = await getDocs(q);
    
    // Verificar si hay ventas encontradas
    if (!querySnapshot.empty) {
      // Iterar sobre los documentos encontrados (en caso de que hubiera más de uno)
      querySnapshot.forEach(async (doc) => {
        // Actualizar el documento para marcar el pago como efectivo
        await updateDoc(doc.ref, { efectivo: true });
        console.log("Pago marcado como efectivo correctamente.");
      });
    } else {
      throw new Error("No se encontró ninguna venta en curso para este usuario.");
    }
  } catch (error) {
    throw new Error("Error al marcar el pago como efectivo: " + error.message);
  }
}
export async function marcarPagoMercadoPago(uid){
  try {
    // Obtener la referencia a la colección de ventas que coincidan con el userId y estén en curso
    const ventasRef = collection(db, "ventas");
    const q = query(ventasRef, where("userId", "==", uid), where("enCurso", "==", true));
    const querySnapshot = await getDocs(q);
    
    // Verificar si hay ventas encontradas
    if (!querySnapshot.empty) {
      // Iterar sobre los documentos encontrados (en caso de que hubiera más de uno)
      querySnapshot.forEach(async (doc) => {
        // Actualizar el documento para marcar el pago como efectivo
        await updateDoc(doc.ref, { mp: true });
        console.log("Pago marcado como efectivo correctamente.");
      });
    } else {
      throw new Error("No se encontró ninguna venta en curso para este usuario.");
    }
  } catch (error) {
    throw new Error("Error al marcar el pago como efectivo: " + error.message);
  }
}


export async function eliminarVentas() {
  const q = query(collection(db, "ventas"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });  
}
export async function registroVentaPeluqueria(venta) {
  const docRef = await addDoc(collection(db, "ventas"), venta);
  return docRef
}

export async function calcularVentas() {
  let total = 0;
  const querySnapshot = await getDocs(collection(db, "ventas"));
  querySnapshot.forEach((doc) => {
    total += doc.data().precio;
  })
  return total
}


export async function totalVentas() {
  const ventas = [];
  const querySnapshot = await getDocs(collection(db, "ventas"));
  querySnapshot.forEach((doc) => {
    ventas.push(doc.data());
  })
  return ventas
}
export async function actualizarMetodosDePago(ventaId, mp, efectivo, confirmado) {
  try {
    const ventaRef = doc(db, 'ventas', ventaId);
    await updateDoc(ventaRef, {
      mp: mp,
      efectivo: efectivo,
      confirmado: confirmado,
    });
    console.log('¡Los métodos de pago se actualizaron correctamente!');
  } catch (error) {
    console.error('Error al actualizar métodos de pago:', error);
    throw new Error('Hubo un error al actualizar los métodos de pago');
  }
}

export async function aplicarVacuna(tipoVacuna, tipoExtra, fecha, uidMascota, nombreMascota ) {
  try {
    // Crear una consulta para encontrar la mascota específica
    const q = query(collection(db, "mascotas"), where("uid", "==", uidMascota), where("nombre", "==", nombreMascota));

    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);

    // Verificar si la consulta devolvió resultados
    if (!querySnapshot.empty) {
      // Obtener el primer documento de la consulta (asumiendo que hay uno solo que coincide con uid y nombre)
      const doc = querySnapshot.docs[0];


      // Actualizar el documento de la mascota agregando una nueva vacuna al carnetSanitario
      await updateDoc(doc.ref, {
        carnetSanitario: arrayUnion({ tipo: tipoVacuna, fecha: fecha, tipoExtra: tipoExtra  })
      });
      console.log("Vacuna aplicada correctamente.");
    } else {
      console.log("No se encontró la mascota con los criterios especificados.");
    }
  } catch (error) {
    console.error("Error aplicando la vacuna: ", error);
  }
}
export async function actualizarId() {
  const q = query(collection(db, "productos"));
  const querySnapshot = await getDocs(q);

  const batch = writeBatch(db);

  // Contador para asignar nuevos IDs
  let nuevoId = 0;

  querySnapshot.forEach((doc) => {
    const ref = doc.ref;
    batch.update(ref, { id: nuevoId.toString() });
    nuevoId++;
  });

  await batch.commit();
}

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
export async function getTurnosChekeo2() {
  const turnos = [];
  const q = query(collection(db,"turnosCheckeo"))
  const docs = await getDocs(q);
  docs.forEach(doc => {
    turnos.push(doc.data())
  })
  return turnos
}

export async function getMisTurnos(uid) {
  const turnos = [];
  const q = query(collection(db, "turnosPeluqueria"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    turnos.push(doc.data()); // Aquí se obtienen los datos del documento utilizando el método data()
  });
  return turnos;
}
export async function getMisTurnosChekeo(uid) {
  const turnos = [];
  const q = query(collection(db, "turnosCheckeo"), where("usuarioId", "==", uid));
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
export async function sumarTurnoPeluqueriaMascota(uid, mascota) {
  if (!uid || !mascota) {
    console.log("UID o nombre de la mascota no proporcionado");
    return;
  }

  try {
    const q = query(collection(db, 'mascotas'), where("uid", "==", uid), where("nombre", "==", mascota));
    const querySnapshot = await getDocs(q);
    const updatePromises = [];

    querySnapshot.forEach((doc) => {
      const suma = doc.data().turnosPeluqueria + 1;
      const updatePromise = updateDoc(doc.ref, {
        'turnosPeluqueria': suma
      });
      updatePromises.push(updatePromise);
    });

    await Promise.all(updatePromises);
    console.log("Turnos peluqueria de la mascota sumados correctamente");
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
      toy: 0,
      total: 0
    };

    // Contar el número de perros de cada tamaño en los turnos encontrados
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      capacidadTurno.total++; // Incrementar el contador total
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

    // Verificar si se excede la capacidad total permitida para la franja horaria
    if (capacidadTurno.total >= 8) {
      return false; // No se permite guardar otro turno si ya hay 8 o más turnos en esta franja horaria
    }

    // Verificar si se excede la capacidad permitida para cada tamaño
    if (capacidadTurno.gigante >= 1) {
      // Si ya hay un perro gigante, no se permite guardar otro
      return false;
    } else if (capacidadTurno.grande >= 1) {
      // Si hay un perro grande, se aplican las restricciones para medianos y toys
      return capacidadTurno.mediano <= 2 && capacidadTurno.toy <= 3;
    } else if (capacidadTurno.mediano >= 3) {
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
  try {
    const q = collection(db, "turnosPeluqueria");
    const snapshot = await getDocs(q);

    // Obtener el máximo ID existente
    const maxId = snapshot.docs.reduce((idMayor, doc) => {
      const id = doc.data().id;
      return Math.max(id, idMayor);
    }, 0);

    // Devolver el máximo ID encontrado + 1
    return maxId + 1;
  } catch (error) {
    console.error("Error al obtener el ID de turnoPeluqueria:", error);
    throw error;
  }
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

//PRODUCTOS 
export async function getProducts() {
  const products = [];
  const q = await query(collection(db, "productos"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    products.push(doc.data());
  })
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




export const crearOActualizarCliente = async (uid, clienteData) => {
  try {
    const clienteRef = query(collection(db, "clientes"), where("usuarioid", "==", uid));
    const doc = await clienteRef.get();

    if (doc.exists) {
      // Si el cliente ya existe, actualizar los datos
      await clienteRef.update(clienteData);
    } else {
      // Si el cliente no existe, crearlo
      await clienteRef.set(clienteData);
    }

    return true; // Indicar éxito
  } catch (error) {
    console.error("Error creating/updating client:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};


// @/app/firebase.js
export async function confirmarCompraTienda(id) {
  try {
    const q = query(collection(db, "ventas"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    
    if (docs.length > 0) {
      const doc = docs[0]; // Solo tomamos el primer documento, asumiendo que hay solo uno con esa ID
      await updateDoc(doc.ref, { confirmado: true , entregar : "entregar" });
      return "La compra ha sido confirmada con éxito";
    } else {
      throw new Error("No se encontró ningún documento con la ID proporcionada");
    }
  } catch (error) {
    console.error("Error al confirmar la compra:", error);
    throw error;
  }
}

export async function cancelarCompraTienda(id, items) {
  try {
    const q = query(collection(db, "ventas"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;

    if (docs.length > 0) {
      const doc = docs[0]; // Solo tomamos el primer documento, asumiendo que hay solo uno con esa ID
      await updateDoc(doc.ref, { confirmado: false, entrega: "cancelado" });

      // Verificar si hay productos en la compra
      if (items.length === 0) {
        throw new Error("No hay productos en la compra");
      } else {
        // Actualizar el stock de los productos en la colección "productos"
        if (Array.isArray(items)) {
          for (const item of items) {
            if (item.nombre && item.nombre.trim().length > 0) {
              const productoQuery = query(
                collection(db, "productos"),
                where("nombre", "==", item.nombre)
              );
              const productoSnapshot = await getDocs(productoQuery);
              const productoDocs = productoSnapshot.docs;

              if (productoDocs.length > 0) {
                const productoDoc = productoDocs[0];
                const nuevoStock = productoDoc.data().stock + item.cantidad;
                await updateDoc(productoDoc.ref, { stock: nuevoStock });
              } else {
                console.error(
                  `No se encontró el producto "${item.nombre}" en la colección "productos"`
                );
              }
            } else {
              console.error("El nombre del producto está vacío");
            }
          }
        } else {
          // Si `items` no es un array, actualizar el stock para ese único producto
          if (items.nombre && items.nombre.trim().length > 0) {
            const productoQuery = query(
              collection(db, "productos"),
              where("nombre", "==", items.nombre)
            );
            const productoSnapshot = await getDocs(productoQuery);
            const productoDocs = productoSnapshot.docs;

            if (productoDocs.length > 0) {
              const productoDoc = productoDocs[0];
              const nuevoStock = productoDoc.data().stock + items.cantidad;
              await updateDoc(productoDoc.ref, { stock: nuevoStock });
            } else {
              console.error(
                `No se encontró el producto "${items.nombre}" en la colección "productos"`
              );
            }
          } else {
            console.error("El nombre del producto está vacío");
          }
        }
      }

      return "La compra ha sido cancelada con éxito";
    } else {
      throw new Error("No se encontró ningún documento con la ID proporcionada");
    }
  } catch (error) {
    console.error("Error al cancelar la compra:", error);
    throw error;
  }
}


export async function ventasEntregar() {
  let entregar = [];
  try {
    const q = query(collection(db, "ventas"), where("entregar", "==", "entregar"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      entregar.push(doc.data());
    });
    return entregar;
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    throw error;
  }
}

export async function entregarVenta(id) {
  try {
    const q = query(collection(db, "ventas"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    
    if (docs.length > 0) {
      const doc = docs[0]; // Solo tomamos el primer documento, asumiendo que hay solo uno con esa ID
      await updateDoc(doc.ref, { entregar: "entregado" });
      return "La venta ha sido confirmada con éxito";
    } else {
      throw new Error("No se encontró aquí documento con la ID proporcionada");
    }
  } catch (error) {
    console.error("Error al confirmar la venta:", error);
    throw error;
  }
}

export async function cancelarEntrega(id) { 
  try {
    const q = query(collection(db, "ventas"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    
    if (docs.length > 0) {
      const doc = docs[0]; // Solo tomamos el primer documento, asumiendo que hay solo uno con esa ID
      await updateDoc(doc.ref, { entregar: "entregado pero no recibido" });
      return "La venta ha sido confirmada con éxito";
    } else {
      throw new Error("No se encontró aquí documento con la ID proporcionada");
    }
  } catch (error) {
    console.error("Error al confirmar la venta:", error);
    throw error;
  }
}


export async function borrarRegistroVenta(id) {
  try {
    const q = query(collection(db, "ventas"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    
    if (docs.length > 0) {
      const doc = docs[0]; // Solo tomamos el primer documento, asumiendo que hay solo uno con esa ID
      await deleteDoc(doc.ref);
      return "La venta ha sido borrada con exito";
    } else {
      throw new Error("No se encontró aquí documento con la ID proporcionada");
    }
  } catch (error) {
    console.error("Error al borrar la venta:", error);
    throw error;
  }
}
// Firebase.js

export async function postular(info, nombreMascota, uidMascota) {
  try {
      // Referencia a la colección de mascotas
      const mascotasRef = collection(db, "mascotas");
      
      // Crear una consulta para encontrar la mascota específica
      const q = query(mascotasRef, where("uid", "==", uidMascota), where("nombre", "==", nombreMascota));
      
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);

      // Verificar si la consulta devolvió algún documento
      if (!querySnapshot.empty) {
          // Obtener el primer documento de la consulta (asumiendo que hay uno solo que coincide con uid y nombre)
          const doc = querySnapshot.docs[0];
          
          // Actualizar el array de postulantes empujando el nuevo info
          await updateDoc(doc.ref, {
              postulantes: arrayUnion(info)
          });
      } else {
          console.log("No se encontró la mascota con los criterios especificados.");
      }
  } catch (error) {
      console.error("Error actualizando los postulantes: ", error);
  }
}

export async function rechazarPostulante(info, nombreMascota, uidMascota) {
  try {
      // Referencia a la colección de mascotas
      const mascotasRef = collection(db, "mascotas");
      
      // Crear una consulta para encontrar la mascota específica
      const q = query(mascotasRef, where("uid", "==", uidMascota), where("nombre", "==", nombreMascota));
      
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);

      // Verificar si la consulta devolvió：
      if (!querySnapshot.empty) {
          // Obtener el primer documento de la consulta (asumiendo que hay uno solo que coincide con uid y nombre)    
          const doc = querySnapshot.docs[0];
          
          // Actualizar el array de postulantes empujando el nuevo info
          await updateDoc(doc.ref, {
              postulantes: arrayRemove(info)
          });
      } else {
          console.log("No se encontró la mascota con los criterios especificados.");
      }
  } catch (error) {
      console.error("Error actualizando los postulantes: ", error);
  }
}

export async function confirmarAdopcion(info, nombreMascota, uidMascota) {
  try {
    // Referencia a la colección de mascotas
    const mascotasRef = collection(db, "mascotas");

    // Crear una consulta para encontrar la mascota específica
    const q = query(mascotasRef, where("uid", "==", uidMascota), where("nombre", "==", nombreMascota));

    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);

    // Verificar si la consulta devolvió resultados
    if (!querySnapshot.empty) {
      // Obtener el primer documento de la consulta (asumiendo que hay uno solo que coincide con uid y nombre)
      const doc = querySnapshot.docs[0];

      // Actualizar el documento de la mascota
      await updateDoc(doc.ref, {
        estadoCivil: "Adoptado", // Actualizar el estado civil a "adoptado"
        uid: info.uid, // Actualizar el UID con el del adoptante
        postulantes: [],
        internacion:false,
        turnosPeluqueria:0,
        turnosConsulta:0,
        adoptoPorLaPagina: true,
      });
      
      console.log("Mascota actualizada correctamente.");
    } else {
      console.log("No se encontró la mascota con los criterios especificados.");
    }
  } catch (error) {
    console.error("Error actualizando los adoptantes: ", error);
  }
}

export async function adoptoPorLaPagina() {
  let mascotasAdoptadas = [];

  const q = query(collection(db, "mascotas"), where("adoptoPorLaPagina", "==", true));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    mascotasAdoptadas.push(data);
  });

  return mascotasAdoptadas;
}


// Crear una promoción
// Crear una promoción
export function createPromotion(promotion) {
  return new Promise((resolve, reject) => {
    try {
      // Obtener los detalles completos de los productos
      const products = promotion.productos.map(product => ({
        id: product.id,
        nombre: product.nombre,
        imagen: product.imagen,
        precio: product.precioVenta,
        stock: product.stock,
        categoria: product.categoria,

        // Agrega más propiedades según sea necesario
      }));

      // Construir el objeto de promoción con productos completos
      const promotionData = {
        ...promotion,
        productos: products,
      };

      // Guardar la promoción en la base de datos
      const docRef = addDoc(collection(db, "promociones"), promotionData);
      console.log("Document written with ID: ", docRef.id);
      resolve();
    } catch (e) {
      console.error("Error adding document: ", e);
      reject(e);
    }
  });
}


// Obtener todas las promociones
export function getPromotions() {
  return new Promise((resolve, reject) => {
    const promociones = [];
    const q = query(collection(db, "promociones"));
    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          promociones.push(data);
        });
        resolve(promociones);
      })
      .catch((error) => {
        console.error("Error fetching promotions:", error);
        reject(error);
      });
  });
}

// Actualizar una promoción
export async function updatePromotion(id, updatedPromotion) {
  try {
    const promotionDoc = doc(db, "promociones", id);
    await updateDoc(promotionDoc, updatedPromotion);
    console.log("Document updated with ID: ", id);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

// Eliminar una promoción
export async function deletePromotion(id) {
  try {
    const promotionDoc = doc(db, "promociones", id);
    await deleteDoc(promotionDoc);
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

export async function togglePromotion(id) {
  try {
    const promotionDocRef = doc(db, "promociones", id);
    const promotionDocSnap = await getDoc(promotionDocRef);

    if (promotionDocSnap.exists()) {
      const currentStatus = promotionDocSnap.data().activa;
      await updateDoc(promotionDocRef, { activa: !currentStatus });
      console.log("Document updated with ID: ", id);
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}
function uploadImageToFirestore(imageFile) {
  return new Promise((resolve, reject) => {
    // Create a reference to the Firebase Storage location where you want to store the image
    const storageRef = storage.ref().child(`images/${imageFile.name}`);

    // Upload the file to Firebase Storage
    const uploadTask = storageRef.put(imageFile);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Handle progress, if needed
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        // Get the download URL for the image
        uploadTask.snapshot.ref.getDownloadURL()
          .then((downloadURL) => {
            // Resolve with the download URL
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
}