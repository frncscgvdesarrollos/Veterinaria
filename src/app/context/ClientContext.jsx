'use client'
import { createContext, useContext, useState, useEffect } from "react";
import { UserAuth } from "./AuthContext";
import { clienteExiste } from "../firebase";

const ClientContext = createContext({
  datosCliente: {},
  loading: false,
  error: null,
});

export const ClientContextProvider = ({ children }) => {
  const [datosCliente, setDatosCliente] = useState({});
  const {user} = UserAuth();
  const uid = user?.uid
  useEffect(() => {
    const fetchClientData = () => {
      if (uid) {
        clienteExiste(uid)
          .then((clientData) => {
            setDatosCliente(clientData);
          })
          .catch((error) => {
            console.error("Error al cargar la información del cliente:", error);
          });
      }
    };
    fetchClientData();
  }, [uid]);

  return (
    <ClientContext.Provider value={{ datosCliente }}>
      {children}
    </ClientContext.Provider>
  );
};

export function UseClient() {
  return useContext(ClientContext);
}
