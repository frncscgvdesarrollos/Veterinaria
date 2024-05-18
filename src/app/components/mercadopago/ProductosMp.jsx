"use server";
import {MercadoPagoConfig, Preference} from "mercadopago";
import { redirect } from "next/navigation";

const client = new MercadoPagoConfig({accessToken: 'TEST-4732185295999828-021210-74be192e021f74c875fe9bba82f58ec9-1153230629'});
export default async function ProductosMP( precioFinal ) {
  const precio = precioFinal.precioFinal;
    const preference = await new Preference(client).create({
      body: {
        

      items: [
        {
          id: 0,
          title: "Venta de la tienda",
          quantity: 1,
          unit_price: precio,
        },
      ],
      back_urls: {
        success: "http://localhost:3000/HomeCliente/Acciones/venta/success",
        failure: "http://localhost:3000/HomeCliente/Acciones/venta/error",
        pending: "http://localhost:3000//HomeCliente/Acciones/venta/pending",
      },
      auto_return: "approved",
      notification_url: "http://localhost:3000/api/paymentsProductos"
      }
    });

    redirect(preference.init_point);
  return (
    <div>
      <p>productoMP</p>
    </div>
  )
}
