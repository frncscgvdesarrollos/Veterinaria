'use client';
import { useContext, createContext, useState, useEffect } from "react";
import { UserAuth } from "./AuthContext";
import { clienteExiste } from "../firebase";

const ClientContext = createContext();

export const ClientContextProvider = ({ children }) => {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [datosCliente, setDatosCliente] = useState({});

  useEffect(() => {
    if (user && uid) {
      const loadClientData = () => {
        return new Promise((resolve, reject) => {
          clienteExiste(uid)
            .then((clientData) => {
              setDatosCliente(clientData);
              resolve();
            })
            .catch((error) => {
              console.error("Error al cargar la información del cliente:", error);
              reject(error);
            });
        });
      };

      loadClientData();
    }
  }, [uid, user]);

  return (
    <ClientContext.Provider value={{ datosCliente }}>
      {children}
    </ClientContext.Provider>
  );
};

export function UseClient() {
  return useContext(ClientContext);
}
