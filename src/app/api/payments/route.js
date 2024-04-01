import {MercadoPagoConfig , Payment} from "mercadopago";
const mercadopago = new MercadoPagoConfig({
 accessToken: 'TEST-655293c8-3ec9-4fe9-948f-5b48ba9d2488',
});

export async function POST(request) {
  console.log("esta es la request" + request);
  const body = await request.json();
 await new Payment(mercadopago).get(body.id);
 return Response.json({ success: true });
}