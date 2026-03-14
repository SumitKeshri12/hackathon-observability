import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const response = await api.put(`/products/${editingProduct.id}`, formData);
        setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
      } else {
        const response = await api.post('/products', formData);
        setProducts([...products, response.data]);
      }
      setModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '' });
    } catch (err) {
      alert('Failed to save product');
    }
  };

  return (
    <div className="container space-y-12 animate-fade-in-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-3 font-outfit tracking-tight">Product Inventory</h1>
          <p className="text-slate-400 font-medium leading-relaxed max-w-xl">
            Surgical precision in catalog management. Track stock levels and pricing with real-time accuracy.
          </p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '' }); setModalOpen(true); }}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 py-4 px-8 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all active:scale-95 group font-outfit"
        >
          <div className="p-1.5 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus size={20} />
          </div>
          <span>Add New Asset</span>
        </button>
      </header>

      <div className="card glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-16">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading inventory...</td></tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-center text-slate-500 font-mono text-sm">#{product.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{product.name}</p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{product.description}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-indigo-400 font-semibold">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm font-medium">{product.stock} in stock</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No products found. Start by adding one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-slate-400"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProduct ? 'Update Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-400 ml-1">Product Name</label>
                <input 
                  type="text" required placeholder="e.g. Ultra Gaming Mouse"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-400 ml-1">Description (Optional)</label>
                <textarea 
                  className="bg-white/5 border border-white/10 rounded-lg p-3 w-full text-white h-24"
                  placeholder="Describe the product details..."
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-slate-400 ml-1">Price ($)</label>
                  <input 
                    type="number" step="0.01" required placeholder="0.00"
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-400 ml-1">Initial Stock</label>
                  <input 
                    type="number" required placeholder="0"
                    value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 py-3">Cancel</button>
                <button type="submit" className="flex-1">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
