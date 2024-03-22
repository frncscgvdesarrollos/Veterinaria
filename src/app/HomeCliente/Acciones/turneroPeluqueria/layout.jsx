export const metadata = {
  title: 'Magali Martin - Turnero Peluqueria',
  description: 'Autogestión de los turnos para peluquería de la veterinaria',
}

export default function LayoutPeluqueria({ children }) {
  return (
    <div className='flex flex-col min-h-screen bg-gray-500'>
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {children}
      </div>
    </div>
  );
}
