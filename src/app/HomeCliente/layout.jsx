'use client'
import { useState, useEffect } from 'react';
import { MascotaContextProvider } from '../context/MascotaContext'
import { UserAuth } from '../context/AuthContext'
import { ClientContextProvider } from '../context/ClientContext';
export default function HomeClientelayout({children }) {
    const {user} =UserAuth();
    const [usuarioID, setUsuarioID] = useState(null);
    useEffect(() => {
      if(user){
      const uid = user?.uid
      console.log(uid)
      setUsuarioID(uid)
    }
    }, [user]);
  return (
    <ClientContextProvider user={usuarioID}>
    <MascotaContextProvider user={usuarioID}>
            {children}
    </MascotaContextProvider>
    </ClientContextProvider>
  )
}
