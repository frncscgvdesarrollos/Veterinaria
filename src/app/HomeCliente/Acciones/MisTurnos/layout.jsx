export default function layout({ children }) {
  return (
    <div className=' flex flex-col  bg-purple-200'>
      <div>
          <p className="text-xl lg:text-2xl font-bold text-gray-800 p-6 m-auto">
            Aqui podras controlar el estado de tus turnos.
          </p>
      </div>
      {children}
    </div>
  )
}
