

export default function DatosClientesLayout({children}) {
  return (
<div className="bg-gray-800">
  <h1 className="text-5xl p-10 text-center text-sky-400 underline">Completa los siguientes pasos</h1>
  <div className="flex justify-around p-10 text-white">
    <h2 className="text-3xl borde-pasos p-8 bg-gray-500 rounded-full">1</h2>
    <h2 className="text-3xl borde-pasos p-8 bg-gray-800 rounded-full">2</h2>
    <h2 className="text-3xl borde-pasos p-8 bg-gray-800 rounded-full">3</h2>
  </div>
  <hr className="bg-gray-400 h-5"></hr>
  {children}
</div>

  )
}
