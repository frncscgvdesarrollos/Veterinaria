'use client'
import React, { useContext, createContext, useState, useEffect } from "react";
import { getMascotasDueño } from "../firebase";

const MascotaContext = createContext();

export const MascotaContextProvider = ({ children , user }) => {
  const [mascota, setMascota] = useState(null);
  console.log(user)
    const fetchMascotasDueño = () => {
      return new Promise((resolve, reject) => {
        const mascotaDueño = getMascotasDueño(user)
          .then(mascotas => {
            console.log(mascotas)
            setMascota(mascotas);
            resolve(mascotaDueño);
          })
          .catch(error => {
            console.error("Error al obtener las mascotas del usuario:", error);
            reject(error);
          })
      })
    }
  
  useEffect(() => {
    if (user) {
      console.log(user)
      fetchMascotasDueño();
    }
  }, [user]);

  return (
    <MascotaContext.Provider value={{ mascota }}>
      {children}
    </MascotaContext.Provider>
  );
};
export function MascotasContext() {
  return useContext(MascotaContext);
}
