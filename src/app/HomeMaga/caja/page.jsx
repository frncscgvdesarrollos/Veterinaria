'use client';
import { useEffect, useState } from "react";
import { eliminarVentas, totalVentas, calcularVentas } from "@/app/firebase";

export default function Caja() {
  const [ventas, setVentas] = useState([]);
  const [ver, setVer] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalMP, setTotalMP] = useState(0);
  const [totalEfectivo, setTotalEfectivo] = useState(0);
  const [totalPeluqueria, setTotalPeluqueria] = useState(0);
  const [totalVeterinaria, setTotalVeterinaria] = useState(0);
  const [totalTienda, setTotalTienda] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      totalVentas()
        .then((ventasData) => {
          const todaySales = filtrarVentasDelDia(ventasData);
          setVentas(todaySales);
          calcularTotales(todaySales);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      calcularVentas()
        .then((totalData) => {
          setTotal(totalData);
        })
        .catch((error) => {
          console.error("Error fetching total:", error);
        });
    };
    fetchData();
  }, []);

  const filtrarVentasDelDia = (ventasData) => {
    const fechaActual = new Date();
    const inicioDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() - 1, 18, 0, 0); // Desde las 18:00 horas del día anterior
    const finDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 18, 0, 0); // Hasta las 18:00 horas del día actual
    return ventasData.filter((venta) => venta.createdAt.toDate() >= inicioDia && venta.createdAt.toDate() <= finDia);
  };

  const calcularTotales = (data) => {
    const mPTotal = data.reduce((total, item) => {
      return item.mp ? total + item.precio : total;
    }, 0);
    setTotalMP(mPTotal);

    const efectivoTotal = data.reduce((total, item) => {
      return item.efectivo ? total + item.precio : total;
    }, 0);
    setTotalEfectivo(efectivoTotal);

    const peluqueriaTotal = data
      .filter((item) => item.categoria === "peluqueria")
      .reduce((total, item) => total + item.precio, 0);
    setTotalPeluqueria(peluqueriaTotal);

    const veterinariaTotal = data
      .filter((item) => item.categoria === "consulta")
      .reduce((total, item) => total + item.precio, 0);
    setTotalVeterinaria(veterinariaTotal);

    const tiendaTotal = data
      .filter((item) => item.categoria === "tienda")
      .reduce((total, item) => total + item.precio, 0);
    setTotalTienda(tiendaTotal);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Caja</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setVer(!ver)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 transition duration-300 ease-in-out"
        >
          {ver ? "Ocultar Ventas" : "Mostrar Ventas"}
        </button>
        <button
          onClick={eliminarVentas}
          className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 transition duration-300 ease-in-out"
        >
          Eliminar Ventas
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Total de ventas: {total}</h2>
        <h3 className="mb-2">Total de ventas MercadoPago: {totalMP}</h3>
        <h3 className="mb-4">Total de ventas Efectivo: {totalEfectivo}</h3>
        <hr className="my-4" />
        <h4 className="mb-2">Total peluquería: {totalPeluqueria}</h4>
        <h4 className="mb-2">Total veterinaria: {totalVeterinaria}</h4>
        <h4 className="mb-4">Total tienda: {totalTienda}</h4>
        <hr className="my-4" />
        <h5 className="mb-2">Total transporte: {totalPeluqueria / 100 * 10}</h5>
        <h5 className="mb-2">Total peluquería: {totalPeluqueria / 100 * 20} </h5>
      </div>
      {ver && (
        <>
          <h2 className="text-xl font-bold mb-4">Ventas de hoy:</h2>
          <div className="flex flex-wrap bg-violet-300 p-2">
            {ventas.map((item) => (
              <ul key={item.id} className="flex flex-wrap bg-violet-100 rounded-lg p-2 w-1/3 mb-4 gap-2">
                <li className="mb-1">Id: {item.id}</li>
                <li className="mb-1">UserId: {item.userId}</li>
                <li className="mb-1">Mascota : {item.mascota}</li>
                <li className="mb-1">createdAt: {new Date(item.createdAt.seconds * 1000).toLocaleString()}</li>
                <li className="mb-1">Total: {item.precio}</li>
                <li className="mb-1">MercadoPago : {item.mp ? "si" : "no"}</li>
                <li className="mb-1">Efectivo : {item.efectivo ? "si" : "no"}</li>
                <li className="mb-1">Confirmado : {item.confirmado ? "si" : "no"}</li>
                <li className="mb-1">Categoría : {item.categoria}</li>
              </ul>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
