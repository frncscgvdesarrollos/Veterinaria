'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/app/firebase';
import ProductosMP from '@/app/components/ProductosMp';


export default function Page() {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [comprar, setComprar] = useState(false);

    useEffect(() => {
        // Obtener los productos de Firebase
        getProducts()
            .then(products => {
                // Establecer el estado de productos con los datos obtenidos
                setProductos(products);
            })
            .catch(error => {
                // Manejar cualquier error que ocurra al obtener los productos
                console.error('Error al obtener los productos:', error);
            });
    }, []);

    // Función para filtrar productos según la categoría seleccionada
    const filtrarProductos = (categoria) => {
        setFiltro(categoria);
    };

    // Función para agregar un producto al carrito
    const agregarAlCarrito = (producto, cantidad) => {
        // Verificar si el producto ya está en el carrito
        const index = carrito.findIndex(item => item.id === producto.id);
        if (index !== -1) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            const nuevoCarrito = [...carrito];
            nuevoCarrito[index].cantidad += cantidad;
            setCarrito(nuevoCarrito);
        } else {
            // Si el producto no está en el carrito, agregarlo con la cantidad
            setCarrito([...carrito, { ...producto, cantidad }]);
        }
    };

    // Función para eliminar un producto del carrito
    const eliminarDelCarrito = (id) => {
        const nuevoCarrito = carrito.filter(item => item.id !== id);
        setCarrito(nuevoCarrito);
    };

    // Calcular el precio total del carrito
    const calcularPrecioTotal = () => {
        return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    };

    return (
        <div className="p-4 md:p-8 lg:p-12">
            <h1 className="text-3xl font-bold text-center mt-8 mb-4">Productos</h1>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex justify-center space-x-4 my-4 border border-gray-400 px-4 py-2 rounded-md bg-gray-100 md:w-1/3">
                    {/* Lista de navegación de categorías */}
                    <button className={`w-full md:w-auto border border-gray-400 px-4 py-2 rounded-md ${filtro === '' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`} onClick={() => filtrarProductos('')}>Todos</button>
                    <button className={`w-full md:w-auto border border-gray-400 px-4 py-2 rounded-md ${filtro === 'categoria1' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`} onClick={() => filtrarProductos('categoria1')}>Categoría 1</button>
                    <button className={`w-full md:w-auto border border-gray-400 px-4 py-2 rounded-md ${filtro === 'categoria2' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`} onClick={() => filtrarProductos('categoria2')}>Categoría 2</button>
                </div>
                {/* Icono del carrito */}
                <div className="relative">
                    <p className="text-3xl cursor-pointer" onClick={() => setMostrarCarrito(!mostrarCarrito)}>🛒</p>
                    {/* Contador de elementos en el carrito */}
                    {carrito.length > 0 && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            {carrito.length}
                        </div>
                    )}
                </div>
            </div>
            {/* Modal del carrito */}
            {mostrarCarrito && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full h-full">
                    <div className="bg-white p-8 rounded-lg md:w-2/3">
                        <div className="flex justify-between mb-4 w-full">
                            <h2 className="text-lg font-semibold">Carrito de compras</h2>
                            <button onClick={() => setMostrarCarrito(false)}>Cerrar</button>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            {carrito.map((producto) => (
                                <div key={producto.id} className="flex items-center justify-between w-full bg-gray-100 px-4 py-2 rounded-lg">
                                    <div className="flex flex-col gap-2 bg-gray-300 w-full rounded-lg p-2">
                                        <p className="font-semibold">{producto.nombre}</p>
                                        <p>Precio: ${producto.precio}</p>
                                        <p>Cantidad: {producto.cantidad}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => eliminarDelCarrito(producto.id)} className="text-red-600 hover:text-red-800 focus:outline-none">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <p className="text-gray-600">Total: ${calcularPrecioTotal()}</p>
                            <button onClick={() => setComprar(true)} className="bg-lime-700 hover:bg-lime-300 text-white hover:text-black font-semibold py-2 px-4 rounded focus:outline-none">Comprar</button>
                        </div>
                        {comprar &&
                            <div>
                                <ProductosMP carrito={calcularPrecioTotal()} />
                            </div>
                        }
                    </div>
                </div>
            )}
            <div className="grid p-4 md:p-8 lg:p-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center">
                {/* Renderizar los productos filtrados según la categoría */}
                {productos
                    .filter(producto => filtro === '' || producto.categoria === filtro)
                    .map(producto => (
                        <div key={producto.id} className="bg-gray-100 p-4 rounded-lg shadow-lg">
                            <img src={producto.imagen} alt={producto.nombre} className="w-full h-40 object-cover mb-4 rounded-lg" />
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
                                    <p className="text-gray-700 mb-2">Precio: ${producto.precio}</p>
                                    <p className="text-gray-700 mb-2">Descripción: {producto.descripcion}</p>
                                    <p>Stock: {producto.stock}</p>
                                    <input placeholder='Cantidad' type="number" min="1" value={producto.cantidad || 1} onChange={(e) => agregarAlCarrito(producto, parseInt(e.target.value))} />
                                    <button onClick={() => agregarAlCarrito(producto, 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none">Agregar al carrito</button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
    
}
