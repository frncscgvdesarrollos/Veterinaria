'use client'
import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct, updateProduct, actualizarId } from '@/app/firebase';
import Image from 'next/image';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    para: '',
    edad: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    precioCompra: 0,
    precioVenta: 0,
    stock: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [modal, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    getProducts()
      .then(productsData => {
        setProducts(productsData);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }

  function handleCreateProduct() {
    return getProducts()
      .then(allProducts => {
        const lastProductId = allProducts.length > 0 ? allProducts[0].id : 0;
        const newProductId = lastProductId + 1;
        const newFormData = { ...formData, id: newProductId };
        return createProduct(newFormData);
      })
      .then(() => {
        fetchProducts();
        resetFormDataAndCloseForm();
      })
      .catch(error => {
        console.error('Error creating product:', error);
      });
  }

  function handleEditProduct(product) {
    setFormData({ ...product });
    setEditingProductId(product.id);
    setShowForm(true);
  }

  function handleUpdateProduct() {
    return updateProduct(formData.id, formData)
      .then(() => {
        fetchProducts();
        resetFormDataAndCloseForm();
        closeModal();
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
  }
  
  function handleDeleteProduct(id) {
    console.log('Deleting product with ID:', id);
    return deleteProduct(id)
      .then(() => {
        fetchProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const parsedValue = name === "stock" ? parseInt(value) : value; // Parsear el valor del stock a un número
    setFormData(prevState => ({
      ...prevState,
      [name]: parsedValue
    }));
  }
  

  function handleImageChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;
      setFormData(prevState => ({
        ...prevState,
        imagen: base64Image
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function resetFormDataAndCloseForm() {
    setFormData({
      id: 0,
      para: '',
      edad: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      imagen: '',
      precioCompra: 0,
      precioVenta: 0,
      stock: 0
    });
    setShowForm(false);
    setEditingProductId(null);
  }

  function openModal(product) {
    setFormData({ ...product });
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }
  function handleUpdateIds() {
    actualizarId()
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating IDs:', error);
      });
  }
  
  return (
    <div className="bg-purple-100 min-h-screen">
      <h1 className="text-3xl ml-6 p-5 mb-4">PRODUCTOS</h1>
      <div className="container mx-auto p-4 md:p-8 bg-violet-200 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Lista de productos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 mb-4"
        >
          {showForm ? 'Cerrar Formulario' : 'Agregar Producto'}
        </button>
        <button onClick={() => handleUpdateIds()} className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-4'>Actualizar IDs</button>
        <div className="bg-violet-300 rounded-lg  ">
        {showForm && (
          <div className='flex mx-auto p-10 container-perspecitve'>
          <form className="bg-violet-200 rounded-lg p-4 mb-4 w-1/3 mx-auto">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
            />
            <select
              name="para"
              value={formData.para}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
            >
              <option value="">Seleccionar Para</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
            <select
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
            >
              <option value="">Seleccionar Edad</option>
              <option value="cachorro">Cachorro</option>
              <option value="adulto">Adulto</option>
            </select>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
            >
              <option value="">Seleccionar Categoría</option>
              <option value="alimento">Alimento</option>
              <option value="alimento suelto">Alimento Suelto</option>
              <option value="paseo">Paseo</option>
              <option value="juguetes">Juguetes</option>
              <option value="cuidados">Cuidados</option>
              <option value="ropa">Ropa</option>
            </select>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleImageChange}
              className="rounded-lg mb-2 p-2 block w-full"
            />
            <label className="text-lg font-semibold">Precios Compra</label>
            <input
              type="number"
              name="precioCompra"
              placeholder="Precio de Compra"
              value={formData.precioCompra}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
            />
            <label className="text-lg font-semibold">Precios Venta</label>
            <input
              type="number"
              name="precioVenta"
              placeholder="Precio de Venta"
              value={formData.precioVenta}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
            />
            <label className="text-lg font-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
            />
            <button
              type="button"
              onClick={editingProductId ? handleUpdateProduct : handleCreateProduct}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {editingProductId ? 'Actualizar' : 'Agregar'}
            </button>
          </form>
          <div className="mx-auto bg-pink-300  bg-opacity-70 p-10 rounded-lg p-4 mb-4 w-1/3 element4">
      {Object.keys(formData).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          {/* Card que muestra los detalles del producto */}
          <Image src={formData.imagen} alt="Imagen" className="mb-2" style={{ maxWidth: "100%" }} />
          <h2 className="text-xl font-semibold mb-2">{formData.nombre}</h2>
          <p className="text-gray-600 mb-2">{formData.descripcion}</p>
          <p className="text-gray-600 mb-2">Para: {formData.para}</p>
          <p className="text-gray-600 mb-2">Edad: {formData.edad}</p>
          <p className="text-gray-600 mb-2">Categoría: {formData.categoria}</p>
          <p className="text-lg font-semibold mb-2">Precio de Compra: {formData.precioCompra}</p>
          <p className="text-lg font-semibold mb-2">Precio de Venta: {formData.precioVenta}</p>
          <p className="text-lg font-semibold mb-2">Stock: {formData.stock}</p>
        </div>

            )}
          </div>
          </div>
        )}
        </div>

        <div className='overflow-x-auto'>
          <table className="w-full bg-violet-200 rounded-lg shadow-lg p-4 rounded-lg">
            <thead >
              <tr className="bg-violet-200 text-violet-300 bg-violet-500">     
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Imagen</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {products.map(product => (
                <tr key={product.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{product.id}</td>
                  <td className="px-4 py-2">{product.nombre}</td>
                  <td className="px-4 py-2">{product.descripcion}</td>
                  <td className="px-4 py-2">{product.categoria}</td>
                  <td className="px-4 py-2">
                  <Image
                      src={product.imagen}
                      alt={product.nombre}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{product.precioCompra} / {product.precioVenta}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">
                    <button className="w-full my-2 bg-blue-400 text-white px-2 py-1 rounded-lg hover:bg-blue-600" onClick={() => openModal(product)}>Editar</button>
                    <button className="w-full my-2 bg-purple-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 mr-2" onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modal &&
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-2xl mb-4 text-center text-gray-700 font-bold uppercase">Editar Producto</h2>
              <form className="bg-violet-200 rounded-lg p-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="rounded-lg mb-2 p-2 block w-full"
                />
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Descripción"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="rounded-lg mb-2 p-2 block w-full"
                />
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="rounded-lg mb-2 p-2 block w-full"
                  list="categoriaOptions"
                >
                  <option value="">Seleccionar Categoría</option>
                  <option value="alimento">Alimento</option>
                  <option value="alimento suelto">Alimento Suelto</option>
                  <option value="paseo">Paseo</option>
                  <option value="juguetes">Juguetes</option>
                  <option value="cuidados">Cuidados</option>
                  <option value="ropa">Ropa</option>
                </select>
                <Image
                  src={formData.imagen ? formData.imagen : '/placeholder-image.png'}
                  alt={formData.nombre} width={64} height={64}
                  className="object-cover"
                />
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="rounded-lg mb-2 p-2 block w-full"
                />
                <input
                  type="number"
                  name="precioCompra"
                  placeholder="Precio de Compra"
                  value={formData.precioCompra}
                  onChange={handleChange}
                  className="rounded-lg mb-2 p-2 block w-full"
                />
                <input
                  type="number"
                  name="precioVenta"
                  placeholder="Precio de Venta"
                  value={formData.precioVenta}
                  onChange={handleChange}
                  className="rounded-lg mb-2 p-2 block w-full"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="rounded-lg mb-2 p-2 block w-full"
                />
                <button
                  type="button"
                  onClick={handleUpdateProduct}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
