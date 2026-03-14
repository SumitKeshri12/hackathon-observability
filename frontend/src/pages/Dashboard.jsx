import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    saleCount: 0,
    totalRevenue: 0,
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, salesRes] = await Promise.all([
          api.get('/products'),
          api.get('/sales'),
        ]);

        const products = productsRes.data;
        const sales = salesRes.data;

        setStats({
          productCount: products.length,
          saleCount: sales.length,
          totalRevenue: sales.reduce((sum, sale) => sum + parseFloat(sale.total_price), 0),
          recentSales: sales.slice(-5).reverse(),
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading metrics...</div>;

  return (
    <div className="container space-y-10 animate-fade-in-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-3 font-outfit tracking-tight">System Overview</h1>
          <p className="text-slate-400 font-medium">Real-time performance and inventory tracking</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Live System Feed</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card glass flex items-center gap-6">
          <div className="p-4 bg-indigo-500/20 rounded-2xl">
            <Package className="text-indigo-400" size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-white">{stats.productCount}</p>
          </div>
        </div>

        <div className="card glass flex items-center gap-6">
          <div className="p-4 bg-emerald-500/20 rounded-2xl">
            <ShoppingCart className="text-emerald-400" size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Transactions</p>
            <p className="text-2xl font-bold text-white">{stats.saleCount}</p>
          </div>
        </div>

        <div className="card glass flex items-center gap-6">
          <div className="p-4 bg-amber-500/20 rounded-2xl">
            <TrendingUp className="text-amber-400" size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="card glass h-full">
          <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {stats.recentSales.length > 0 ? (
              stats.recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                      #{sale.id}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{sale.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-slate-500">{new Date(sale.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-400">${parseFloat(sale.total_price).toFixed(2)}</p>
                    <p className="text-xs text-slate-500">Qty: {sale.quantity}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">No transactions found</p>
            )}
          </div>
        </div>

        <div className="card glass h-full border-indigo-500/10">
          <h2 className="text-2xl font-bold text-white mb-8 font-outfit">Observability Status</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
              <span className="text-sm font-semibold text-slate-300">Tempo (Traces)</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
              <span className="text-sm font-semibold text-slate-300">Prometheus (Metrics)</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
              <span className="text-sm font-semibold text-slate-300">Loki (Logs)</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Shipping</span>
              </div>
            </div>
            <div className="mt-8 p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertCircle size={48} className="text-indigo-400" />
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <AlertCircle className="text-indigo-400 mt-1 shrink-0" size={20} />
                <p className="text-sm text-indigo-200/80 leading-relaxed font-medium">
                  Distributed tracing is enabled. Spans from this frontend are correlated with backend logic and can be visualized in Tempo using the Trace ID.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
