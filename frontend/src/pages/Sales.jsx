import { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingCart, Package, DollarSign, Plus, AlertCircle } from 'lucide-react';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, productsRes] = await Promise.all([
        api.get('/sales'),
        api.get('/products'),
      ]);
      setSales(salesRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to fetch sales data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    setSelectedProduct(product);
    setFormData({ ...formData, product_id: productId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/sales', formData);
      setSales([response.data, ...sales]);
      // Update local product stock
      setProducts(products.map(p => 
        p.id === parseInt(formData.product_id) 
        ? { ...p, stock: p.stock - formData.quantity } 
        : p
      ));
      setModalOpen(false);
      setFormData({ product_id: '', quantity: 1 });
      setSelectedProduct(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record sale');
    }
  };

  return (
    <div className="container space-y-12 animate-fade-in-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-3 font-outfit tracking-tight">Sales Operations</h1>
          <p className="text-slate-400 font-medium leading-relaxed max-w-xl">
            Streamlined transaction tracking. Monitor revenue flow and quantity distribution across your network.
          </p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 py-4 px-8 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all active:scale-95 group font-outfit"
        >
          <div className="p-1.5 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
            <Plus size={20} />
          </div>
          <span>New Transaction</span>
        </button>
      </header>

      <div className="card glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading sales history...</td></tr>
              ) : sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-slate-500">#{sale.id}</td>
                    <td className="px-6 py-4 font-semibold text-white">{sale.product?.name || 'Unknown Item'}</td>
                    <td className="px-6 py-4 text-slate-300">{sale.quantity}</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">${parseFloat(sale.total_price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(sale.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No transactions recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-white mb-6">New Sale</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm text-slate-400 ml-1 font-medium">Select Product</label>
                <select 
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                  value={formData.product_id}
                  onChange={(e) => handleProductChange(e.target.value)}
                >
                  <option value="">Select an item...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} (${parseFloat(p.price).toFixed(2)}) - {p.stock} in stock
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm text-slate-400 ml-1 font-medium">Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    required
                    max={selectedProduct?.stock || 999}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  />
                  {selectedProduct && (
                    <p className="text-[10px] text-slate-500 ml-1 mt-1 uppercase tracking-wider font-bold">Max: {selectedProduct.stock}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-slate-400 ml-1 font-medium">Projected Total</label>
                  <div className="h-11 flex items-center px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-mono font-bold">
                    ${selectedProduct ? (selectedProduct.price * formData.quantity).toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={!selectedProduct || selectedProduct.stock < formData.quantity}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  Confirm Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
