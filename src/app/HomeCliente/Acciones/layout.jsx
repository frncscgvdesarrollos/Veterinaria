'use client'
import { useState, useEffect } from 'react';
import { MascotaContextProvider } from '../../context/MascotaContext'
import { UserAuth } from '../../context/AuthContext'

export default function HomeClientelayout({children}) {
    const {user} =UserAuth();
    const [usuarioID, setUsuarioID] = useState(null);
    useEffect(() => {
      if(user){
      const uid = user?.uid
      setUsuarioID(uid)
    }
    }, [user]);
  return (
    <MascotaContextProvider user={usuarioID}>
            {children}
    </MascotaContextProvider>
  )
}
