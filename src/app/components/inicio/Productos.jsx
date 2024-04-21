'use client';
import React, { useState, useEffect } from 'react';
import { getProducts } from '@/app/firebase';
import ProductosMP from '@/app/components/mercadopago/ProductosMp';
import Image from 'next/image';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [comprar, setComprar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    useEffect(() => {
        getProducts()
            .then(products => {
                setProductos(products);
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    }, [currentPage]);

    const totalPages = Math.ceil(productos.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => {
        if (pageNumber < 1) {
            setCurrentPage(1);
        } else if (pageNumber > totalPages) {
            setCurrentPage(totalPages);
        } else {
            setCurrentPage(pageNumber);
        }
    };

    const filtrarProductos = (categoria) => {
        setFiltro(categoria);
    };

    const agregarAlCarrito = (producto) => {
        const index = carrito.findIndex(item => item.id === producto.id);
        if (index !== -1) {
            const nuevoCarrito = [...carrito];
            nuevoCarrito[index].cantidad += 1;
            setCarrito(nuevoCarrito);
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const eliminarDelCarrito = (id) => {
        const nuevoCarrito = carrito.filter(item => item.id !== id);
        setCarrito(nuevoCarrito);
    };

    const calcularPrecioTotal = () => {
        return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    };

    const firstProductIndexOnPage = (currentPage - 1) * productsPerPage + 1;
    const lastProductIndexOnPage = Math.min(currentPage * productsPerPage, productos.length);

    return (
        <React.Fragment className="w-auto h-auto md:w-full md:h-full lg:w-full lg:h-full    ">
            <div >
                <div className="w-full flex justify-around items-center mx-auto ">
                    <div className='producto flex '> 
                        <h1 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 ml-10 flex ">
                            {/* <Image src="/celular2.png" alt="logo" width={32} height={32} className="object-cover rounded-lg" /> */}
                            Hace tu pedido
                        </h1>
                    </div>
                    <div className='flex  producto absolute top-12 mt-12'>
                        <h2 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 ml-10  ">Cuando quieras ! 
                        {/* <Image src="/dondesea.png" alt="logo" width={32} height={32} className="object-cover rounded-lg" /> */}
                        </h2>
                    </div>
                    <div className='flex flex-col producto absolute top-24 mt-24 hidden md:visible'> 
                        <h3 className="text-3xl font-bold text-left mt-8 mb-4 text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 ml-10 ">Y esperalo en tu casa !</h3>
                        {/* <Image src="/casa.png" alt="logo" width={32} height={32} className="object-cover rounded-lg" /> */}
                    </div>
                </div>
                <div className="p-4 md:p-8 lg:p-12 bg-violet-200 bg-opacity-50 w-full mx-auto rounded-lg mt-10">
    <div className="flex justify-between">
        <div className="flex justify-between">
            <div className='flex flex-col'> 
                <h1 className="text-3xl font-bold text-left  text-purple-800 text-center bg-pink-300 p-2 rounded-lg bg-opacity-50 ml-10 ">Tienda !</h1>
            </div>
            <button className="text-3xl cursor-pointer mr-16 " onClick={() => setMostrarCarrito(!mostrarCarrito)}>
                🛒
                {carrito.length > 0 && (
                    <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        {carrito.reduce((total, producto) => total + producto.cantidad, 0)}
                    </div>
                )}
            </button>
        </div>
    </div>
    {mostrarCarrito && (
        <div className="bg-pink-300 rounded-lg m-2 p-4 bg-opacity-50 flex justify-center items-center w-full h-full">
            {/* Contenido del carrito */}
        </div>
    )}

    {/* Productos */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-5 rounded-lg container-perspective mx-auto w-full">
        {currentProducts
            .filter(producto => filtro === '' || producto.categoria === filtro)
            .map((producto , index) => (
                <div key={index} className="bg-pink-300 border-4 border-yellow-200 rounded-lg p-4 mx-auto element4 element">
                    <Image src={producto.imagen} alt={producto.nombre} width={150} height={150} className="object-cover mb-4 rounded-lg mx-auto h-[200px] w-full" />
                    <div className="flex flex-col justify-between h-auto bg-violet-100 rounded-lg p-4 h-[200px]">
                        <div className=''>
                            <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
                            <p className="text-gray-700 mb-2">Precio: ${producto.precio}</p>
                            <p className="text-gray-700 mb-2">Descripción: {producto.descripcion}</p>
                        </div>
                    </div>
                    <button onClick={() => agregarAlCarrito(producto)} className="bg-purple-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 w-full rounded focus:outline-none">Agregar al carrito</button>
                </div>
            ))}
    </div>

    {/* Paginación */}
    <div className="flex justify-center mt-10">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l mt-10">
            Anterior
        </button>
        <span className="bg-gray-300 text-gray-800 font-bold py-2 px-4">
            Página {currentPage}
        </span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r mt-10">
            Siguiente
        </button>
    </div>
</div>

            </div>
        </React.Fragment>
    );
    
}
