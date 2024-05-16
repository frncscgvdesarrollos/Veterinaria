"use server";
import {MercadoPagoConfig, Preference} from "mercadopago";
import { idVentas } from "@/app/firebase";
import {redirect} from "next/navigation";

const client = new MercadoPagoConfig({accessToken: 'TEST-4732185295999828-021210-74be192e021f74c875fe9bba82f58ec9-1153230629'});
export default async function ProductX( formData ) {
  const idVenta = new Promise((resolve) => idVentas().then((id) => resolve(id)));
  
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: await idVenta,
            title: "peluqueria canina",
            quantity: 1,
            unit_price: 100,
          },
        ],
        back_urls: {
          success: "http://localhost:3000/HomeCliente/Acciones/turneroPeluqueria/pagoExitoso",
          failure: "http://localhost:3000/HomeCliente/Acciones/turneroPeluqueria/pagoError",
          pending: "http://localhost:3000/HomeCliente/Acciones/turneroPeluqueria/pagoError",
        },
        auto_return: "approved",
        notification_url: "https://magalimartinveterinaria.vercel.app/api/payments",
      }
    })
    redirect(preference.init_point);
  return (
    <>  
      <p>pago</p>
    </>
  );
}