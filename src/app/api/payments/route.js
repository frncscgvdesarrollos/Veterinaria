import {MercadoPagoConfig , Payment} from "mercadopago";
const mercadopago = new MercadoPagoConfig({
 accessToken: NEXT_PUBLIC_ACCESSTOKEN,
});

export async function POST(request) {
  console.log("esta es la request" + request);
  const body = await request.json();
 await new Payment(mercadopago).get(body.id);
 return Response.json({ success: true });
}