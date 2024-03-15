import { useState , useEffect } from 'react'

export default function Productos() {
    const [productos , setProductos] = useState([])
    const [isLoading , setIsLoading] = useState(false)
    
    const pro = new Promise((resolve, reject) => {
        getProducts()
        .then((products) => {
            setProductos(products)
            resolve(products)
        })
        .catch((error) => {
            reject(error)
        })
    })

    useEffect(() => {
        pro()
    }, [productos]);
    return (
    <>
    <h3 className='text-xl text-center'>Repartos de productos</h3>
    <hr></hr>
    <h4 className='font-bold'>Estado de los repartos</h4>
    <div>
        {productos.map((product) => (
            <div key={product.id}>
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <p>{product.state}</p>
            </div>
        ))}
    </div>
  </>
  )
}
