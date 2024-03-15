'use client'
import { useState, useEffect } from 'react';
import { getProducts } from '../firebase';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            return new Promise((resolve, reject) => {
                getProducts()
                    .then((products) => {
                        setProductos(products);
                        setIsLoading(false);
                        resolve(products);
                    })
                    .catch((error) => {
                        console.error('Error fetching products:', error);
                        reject(error);
                    });
            });
        };

        if (isLoading) {
            fetchData();
        }
    }, [isLoading]);

    return (
        <>
            <h3 className='text-xl text-center'>Repartos de productos</h3>
            <hr />
            <h4 className='font-bold'>Estado de los repartos</h4>
            <div>
                {productos.map((product) => (
                    <div key={product.id}>
                        <p>{product.nombre}</p>
                        <p>{product.descripcion}</p>
                        <p>{product.precio}</p>
                        <p>{product.tipo}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
