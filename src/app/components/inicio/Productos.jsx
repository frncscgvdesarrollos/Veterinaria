'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserAuth } from '@/app/context/AuthContext';
import { UseClient } from '@/app/context/ClientContext';
import { getProducts, registroVentaPeluqueria, idVentas, restarStockProducto } from '@/app/firebase';
import ProductosMP from '@/app/components/mercadopago/ProductosMp.jsx';
import MisCompras from './MisCompras';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 900,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const CartItem = React.memo(({ item, eliminarDelCarrito }) => {
  const precioTotal = item.precioVenta * item.cantidad;

  return (
    <div className="flex w-full flex-col md:flex-col lg:flex-row border-b border-gray-200 p-4 justify-between items-center h-[200px]">
      <div className="flex-none mr-4">
        <Image src={item.imagen} alt={item.nombre} width={48} height={48} className="w-12 h-12 object-cover rounded-lg" />
      </div>
      <div className="flex flex-col justify-center flex-grow">
        <p className="font-semibold text-lg">{item.nombre}</p>
        <p className="text-gray-700 font-semibold mr-4">Cantidad: {item.cantidad}</p>
      </div>
      <div className="flex-none mr-4">
        <p className="font-semibold">C/U: ${item.precioVenta}</p>
      </div>
      <div className="flex-none mr-4">
        <p className="font-semibold">Total: ${precioTotal}</p>
      </div>
      <div className="flex-none">
        <button
          onClick={() => eliminarDelCarrito(item.id)}
          className="bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none transition-colors duration-300 ease-in-out"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

const MobileProductos = ({ productos, filtro, currentPage, productsPerPage, windowSize, carrito, mostrarCarrito, setMostrarCarrito, agregarAlCarrito, eliminarDelCarrito, calcularPrecioTotal, handleCompra, compraEnProceso, finalPrice, paginate, totalPages }) => (
  <div className="w-[360px]  py-8">
    <div className="w-full flex justify-around items-center mx-auto flex-col md:flex-row">
      <div className='producto flex'>
        <h1 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 md:ml-10">
          Hace tu pedido
        </h1>
      </div>
      <div className='flex flex-col producto absolute top-16 mt-24 '>
        <h3 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 md:ml-10 mb-10">Y esperalo en tu casa !</h3>
      </div>
    </div>

    <div className="p-4 md:p-8 lg:p-12 bg-violet-200 bg-opacity-50 w-full rounded-lg mt-10">
      <div className="flex justify-around items-center my-4 md:my-20 flex-col md:flex-row">
        <div className="flex items-center gap-4 mb-4 md:mb-0 mx-auto lg:ml-20">
          <h1 className="text-5xl p-5 font-bold text-purple-800 bg-pink-300 p-2 rounded-lg bg-opacity-50 md:ml-10 ">
            Tienda!
          </h1>
          <button
            className="text-xl md:text-3xl cursor-pointer relative scale-150"
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
          >
            📦
            {carrito.length > 0 && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <div className="bg-red-500 text-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
                  {carrito.reduce((total, producto) => total + producto.cantidad, 0)}
                </div>
              </div>
            )}
          </button>
        </div>
        <div className="flex flex-wrap justify-end gap-10 items-center mb-4 md:mb-0 w-2/3 mx-auto lg:mr-auto filtro container-perspective">
          <button onClick={() => filtrarProductos('')} className='text-yellow-200 w-full bg-purple-500 hover:bg-purple-700 element2 font-semibold py-2 px-4 rounded focus:outline-none'>Todos</button>
          <button onClick={() => filtrarProductos('ropa')} className='text-yellow-200 w-full bg-purple-500 element hover:bg-purple-700 font-semibold py-2 px-4 rounded focus:outline-none'>Ropa</button>
          <button onClick={() => filtrarProductos('juguetes')} className='text-yellow-200  element2 w-full bg-purple-500 hover:bg-purple-700 font-semibold py-2 px-4 rounded focus:outline-none'>Juguetes</button>
          <button onClick={() => filtrarProductos('comida')} className='text-yellow-200  w-full element bg-purple-500 hover:bg-purple-700 font-semibold py-2 px-4 rounded focus:outline-none'>Comida</button>
        </div>
      </div>
      {mostrarCarrito && (
        <div className="bg-pink-300 rounded-lg m-2 p-4 bg-opacity-50 flex flex-col justify-center  w-2/3 my-10 h-full mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-purple-800">Tu pedido</h2>
          <div className="overflow-x-auto w-full">
            {carrito.length > 0 ? (
              <div className="flex flex-col w-full">
                {carrito.map((item, index) => (
                  <CartItem key={index} item={item} eliminarDelCarrito={eliminarDelCarrito} />
                ))}
              </div>
            ) : (
              <p className="text-lg md:text-xl text-center text-purple-800">Tu carrito está vacío</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-end w-full mt-4">
            <p className="text-lg md:text-xl font-semibold text-purple-800 mb-4 sm:mb-0">Total: ${calcularPrecioTotal()}</p>
            <button
              className="bg-yellow-200 hover:bg-purple-600 text-purple-800 font-semibold py-2 px-4 rounded focus:outline-none transition-colors duration-300 ease-in-out mt-4 sm:mt-0 sm:ml-4"
              onClick={() => handleCompra()}
            >
              Comprar
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 p-5 rounded-lg container-perspective mx-auto w-full">
        {productos
          .filter(producto => (filtro === '' || producto.categoria === filtro) && producto.stock > 0)
          .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
          .map((producto) => (
            <div
              key={producto.id}
              className={`bg-pink-300 border-4 border-yellow-200 rounded-lg p-4 mx-auto flex flex-col gap-4 flex-grow ${windowSize.width > 1300 ? 'element4 element' : 'span2'}`}
              style={{ minHeight: '350px' }}
            >
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                width={150}
                height={150}
                className="object-cover mb-4 rounded-lg mx-auto"
              />
              <div className="flex flex-col justify-between h-auto bg-violet-100 rounded-lg p-4 h-auto">
                <div>
                  <h2 className="text-lg text-purple-700 font-semibold mb-2">{producto.nombre}</h2>
                  <p className="text-purple-500 font-semibold mb-2">ARS${producto.precioVenta}</p>
                  <p className="text-purple-700 font-semibold mb-2">{producto.descripcion}</p>
                </div>
              </div>
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="bg-purple-500 hover:bg-blue-700 text-yellow-200 font-semibold py-2 px-4 w-full rounded focus:outline-none my-2 h-[40px]"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
      </div>
      <div className="flex justify-center my-4">
        <ul className="flex list-none">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className="mx-1">
              <button
                onClick={() => paginate(i + 1)}
                className={`bg-purple-500 text-yellow-200 font-semibold py-2 px-4 rounded focus:outline-none ${
                  currentPage === i + 1 ? 'bg-yellow-400' : 'hover:bg-purple-700'
                }`}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <MisCompras />
    </div>
    {compraEnProceso && (
      <div>
        compra en proceso
        <ProductosMP precioFinal={finalPrice} />
      </div>
    )}
  </div>
);

const DesktopProductos = ({ productos, filtro, currentPage, productsPerPage, windowSize, carrito, mostrarCarrito, setMostrarCarrito, agregarAlCarrito, eliminarDelCarrito, calcularPrecioTotal, handleCompra, compraEnProceso, finalPrice, paginate, totalPages }) => (
  <div className="container mx-auto w-full px-4 py-8">
    <div className="w-full flex justify-around items-center mx-auto flex-col md:flex-row">
      <div className='producto flex'>
        <h1 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 md:ml-10">
          Hace tu pedido
        </h1>
      </div>
      <div className='flex flex-col producto absolute top-16 mt-24 '>
        <h3 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 md:ml-10">Y esperalo en tu casa !</h3>
      </div>
    </div>

    <div className="p-4 md:p-8 lg:p-12 bg-violet-200 bg-opacity-50 w-full mx-auto rounded-lg mt-5">
      <div className="flex justify-around items-center my-4 md:my-20 flex-col md:flex-row">
        <div className="flex items-center gap-10 mb-4 md:mb-0 mx-auto lg:ml-20">
          <h1 className="text-5xl p-5 font-bold text-purple-800 bg-pink-300 p-2 rounded-lg bg-opacity-50 md:ml-10 ">
            Tienda!
          </h1>
          <button
            className="text-xl md:text-3xl cursor-pointer relative scale-150"
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
          >
            📦
            {carrito.length > 0 && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <div className="bg-red-500 text-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
                  {carrito.reduce((total, producto) => total + producto.cantidad, 0)}
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

        <div className="flex flex-col lg:flex-row justify-space-between  md:mb-0 w-full mx-auto -mt-10">
          <button onClick={() => filtrarProductos('')} className=' w-2/3 m-2 text-yellow-200 bg-purple-500 hover:bg-purple-700 font-semibold py-2 px-4 rounded focus:outline-none'>Todos</button>
          <button onClick={() => filtrarProductos('ropa')} className='  w-2/3  m-2 text-yellow-200 bg-purple-500 hover:bg-purple-700 font-semibold py-2 px-4 rounded focus:outline-none'>Ropa</button>
          <button onClick={() => filtrarProductos('juguetes')} className='  w-2/3 m-2  text-yellow-200 bg-purple-500 hover:bg-purple-700 font-semibold py-2 px-4 rounded focus:outline-none'>Juguetes</button>
          <button onClick={() => filtrarProductos('comida')} className=' w-2/3 m-2 text-yellow-200 bg-purple-500 hover:bg-purple-700 font-semibold py-2 px-4 rounded focus:outline-none'>Comida</button>
        </div>
      {mostrarCarrito && (
        <div className="bg-pink-300 rounded-lg m-2 p-4 bg-opacity-50 flex flex-col justify-center  w-2/3 my-10 h-full mx-auto ">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-purple-800">Tu pedido</h2>
          <div className="overflow-x-auto w-full">
            {carrito.length > 0 ? (
              <div className="flex flex-col w-full">
                {carrito.map((item, index) => (
                  <CartItem key={index} item={item} eliminarDelCarrito={eliminarDelCarrito} />
                ))}
              </div>
            ) : (
              <p className="text-lg md:text-xl text-center text-purple-800">Tu carrito está vacío</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-end w-full mt-4">
            <p className="text-lg md:text-xl font-semibold text-purple-800 mb-4 sm:mb-0">Total: ${calcularPrecioTotal()}</p>
            <button
              className="bg-yellow-200 hover:bg-purple-600 text-purple-800 font-semibold py-2 px-4 rounded focus:outline-none transition-colors duration-300 ease-in-out mt-4 sm:mt-0 sm:ml-4"
              onClick={() => handleCompra()}
            >
              Comprar
            </button>
          </div>
        </div>
      )}
      <div className={`grid grid-cols-1 md:grid-cols-1 xl:grid-cols-5 gap-6 p-2 rounded-lg container-perspective mx-auto w-full productos ${mostrarCarrito? "productosmargin" : null}`}>
        {productos
          .filter(producto => (filtro === '' || producto.categoria === filtro) && producto.stock > 0)
          .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
          .map((producto) => (
            <div
              key={producto.id}
              className={`w-2/3 bg-pink-300 border-4 mt-10  border-yellow-200 rounded-lg p-2 mx-auto flex flex-col gap-4 flex-grow ${windowSize.width > 1300 ? 'element4 element' : 'span2'}`}
              style={{ minHeight: '350px' }}
            >
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                width={150}
                height={150}
                className="object-cover mb-4 rounded-lg mx-auto"
              />
              <div className="flex flex-col justify-between h-auto bg-violet-100 rounded-lg p-4 h-auto">
                <div>
                  <h2 className="text-lg text-purple-700 font-semibold mb-2">{producto.nombre}</h2>
                  <p className="text-purple-500 font-semibold mb-2">ARS${producto.precioVenta}</p>
                  <p className="text-purple-700 font-semibold mb-2">{producto.descripcion}</p>
                </div>
              </div>
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="bg-purple-500 hover:bg-blue-700 text-yellow-200 font-semibold py-2 px-4 w-full rounded focus:outline-none my-2 h-[40px]"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
      </div>
      <div className="flex justify-center my-4">
        <ul className="flex list-none">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className="mx-1">
              <button
                onClick={() => paginate(i + 1)}
                className={`bg-purple-500 text-yellow-200 font-semibold py-2 px-4 rounded focus:outline-none ${
                  currentPage === i + 1 ? 'bg-yellow-400' : 'hover:bg-purple-700'
                }`}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <MisCompras />
    </div>
    {compraEnProceso && (
      <div>
        compra en proceso
        <ProductosMP precioFinal={finalPrice} />
      </div>
    )}
  </div>
);

export default function Productos() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const { datosCliente } = UseClient();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [compraEnProceso, setCompraEnProceso] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const productsPerPage = 5;
  const windowSize = useWindowSize();

  useEffect(() => {
    getProducts()
      .then(products => {
        setProductos(products);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, [uid]);

  const totalPages = Math.ceil(productos.length / productsPerPage);

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const filtrarProductos = categoria => {
    setFiltro(categoria);
  };

  const agregarAlCarrito = producto => {
    if (producto.stock < 1) {
      alert('No hay stock disponible');
      return;
    }
    const index = carrito.findIndex(item => item.id === producto.id);
    if (index !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito[index].cantidad += 1;
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = id => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
  };

  const calcularPrecioTotal = () => {
    return carrito.reduce((total, producto) => total + producto.precioVenta * producto.cantidad, 0);
  };

  const handleCompra = () => {
    const precioFinal = calcularPrecioTotal();
    setFinalPrice(precioFinal);

    let nuevoIdVenta;
    let nombresProductos;

    idVentas()
      .then(id => {
        nuevoIdVenta = id;
        nombresProductos = carrito.map(item => item.nombre);

        const nuevaVenta = {
          entrega: "esperando",
          enCurso: true,
          id: nuevoIdVenta,
          userId: uid,
          createdAt: new Date(),
          nombre: datosCliente?.nombre,
          apellido: datosCliente?.apellido,
          direccion: datosCliente?.direccion,
          telefono: datosCliente?.telefono,
          precio: precioFinal,
          productoOservicio: 'producto',
          categoria: 'tienda',
          entregado: false,
          efectivo: false,
          mp: false,
          confirmado: false,
          items: carrito.map(item => ({ nombre: item.nombre, cantidad: item.cantidad })),
        };

        return registroVentaPeluqueria(nuevaVenta);
      })
      .then(() => {
        return carrito.reduce((promiseChain, producto) => {
          return promiseChain.then(() => {
            return restarStockProducto(producto.id, producto.cantidad)
              .then(() => {
                console.log(`Stock restado para ${producto.nombre}`);
              })
              .catch(error => {
                console.error(`Error al restar stock para ${producto.nombre}:`, error);
                throw error;
              });
          });
        }, Promise.resolve());
      })
      .then(() => {
        setCompraEnProceso(true);
        setCarrito([]);
      })
      .catch(error => {
        console.error('Error al realizar la compra:', error);
      });
  };

  return (
    <div>
      {windowSize.width > 768 ? (
        <DesktopProductos
          productos={productos}
          filtro={filtro}
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          windowSize={windowSize}
          carrito={carrito}
          mostrarCarrito={mostrarCarrito}
          setMostrarCarrito={setMostrarCarrito}
          agregarAlCarrito={agregarAlCarrito}
          eliminarDelCarrito={eliminarDelCarrito}
          calcularPrecioTotal={calcularPrecioTotal}
          handleCompra={handleCompra}
          compraEnProceso={compraEnProceso}
          finalPrice={finalPrice}
          paginate={paginate}
          totalPages={totalPages}
        />
      ) : (
        <MobileProductos
          productos={productos}
          filtro={filtro}
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          windowSize={windowSize}
          carrito={carrito}
          mostrarCarrito={mostrarCarrito}
          setMostrarCarrito={setMostrarCarrito}
          agregarAlCarrito={agregarAlCarrito}
          eliminarDelCarrito={eliminarDelCarrito}
          calcularPrecioTotal={calcularPrecioTotal}
          handleCompra={handleCompra}
          compraEnProceso={compraEnProceso}
          finalPrice={finalPrice}
          paginate={paginate}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
