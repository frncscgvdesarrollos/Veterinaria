'use client';
import React, { useState, useEffect } from 'react';
import { getProducts, registroVentaPeluqueria, idVentas ,restarStockProducto } from '@/app/firebase';
import Image from 'next/image';
import { registroVenta } from '@/app/firebase'; // Importa las funciones de Firebase
import { UserAuth } from '@/app/context/AuthContext';
import { UseClient } from '@/app/context/ClientContext';
import ProductosMP from '@/app/components/mercadopago/ProductosMp.jsx';

const CartItem = React.memo(({ item, eliminarDelCarrito }) => {
    const precioTotal = item.precioVenta * item.cantidad;

    return (
        <tr> 
            <td>
                <div className="flex items-center">
                    <img src={item.imagen} alt={item.nombre} className="w-12 h-12 object-cover mr-4 rounded-lg" />
                    <div>
                        <p className="font-semibold text-lg">{item.nombre}</p>
                        <p className="text-gray-700">Cantidad: {item.cantidad}</p>
                    </div>
                </div>
            </td>
            <td>
                <p className="font-semibold">Precio unitario: ${item.precioVenta}</p>
            </td>
            <td>
                <p className="font-semibold">Total: ${precioTotal}</p>
            </td>
            <td>
                <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none transition-colors duration-300 ease-in-out"
                >
                    Eliminar
                </button>
            </td>
        </tr>
    );
});

