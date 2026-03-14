import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-6 z-50 px-8 py-5 flex items-center justify-between mx-auto max-w-7xl animate-fade-in-up">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl font-bold text-gradient flex items-center gap-3 active:scale-95 transition-transform">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <LayoutDashboard size={26} className="text-indigo-400" />
          </div>
          <span className="font-outfit tracking-tight">Hackathon 2.0</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-2 group">
            <span className="relative py-1">
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
          <Link to="/products" className="text-sm font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-2 group">
              <Package size={18} className="text-slate-500 group-hover:text-indigo-400" />
              <span className="relative py-1">
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
              </span>
          </Link>
          <Link to="/sales" className="text-sm font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-2 group">
              <ShoppingCart size={18} className="text-slate-500 group-hover:text-emerald-400" />
              <span className="relative py-1">
                Sales
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-full flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-slate-300 font-medium tracking-wide font-mono">
            Hi, <span className="text-white font-bold">{user?.name}</span>
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all text-red-400"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
