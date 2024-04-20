"use server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";


export default async function ProductosMP(carrito) {
    const client = new MercadoPagoConfig({
        accessToken: process.env.NEXT_PUBLIC_ACCESSTOKEN,
    });
    try {
    const preference = await new Preference(client).create({
      items: [
        {
          id: 0,
          title: "Compra de Productos Veterinaria",
          quantity: 1,
          unit_price: carrito.total,
        },
      ],
      back_urls: {
        success: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/MisCompras",
        failure: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/MisCompras/pagoError",
        pending: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/MisCompras/pagoPendiente",
      },
      auto_return: "approved",
      notification_url: "https://magalimartinveterinaria.vercel.app/api/paymentsProductos",
    });

    redirect(preference.init_point);
    return <p>pago</p>;
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear la preferencia de pago");
  }
}