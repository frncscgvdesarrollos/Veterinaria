'use client'
import { useState, useEffect } from 'react'
import { getProducts , createPromotion } from '@/app/firebase';

export default function page() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getProducts().then((data) => {
          setProducts(data);
        });
      }, []);

      function handlePromotion(event) {
        event.preventDefault();
        const promotion = {
          name: event.target.name.value,
          description: event.target.description.value,
          image: event.target.image.value,
          active: event.target.active.value,
        };
      }

  return (
    <div className='flex flex-col mx-auto bg-purple-500 bg-opacity-50 p-10'>
      <h1 className='text-center text-3xl font-bold my-10 '>Promociones</h1>
      <form onSubmit={handlePromotion} className='flex flex-col px-10 my-10 bg-slate-200 w-1/3 h-[400px] justify-around items-left'>
        <label>
          Nombre de la promoción:
          <input type="text" name="name" className='ml-auto'/>
        </label>
        <label>
          Descripción:
          <input type="text" name="description" className='ml-auto'/>
        </label>
        <label>
          Imagen:
          <input type="text" name="image" className='ml-auto'/>
        </label>
        <label>
          Activa:
          <input type="text" name="active" className='mr-auto'/>
        </label>
        <button type="submit">Crear promoción</button>
      </form>
    </div>
  );
}

