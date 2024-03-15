'use client'
import { useState , useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
export default function Page() {
    const {user} = UserAuth();
    const uid = user?.uid;
    if(uid === "L6nqm2J1UuZCmZ4dS5K7Mhonxx42" || uid === "fgGyxXX05NNN5aMakZ7mRChW0gY2"){
        return (
            <div >
                <h1 className='text-xl font-bold text-cyan-800'>Oficina</h1> 
                <div className='grid grid-cols-3 gap-4 p-16'>
                    <div className='col-span-1  bg-red-300 h-[300px]'>
                        <h3 className='text-xl text-center'>Repartos de productos</h3>
                        <hr></hr>
                        <h4 className='font-bold'>Estado de los repartos</h4>
                    </div>
                    <div className='col-span-1 bg-red-300 h-[300px]'>
                        <h3 className='text-xl text-center'>Traslados</h3>
                        <hr></hr>
                        <h4 className='font-bold'>Estado de los traslados</h4>
                    </div>
                    
                    <div className='col-span-1 bg-red-300 h-[300px] '>
                        <h3 className='text-xl text-center'>Caja</h3>
                        <hr></hr>
                        <h4 className='font-bold'>Estado de la caja</h4>
                    </div>
                    <div className='col-span-3 bg-green-300 h-[300px]'>
                        <h3 className='text-xl text-center'>¡Peluqueria!</h3>
                        <hr></hr>
                        <h4 className='font-bold'>Estado de la Peluquería</h4>             
                    </div>
                </div>
            </div>
        )
    }

    return (
        <h1>No estas autorizado</h1>    
    )
 
}