export default function Productos (){
    const { user } = UserAuth();
    const uid = user?.uid;
    const { datosCliente } = UseClient();
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [compraEnProceso, setCompraEnProceso] = useState(false); // Nuevo estado para controlar la compra
    const [currentPage, setCurrentPage] = useState(1);
    const [finalPrice, setFinalPrice] = useState(0);
    const productsPerPage = 5;

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
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => {
        setCurrentPage(Math.max(1, Math.min(totalPages, pageNumber)));
    };

    const filtrarProductos = categoria => {
        setFiltro(categoria);
    };

    const agregarAlCarrito = producto => {
        console.log(carrito);
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
        const precioFinal = calcularPrecioTotal(); // Obtener el precio total del carrito
        setFinalPrice(precioFinal);
    
        let nuevoIdVenta;
        let nombresProductos;
    
        // Obtener un nuevo ID de venta
        idVentas()
            .then(id => {
                nuevoIdVenta = id;
    
                // Obtener los nombres de los productos en el carrito
                nombresProductos = carrito.map(item => item.nombre);
    
                // Crear un objeto con los detalles de la venta
                const nuevaVenta = {
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
    
                // Registrar la venta en Firestore
                return registroVentaPeluqueria(nuevaVenta);
            })
            .then(() => {
                // Restar el stock de cada producto en el carrito secuencialmente
                return carrito.reduce((promiseChain, producto) => {
                    return promiseChain.then(() => {
                        return restarStockProducto(producto.id, producto.cantidad)
                            .then(() => {
                                console.log(`Stock restado para ${producto.nombre}`);
                            })
                            .catch(error => {
                                console.error(`Error al restar stock para ${producto.nombre}:`, error);
                                throw new Error('Error al restar stock de los productos');
                            });
                    });
                }, Promise.resolve());
            })
            .then(() => {
                // Limpiar el carrito y actualizar el estado
                setCompraEnProceso(true);
                setCarrito([]);
                setMostrarCarrito(false);
                console.log('Venta registrada exitosamente');
    
                // Mostrar alerta de éxito
                alert('¡Productos restados del stock correctamente!');
    
                // Redirigir al cliente a la página de inicio u otra página relevante
                // window.location.href = '/'; // Cambia esto según la estructura de tus rutas
            })
            .catch(error => {
                console.error('Error al procesar la compra:', error);
                setCompraEnProceso(false);
    
                // Mostrar alerta de error para el cliente
                alert('Error al procesar la compra. Por favor, inténtelo de nuevo más tarde.');
            });
    };
    
    
    
    
      useEffect(() => {
    if (compraEnProceso) {
        // Aquí podrías hacer algo como redirigir al usuario a otra página después de un tiempo
        // o mostrar un mensaje de éxito y luego reiniciar la variable compraEnProceso
        setTimeout(() => {
            setCompraEnProceso(false); // Reinicia la variable compraEnProceso después de 5 segundos
        }, 5000); // Reiniciar después de 5 segundos (5000 milisegundos)
    }
}, [compraEnProceso]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="w-full flex justify-around items-center mx-auto ">
                <div className='producto flex '> 
                    <h1 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 ml-10 flex ">
                        Hace tu pedido
                    </h1>
                </div>
                <div className='flex flex-col producto absolute top-24 mt-24 hidden md:visible'> 
                    <h3 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 ml-10 ">Y esperalo en tu casa !</h3>
                </div>
            </div>

            <div className="p-4 md:p-8 lg:p-12 bg-violet-200 bg-opacity-50 w-full mx-auto rounded-lg mt-10">
                <div className="flex justify-between my-20">
                    <div className="flex items-center">
                        <h1 className="text-3xl font-bold text-purple-800 bg-pink-300 p-2 rounded-lg bg-opacity-50 ml-10">
                            Tienda!
                            </h1>
                    </div>
                    <div className="flex items-center">                        
                        {['Ropa', 'Cuidado', 'Higiene', 'Alimento', 'Juguetes', ''].map(categoria => (
                            <button
                                key={categoria}
                                className="text-3xl cursor-pointer mr-4 bg-purple-800 text-white p-2 rounded-lg bg-opacity-50"
                                onClick={() => filtrarProductos(categoria)}
                            >
                                {categoria || 'Todos'}
                            </button>
                        ))}
                    </div>
                    <button
                        className="text-3xl cursor-pointer mr-4 relative"
                        onClick={() => setMostrarCarrito(!mostrarCarrito)}
                    >
                        📦
                        {carrito.length > 0 && (
                            <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center absolute top-0 right-0 -mt-2 -mr-2">
                                {carrito.reduce((total, producto) => total + producto.cantidad, 0)}
                            </div>
                        )}
                    </button>
                </div>
                {mostrarCarrito && (
                    <div className="bg-pink-300 rounded-lg m-2 p-4 bg-opacity-50 flex flex-col justify-center items-center w-full h-full">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-800">Tu pedido!</h2>
                        <div className="overflow-x-auto w-full">
                            <table className="table-auto w-full">
                                <tbody>
                                    {carrito.map((item, index) => (
                                        <CartItem key={index} item={item} eliminarDelCarrito={eliminarDelCarrito} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between mt-4 w-full">
                            <p className="text-lg font-semibold text-purple-800">Total: ${calcularPrecioTotal()}</p>
                            <button
                                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none transition-colors duration-300 ease-in-out"
                                onClick={() => handleCompra()}
                            >
                                Comprar
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex flex-col justify-center items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-5 rounded-lg container-perspective mx-auto w-full">
                        {currentProducts
                            .filter(producto => filtro === '' || producto.categoria === filtro)
                            .map((producto, index) => (
                                <div key={index}
                                    className="bg-pink-300 border-4 border-yellow-200 rounded-lg p-4 mx-auto element4 element"
                                >
                                    <Image
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        width={150}
                                        height={150}
                                        className="object-cover mb-4 rounded-lg mx-auto h-[200px] w-full"
                                    />
                                    <div className="flex flex-col justify-between h-auto bg-violet-100 rounded-lg p-4 h-[200px]">
                                        <div>
                                            <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
                                            <p className="text-gray-700 mb-2">Precio: ${producto.precioVenta}</p>
                                            <p className="text-gray-700 mb-2">Descripción: {producto.descripcion}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => agregarAlCarrito(producto)}
                                        className="bg-purple-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 w-full rounded focus:outline-none"
                                    >
                                        Agregar al carrito
                                    </button>
                                </div>
                            ))}
                    </div>
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="bg-pink-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mr-2"
                        >
                            Anterior
                        </button>
                        <span className="bg-violet-300 text-gray-800 font-bold py-2 px-4">
                            Página {currentPage}
                        </span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="bg-pink-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
            {compraEnProceso && (
                <div>
                    compra en proceso
                    <ProductosMP precioFinal={finalPrice} />
                </div>
            )}
        </div>
    );
};

