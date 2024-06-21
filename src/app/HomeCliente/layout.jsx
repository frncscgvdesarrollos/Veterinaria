'use client'
import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { MascotaContextProvider } from '../context/MascotaContext';
import { ClientContextProvider } from '../context/ClientContext';
import Hero from '../components/estructura/hero';
import Footer from '../components/estructura/Footer';

export default function HomeClientelayout({ children }) {
    const { user } = UserAuth();
    const uid = user?.uid;
    return (
        <div className="w-full mx-auto">
        <div className="HomeCliente w-full mx-auto ">   
          <Hero />
            {uid ?
            <ClientContextProvider uid={uid}>
                <MascotaContextProvider uid={uid}>
                    {children}
                    <Footer />
                </MascotaContextProvider>
            </ClientContextProvider>
            : null}
        </div>
        </div>
    );
}
