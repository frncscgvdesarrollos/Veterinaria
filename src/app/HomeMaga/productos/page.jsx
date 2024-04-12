'use client'
import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct, updateProduct } from '@/app/firebase';
import Image from 'next/image';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    nombre: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    precio: 0,
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
    getProducts()
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

  function handleUpdateProduct(e) {
    e.preventDefault();
    updateProduct(formData.id, formData)
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
    deleteProduct(id)
      .then(() => {
        fetchProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
      nombre: '',
      descripcion: '',
      categoria: '',
      imagen: '',
      precio: 0,
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-3xl text-center mt-8 mb-4">PRODUCTOS</h1>
      <div className="container mx-auto p-4 md:p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Lista de productos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4"
        >
          {showForm ? 'Cerrar Formulario' : 'Agregar Producto'}
        </button>
        {showForm && (
          <form className="bg-gray-200 rounded-lg p-4 mb-4">
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
            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={formData.categoria}
              onChange={handleChange}
              className="rounded-lg mb-2 p-2 block w-full"
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
              name="precio"
              placeholder="Precio"
              value={formData.precio}
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
              onClick={editingProductId ? handleUpdateProduct : handleCreateProduct}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {editingProductId ? 'Actualizar' : 'Agregar'}
            </button>
          </form>
        )}
        <div className='overflow-x-auto'>
          <table className="w-full bg-white rounded-lg shadow-lg p-4 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
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
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{product.id}</td>
                  <td className="px-4 py-2">{product.nombre}</td>
                  <td className="px-4 py-2">{product.descripcion}</td>
                  <td className="px-4 py-2">{product.categoria}</td>
                  <td className="px-4 py-2">
                    <img src={product.imagen} alt={product.nombre} className="w-16 h-16 object-cover" />
                  </td>
                  <td className="px-4 py-2">{product.precio}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">
                    <button className="w-full my-2 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 mr-2" onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
                    <button className="w-full my-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600" onClick={() => openModal(product)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modal &&
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h2 className="text-2xl mb-4 text-center text-gray-700 font-bold uppercase bg-white rounded-lg p-4">Editar Producto</h2>
            <form className="bg-gray-200 rounded-lg p-4">
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
              <input
                type="text"
                name="categoria"
                placeholder="Categoría"
                value={formData.categoria}
                onChange={handleChange}
                className="rounded-lg mb-2 p-2 block w-full"
              />
              <img
                src={formData.imagen ? formData.imagen : '/placeholder-image.png'}
                alt={formData.nombre}
                className="w-16 h-16 object-cover"
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
                name="precio"
                placeholder="Precio"
                value={formData.precio}
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
        }
      </div>
    </div>
  );
}
