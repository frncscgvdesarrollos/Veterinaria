"use server";
import {MercadoPagoConfig, Preference} from "mercadopago";
import {redirect} from "next/navigation";

const client = new MercadoPagoConfig({accessToken: process.env.NEXT_PUBLIC_ACCESSTOKEN});
export default async function ProductX( formData ) {
 
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: 0,
            title: "peluqueria canina",
            quantity: 1,
            unit_price: 1000,
          },
        ],
        back_urls: {
          success: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/MisTurnos",
          failure: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/turneroPeluqueria/pagoError",
          pending: "https://magalimartinveterinaria.vercel.app/HomeCliente/Acciones/turneroPeluqueria/pagoError",
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
