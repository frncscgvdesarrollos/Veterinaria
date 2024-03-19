'use client'
import { useContext, createContext, useState, useEffect } from "react";
import { getMascotasDueño } from "../firebase";
import { UserAuth } from "./AuthContext";

const MascotaContext = createContext();

export const MascotaContextProvider = ({ children }) => {
  const [mascota, setMascota] = useState(null);
  const { user } = UserAuth();
  let uid = null;

  if (user) {
    uid = user.uid;
  }

  useEffect(() => {
    const fetchMascotasDueño = async (uid) => {
      try {
        const mascotas = await getMascotasDueño(uid);
        return mascotas;
      } catch (error) {
        throw new Error("Error al obtener las mascotas del usuario: " + error);
      }
    };

    if (uid) {
      fetchMascotasDueño(uid)
        .then((mascotas) => {
          setMascota(mascotas);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [uid]);

  return (
    <MascotaContext.Provider value={{ mascota }}>
      {children}
    </MascotaContext.Provider>
  );
};

export function MascotasContext() {
  return useContext(MascotaContext);
}
