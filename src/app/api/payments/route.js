import {MercadoPagoConfig , Payment} from "mercadopago";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mercadopago = new MercadoPagoConfig({
 accessToken: 'TEST-655293c8-3ec9-4fe9-948f-5b48ba9d2488',
});

export async function POST(request) {
  console.log("esta es la request" + request);
 const body = await request.json().then((data) => data.data);
 const payment = await new Payment(mercadopago).get(body.id);
 if(payment.body.status === 'approved'){
 const venta = {
   id: payment.body.id,
   amount: payment.body.transaction_amount,
   message: payment.body.description,
 };
console.log(venta);
 const registroVenta = await addDoc(collection(db, "ventas"), venta);
 console.log("esto es el registro venta" + registroVenta);
 }
 return Response.json({ success: true });
}