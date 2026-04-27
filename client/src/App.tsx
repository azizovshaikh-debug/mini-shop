import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import Admin from './pages/Admin';
import OrdersPage from './pages/OrdersPage';

function App() {
  const auth = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shop
          </Link>
          <div className="flex gap-4 text-gray-600 font-medium">
            <Link to="/" className="hover:text-blue-600">Товары</Link>
            <Link to="/cart" className="hover:text-blue-600 relative">
              Корзина
            </Link>
            {auth.token && <Link to="/orders" className="hover:text-blue-600">Мои заказы</Link>}
            {auth.user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-blue-600">Админка</Link>
            )}
          </div>
          <div className="ml-auto">
            {auth.token ? (
            <button
  onClick={() => dispatch(logout())}
  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg active:scale-95 transition-all"
>
  Выйти
</button>  
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;