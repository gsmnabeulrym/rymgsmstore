import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState('');
  const [editUploadedImages, setEditUploadedImages] = useState([]);
  const [editImageUrls, setEditImageUrls] = useState('');

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', searchTerm, selectedCategory, page],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10'); // 10 products per page
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      return api.get(`/products?${params.toString()}`).then(res => res.data);
    },
    enabled: isAdmin
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (productData) => api.post('/products', productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setShowAddModal(false);
      resetFormStates();
      setPage(1); // Reset to first page after creating
      toast.success('Product created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...productData }) => api.put(`/products/${id}`, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setEditingProduct(null);
      resetFormStates();
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId) => api.delete(`/products/${productId}`),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      // If current page becomes empty, go to previous page
      const currentProducts = productsData?.products || [];
      if (currentProducts.length === 1 && page > 1) {
        setPage(page - 1);
      }
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  });

  // Handle image file upload (for create form)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target.result);
          if (newImages.length === files.length) {
            setUploadedImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handle image file upload (for edit form)
  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target.result);
          if (newImages.length === files.length) {
            setEditUploadedImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove uploaded image (for create form)
  const removeUploadedImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded image (for edit form)
  const removeEditUploadedImage = (index) => {
    setEditUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Reset form states
  const resetFormStates = () => {
    setUploadedImages([]);
    setImageUrls('');
    setEditUploadedImages([]);
    setEditImageUrls('');
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Combine uploaded images and URL images
    const urlImages = imageUrls.split(',').map(url => url.trim()).filter(url => url);
    const allImages = [...uploadedImages, ...urlImages];
    
    const specs = {};
    
    // Parse specs from form
    if (formData.get('ram')) specs.ram = formData.get('ram');
    if (formData.get('storage')) specs.storage = formData.get('storage');
    if (formData.get('camera')) specs.camera = formData.get('camera');
    if (formData.get('battery')) specs.battery = formData.get('battery');
    if (formData.get('display')) specs.display = formData.get('display');
    if (formData.get('processor')) specs.processor = formData.get('processor');
    
    const stockValue = formData.get('stock');
    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      description: formData.get('description'),
      images: allImages,
      specs
    };
    
    // Only include stock if provided (optional field)
    if (stockValue && stockValue.trim() !== '') {
      productData.stock = parseInt(stockValue);
    }
    
    createProductMutation.mutate(productData);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Combine uploaded images and URL images
    const urlImages = editImageUrls.split(',').map(url => url.trim()).filter(url => url);
    const allImages = [...editUploadedImages, ...urlImages];
    
    const specs = {};
    
    // Parse specs from form
    if (formData.get('ram')) specs.ram = formData.get('ram');
    if (formData.get('storage')) specs.storage = formData.get('storage');
    if (formData.get('camera')) specs.camera = formData.get('camera');
    if (formData.get('battery')) specs.battery = formData.get('battery');
    if (formData.get('display')) specs.display = formData.get('display');
    if (formData.get('processor')) specs.processor = formData.get('processor');
    
    const stockValue = formData.get('stock');
    const productData = {
      id: editingProduct.id,
      name: formData.get('name'),
      brand: formData.get('brand'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      description: formData.get('description'),
      images: allImages,
      specs
    };
    
    // Only include stock if provided (optional field)
    if (stockValue && stockValue.trim() !== '') {
      productData.stock = parseInt(stockValue);
    }
    
    updateProductMutation.mutate(productData);
  };

  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 text-gray-400 mx-auto mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page</p>
        </div>
      </div>
    );
  }

  const products = productsData?.products || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage your product inventory</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reset to first page when searching
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1); // Reset to first page when filtering
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les Catégories</option>
                <option value="phone">Téléphones</option>
                <option value="laptop">Ordinateurs</option>
                <option value="tablet">Tablettes</option>
                <option value="watch">Montres</option>
                <option value="accessory">Accessoires</option>
                <option value="speaker">Enceintes</option>
                <option value="earphone">Écouteurs</option>
                <option value="charger">Chargeurs</option>
                <option value="case">Coques</option>
                <option value="powerbank">Batteries Externes</option>
                <option value="other">Autres</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPage(1); // Reset to first page when clearing filters
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col min-h-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Filter className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or add a new product</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Product
              </button>
            </div>
          ) : (
            <div 
              className="overflow-x-auto overflow-y-auto flex-1" 
              style={{ 
                maxHeight: 'calc(100vh - 400px)'
              }}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded-lg"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.brand}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.price} Dt
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/products/${product.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Product"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              // Initialize edit form with existing images - load them into editUploadedImages so they can be removed
                              setEditUploadedImages(product.images || []);
                              setEditImageUrls('');
                            }}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {productsData?.pagination && productsData.pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(productsData.pagination.totalPages, page + 1))}
                  disabled={page === productsData.pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {((page - 1) * productsData.pagination.limit) + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(page * productsData.pagination.limit, productsData.pagination.totalProducts || 0)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{productsData.pagination.totalProducts || 0}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(productsData.pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === productsData.pagination.totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <span
                            key={pageNum}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() => setPage(Math.min(productsData.pagination.totalPages, page + 1))}
                      disabled={page === productsData.pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price (Dt)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock (optional)</label>
                      <input
                        type="number"
                        name="stock"
                        placeholder="Leave empty for unlimited"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        <option value="phone">Téléphone</option>
                        <option value="laptop">Ordinateur</option>
                        <option value="tablet">Tablette</option>
                        <option value="watch">Montre Connectée</option>
                        <option value="accessory">Accessoire</option>
                        <option value="speaker">Enceinte / Haut-parleur</option>
                        <option value="earphone">Écouteurs / Casque</option>
                        <option value="charger">Chargeur / Câble</option>
                        <option value="case">Coque / Protection</option>
                        <option value="powerbank">Batterie Externe</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                      
                      {/* File Upload */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Upload Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      {/* URL Input */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Or Add Image URLs (comma-separated)</label>
                        <input
                          type="text"
                          value={imageUrls}
                          onChange={(e) => setImageUrls(e.target.value)}
                          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Image Preview */}
                      {(uploadedImages.length > 0 || imageUrls) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">Image Preview</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {/* Uploaded Images */}
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-md border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeUploadedImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {/* URL Images Preview */}
                            {imageUrls && imageUrls.split(',').map((url, index) => {
                              const trimmedUrl = url.trim();
                              return trimmedUrl ? (
                                <div key={`url-${index}`} className="relative">
                                  <img
                                    src={trimmedUrl}
                                    alt={`URL ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-md border"
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTE2IDlIMTJNMTIgOUw4IDEzTDEyIDE3IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                                    }}
                                  />
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Specifications */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Specifications (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600">RAM</label>
                        <input
                          type="text"
                          name="ram"
                          placeholder="e.g., 8GB"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Storage</label>
                        <input
                          type="text"
                          name="storage"
                          placeholder="e.g., 256GB"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Camera</label>
                        <input
                          type="text"
                          name="camera"
                          placeholder="e.g., 48MP Main"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Battery</label>
                        <input
                          type="text"
                          name="battery"
                          placeholder="e.g., 3274 mAh"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Display</label>
                        <input
                          type="text"
                          name="display"
                          placeholder="e.g., 6.1-inch Super Retina XDR"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Processor</label>
                        <input
                          type="text"
                          name="processor"
                          placeholder="e.g., A17 Pro chip"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetFormStates();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createProductMutation.isPending}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingProduct.name}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        defaultValue={editingProduct.brand}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price (Dt)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        defaultValue={editingProduct.price}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock (optional)</label>
                      <input
                        type="number"
                        name="stock"
                        defaultValue={editingProduct.stock}
                        placeholder="Leave empty for unlimited"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        defaultValue={editingProduct.category}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        <option value="phone">Téléphone</option>
                        <option value="laptop">Ordinateur</option>
                        <option value="tablet">Tablette</option>
                        <option value="watch">Montre Connectée</option>
                        <option value="accessory">Accessoire</option>
                        <option value="speaker">Enceinte / Haut-parleur</option>
                        <option value="earphone">Écouteurs / Casque</option>
                        <option value="charger">Chargeur / Câble</option>
                        <option value="case">Coque / Protection</option>
                        <option value="powerbank">Batterie Externe</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                      
                      {/* File Upload */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Upload Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      {/* URL Input */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Or Add Image URLs (comma-separated)</label>
                        <input
                          type="text"
                          value={editImageUrls}
                          onChange={(e) => setEditImageUrls(e.target.value)}
                          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Image Preview */}
                      {(editUploadedImages.length > 0 || editImageUrls) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">Image Preview</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {/* Uploaded Images */}
                            {editUploadedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-md border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeEditUploadedImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {/* URL Images Preview */}
                            {editImageUrls && editImageUrls.split(',').map((url, index) => {
                              const trimmedUrl = url.trim();
                              return trimmedUrl ? (
                                <div key={`url-${index}`} className="relative">
                                  <img
                                    src={trimmedUrl}
                                    alt={`URL ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-md border"
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTE2IDlIMTJNMTIgOUw4IDEzTDEyIDE3IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                                    }}
                                  />
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      defaultValue={editingProduct.description}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Specifications */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Specifications (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600">RAM</label>
                        <input
                          type="text"
                          name="ram"
                          defaultValue={editingProduct.specs?.ram || ''}
                          placeholder="e.g., 8GB"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Storage</label>
                        <input
                          type="text"
                          name="storage"
                          defaultValue={editingProduct.specs?.storage || ''}
                          placeholder="e.g., 256GB"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Camera</label>
                        <input
                          type="text"
                          name="camera"
                          defaultValue={editingProduct.specs?.camera || ''}
                          placeholder="e.g., 48MP Main"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Battery</label>
                        <input
                          type="text"
                          name="battery"
                          defaultValue={editingProduct.specs?.battery || ''}
                          placeholder="e.g., 3274 mAh"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Display</label>
                        <input
                          type="text"
                          name="display"
                          defaultValue={editingProduct.specs?.display || ''}
                          placeholder="e.g., 6.1-inch Super Retina XDR"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Processor</label>
                        <input
                          type="text"
                          name="processor"
                          defaultValue={editingProduct.specs?.processor || ''}
                          placeholder="e.g., A17 Pro chip"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        resetFormStates();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProductMutation.isPending}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
