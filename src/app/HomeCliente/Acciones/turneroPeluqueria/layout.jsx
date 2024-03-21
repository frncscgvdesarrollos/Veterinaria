export const metadata = {
  title: 'Magali Martin - Turnero Peluqueria',
  description: 'autogestion de los turnos para peluqueria de la veterinaria',
}
export default function layoutPeluqueria({ children }) {
  return (
    <div className='flex flex-col bg-gray-500  '>
        {children}
    </div>
  )
}
