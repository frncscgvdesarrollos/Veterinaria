
import Footer from './components/Footer'
import Header from './components/Header'
import { AuthContextProvider} from '../app/context/AuthContext'
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
            <Header />
              {children}
            <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
