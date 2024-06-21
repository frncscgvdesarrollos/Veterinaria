"use server";
import {MercadoPagoConfig, Preference} from "mercadopago";
import { redirect } from "next/navigation";

const client = new MercadoPagoConfig({accessToken:`${process.env.A}`});
export default async function ProductosMP( precioFinal ) {
  const precio = precioFinal.precioFinal;
    const preference = await new Preference(client).create({
      body: {
      items: [
        {
          id: 0,
          title: "Venta de la tienda",
          quantity: 1,
          unit_price: 100 || precio,
        },
      ],
      back_urls: {
        success: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/venta/success",
        failure: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/venta/error",
        pending: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/venta/pending",
      },
      auto_return: "approved",
      notification_url: "https://magalimartinveterinaria.vercel.app/api/paymentsProductos"
      }
    });

    redirect(preference.init_point);
  return (
    <div>
      <p>productoMP</p>
    </div>
  )
}
