'use client'
import { UserAuth } from '../context/AuthContext'
import { ClientContextProvider } from '../context/ClientContext'
export default function ClientLayout({ children }) {
  const { user: currentUser } = UserAuth();
  const userId = currentUser?.uid;

  return (
    <ClientContextProvider user={userId}>
      {children}
    </ClientContextProvider>
  );
}

