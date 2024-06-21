import Header from './components/estructura/Header'
import { AuthContextProvider} from '../app/context/AuthContext';
import './globals.css'

export const metadata = {
  title: 'Magali Martin',
  description: 'Veterinaria onLine',
  favicon: '/LOGO.svg',
}

export default function RootLayout({ children  }) {

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className='bg-gray-800 flex flex-col'>
        <AuthContextProvider>
              <Header />

                {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}