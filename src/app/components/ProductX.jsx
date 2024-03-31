"use server";
import {MercadoPagoConfig, Preference} from "mercadopago";
import {redirect} from "next/navigation";

const client = new MercadoPagoConfig({accessToken: 'TEST-2354491765614534-033010-27ac3d7283d65defc4fc83b43b7e6ec4-1748147159'});
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
          success: "http://localhost:3000/HomeCliente/Acciones/MisTurnos",
          failure: "http://localhost:3000/HomeCliente/Acciones/turneroPeluqueria/pagoError",
          pending: "http://localhost:3000/HomeCliente/Acciones/turneroPeluqueria/pagoError",
        },
        auto_return: "approved",
        notification_url: "https://xrdb6q32-3000.brs.devtunnels.ms/api/payments",
      }
    })
    redirect(preference.init_point);
  return (
    <>  
      <p>pago</p>
    </>
  );
}