'use client'
import { useState , useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { redirect } from 'next/navigation'
import { getTurnosChekeo } from '../firebase';

export default function LayoutNegocio( { children } ) {
    const [turnos , setChequeos] = useState([]);
    const { user } = UserAuth();
    const uid = user?.uid;
    useEffect(() => {
        const chequeos = getTurnosChekeo();
        setChequeos(chequeos);
    }, [turnos]);

    // if (uid != "fgGyxXX05NNN5aMakZ7mRChW0gY2" || uid != "" || uid != "" || uid != null || uid != undefined) {
    //     redirect("/")       
    //   }
  return (
    <div>
      { children }
    </div>
  )
}
