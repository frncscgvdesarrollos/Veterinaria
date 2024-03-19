'use client'
import { UserAuth } from '../context/AuthContext'
import { MascotaContextProvider } from '../context/MascotaContext'
import { ClientContextProvider } from '../context/ClientContext';

export default function HomeClientelayout({ children }) {
    const { user } = UserAuth();
    const  uid  = user?.uid
    console.log("este es el uid " + uid);

    return (
        <>   
            <ClientContextProvider uid={uid}>
                <MascotaContextProvider uid={uid}>
                    {children}
                </MascotaContextProvider>
            </ClientContextProvider>
        </>
    );
}
