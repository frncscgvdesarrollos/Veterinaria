'use client';
import React, { useState, useEffect } from 'react';
import { getProducts, createPromotion, getPromotions , deletePromotion, togglePromotion } from '@/app/firebase';
import Image from 'next/image';
export default function Page() {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [product1, setProduct1] = useState();
  const [product2, setProduct2] = useState();
  const [newPromotion, setNewPromotion] = useState({
    nombre: '',
    descripcion: '',
    activa: true,
    productos: [],
    precioFinal: 0,
    descuento: 0,
    precioTotalConDescuento: 0,
  });
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      getProducts()
        .then((productsData) => {
          setProducts(productsData);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });

      getPromotions()
        .then((promotionsData) => {
          setPromotions(promotionsData);
        })
        .catch((error) => {
          console.error('Error fetching promotions:', error);
        });
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));
  };
  const handleProductChange = (e, index) => {
    const productId = e.target.value;
    const product = products.find((p) => p.id === parseInt(productId)) || {};
  
    if (Object.keys(product).length === 0) {
      console.error('Producto no encontrado');
      return;
    }
  
    if (index === 0) {
      setProduct1(product);
      console.log('Producto 1:', product); // Agrega este console.log
      setNewPromotion((prevPromotion) => ({
        ...prevPromotion,
        productos: prevPromotion.productos.map((p, i) => (i === 0 ? product : p)),
      }));
    } else {
      setProduct2(product);
      console.log('Producto 2:', product); // Agrega este console.log
      setNewPromotion((prevPromotion) => ({
        ...prevPromotion,
        productos: prevPromotion.productos.map((p, i) => (i === 1 ? product : p)),
      }));
    }
    
  };
  
  const handlePromotionCreation = (event) => {
    event.preventDefault();
    if (!product1 || !product2 || !product1.precioVenta || !product2.precioVenta) {
      alert('Debe seleccionar ambos productos y asegurarse de que tengan un precio de venta');
      return;
    }
  
    // Calcular el precio final de la promoción
    const combinedPrice = parseFloat(product1.precioVenta) + parseFloat(product2.precioVenta);
    const discountAmount = combinedPrice * (parseInt(discount) / 100);
    const promotionPrice = combinedPrice - discountAmount;
  
    const promotion = {
      ...newPromotion,
      productos: [
        { ...product1 }, // Incluye toda la información de producto1
        { ...product2 }, // Incluye toda la información de producto2
      ],
      precioFinal: combinedPrice,
      descuento: parseInt(discount),
      precioTotalConDescuento: promotionPrice,
    };
  
    createPromotion(promotion)
      .then(() => {
        alert('Promoción creada exitosamente');
        return getPromotions();
      })
      .then((promotionsData) => {
        setPromotions(promotionsData);
        setNewPromotion({
          nombre: '',
          descripcion: '',
          activa: true,
          productos: [],
          precioFinal: 0,
          descuento: 0,
          precioTotalConDescuento: 0,
        });
        setProduct1(null);
        setProduct2(null);
        setDiscount(0);
      })
      .catch((error) => {
        console.error('Error creating promotion:', error);
        alert('Error al crear la promoción');
      });
  };
  
  
  function handleDeletePromotion(id) {
    deletePromotion(id)
      .then(() => {
        alert('Promoción eliminada exitosamente');
        return getPromotions();
      })
      .then((promotionsData) => {
        setPromotions(promotionsData);
      })
      .catch((error) => {
        console.error('Error deleting promotion:', error);
        alert('Error al eliminar la promoción');
      });
  }
  function handleTogglePromotion(id) {
    togglePromotion(id)
      .then(() => {
        alert('Promoción actualizada exitosamente');
        return getPromotions();
      })
      .then((promotionsData) => {
        setPromotions(promotionsData);
      })
      .catch((error) => {
        console.error('Error updating promotion:', error);
        alert('Error al actualizar la promoción');
      });
  }

  return (
    <div className='bg-purple-500 bg-opacity-50'>
      <h1 className='text-center text-3xl font-bold mb-10 py-10'>Promociones</h1>
      <div className='flex flex-col md:flex-row gap-10 mx-auto justify-center p-10 '>
        <form onSubmit={handlePromotionCreation} className='w-2/3 h-[800px] flex flex-col px-10 mb-10 bg-opacity-70 bg-slate-200 w-1/3 justify-around items-left p-6 rounded-lg shadow-lg'>
          <label className='flex flex-col mb-4'>
            <span className='font-semibold text-lg mb-2'>Producto 1:</span>
            <select
              value={product1 ? product1.id : ''}
              onChange={(e) => handleProductChange(e, 0)}
              className='p-2 border border-gray-300 rounded'
              required
            >
              <option value=''>Seleccione un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className='flex flex-col mb-4'>
            <span className='font-semibold text-lg mb-2'>Producto 2:</span>
            <select
              value={product2 ? product2.id : ''}
              onChange={(e) => handleProductChange(e, 1)}
              className='p-2 border border-gray-300 rounded'
              required
            >
              <option value=''>Seleccione un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className='flex flex-col mb-4'>
            <span className='font-semibold text-lg mb-2'>
              Nombre de la promoción:
            </span>
            <input
              type='text'
              name='nombre'
              value={newPromotion.nombre}
              onChange={handleInputChange}
              className='p-2 border border-gray-300 rounded'
              required
            />
          </label>
          <label className='flex flex-col mb-4'>
            <span className='font-semibold text-lg mb-2'>Descripción:</span>
            <input
              type='text'
              name='descripcion'
              value={newPromotion.descripcion}
              onChange={handleInputChange}
              className='p-2 border border-gray-300 rounded'
              required
            />
          </label>
          <label className='flex flex-col mb-4'>
            <span className='font-semibold text-lg mb-2'>Descuento (%):</span>
            <input
              type='number'
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className='p-2 border border-gray-300 rounded'
              required
            />
          </label>
          <button
            type='submit'
            className='py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200'
          >
            Crear promoción
          </button>
        </form>
        <div className='bg-slate-200 bg-opacity-50 rounded-lg w-full justify-center p-10'>
          <section className='flex flex-col px-10 my-10 bg-slate-200 w-full mx-auto justify-around items-left p-6 rounded-lg shadow-lg'>
            <div className='flex flex-col'>
            {promotions.length > 0 ? (
  promotions.map(promotion => (
<div key={promotion.id} className='flex flex-col mb-4 p-6 bg-white rounded-lg shadow-lg'>
  <h2 className='text-2xl font-bold mb-2'>{promotion.nombre}</h2>
  <div className='flex w-full items-center justify-around mx-auto rounded-lg bg-slate-200 bg-opacity-50 border-4 border-gray-900'>
  <Image className='mx-auto mb-4' src={promotion.productos[0].imagen} alt={promotion.nombre} width={200} height={200} />
<Image className='mx-auto mb-4' src={promotion.productos[1].imagen} alt={promotion.nombre} width={200} height={200} />

  </div>
  <p className='mb-2'>{promotion.descripcion}</p>
  <div className='flex justify-between items-center'>
  <p className='mb-2'>Activa: {promotion.activa ? 'Sí' : 'No'} </p>
  <button
    onClick={() => handleTogglePromotion(promotion.id)}
    className='py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-700'
  >
    {promotion.activa ? 'Desactivar' : 'Activar'}
  </button>
  </div>
  <p className='mb-2'>Productos: {promotion.productos.map(product => product.nombre).join(', ')}</p>
  <p className='mb-2'>Precio Original: {promotion.precioFinal}</p>
  <p className='mb-2'>Descuento: {promotion.descuento}%</p>
  <p className='mb-2'>Precio de Promoción: {promotion.precioTotalConDescuento}</p>
  {/* Botón para eliminar promoción */}
  <button
    onClick={() => handleDeletePromotion(promotion.id)}
    className='py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 mr-2 my-10 w-40 ml-auto' 
  >
    Eliminar
  </button>
  {/* Botón para desactivar promoción */}
</div>

  ))
) : (
  <p>No hay promociones</p>
)}

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
