
import Footer from './components/Footer'
import Header from './components/Header'
import { AuthContextProvider} from '../app/context/AuthContext'
// import { MascotaContextProvider} from '../app/context/MascotaContext'
// import { ClientContextProvider} from '../app/context/ClientContext'
// import { UserAuth } from '../app/context/AuthContext'
import './globals.css'

export const metadata = {
  title: 'Magali Martin',
  description: 'Veterinaria onLine',
}


export default function RootLayout({ children  }) {

  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {/* <ClientContextProvider user={usuarioID}> */}
            {/* <MascotaContextProvider user={usuarioID}> */}
              <Header />
                {children}
              <Footer />
            {/* </MascotaContextProvider> */}
           {/* </ClientContextProvider>   */}
        </AuthContextProvider>
      </body>
    </html>
  );
}
