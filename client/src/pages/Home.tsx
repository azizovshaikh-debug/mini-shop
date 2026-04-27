import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import ProductImage from '../components/ProductImage';

const API = 'http://localhost:3000';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(API + '/products').then(res => setProducts(res.data));
  }, []);

  const categories = [...new Set(products.map((p: any) => p.category))];

  const filtered = products.filter((p: any) => {
    if (name && !p.name.toLowerCase().includes(name.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Каталог товаров</h1>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex gap-3 items-center">
        <input
          placeholder="🔍 Поиск по названию..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
        >
          ⚙️ Фильтры
          {(category || minPrice || maxPrice) && (
            <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">!</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Категория</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Все категории</option>
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Мин. цена</label>
            <input type="number" placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2.5" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Макс. цена</label>
            <input type="number" placeholder="999999" className="w-full border border-gray-300 rounded-lg px-3 py-2.5" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-xl">Товары не найдены</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p: any) => (
            <div key={p.id} className="card bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
              <ProductImage category={p.category} name={p.name} imageUrl={p.imageUrl} />
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-bold text-lg text-gray-800 mb-1">{p.name}</h2>
                <p className="text-gray-500 text-sm mb-2" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{p.description}</p>
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-3 w-fit">{p.category}</span>
                <p className="text-2xl font-extrabold text-green-600 mb-4 mt-auto">{p.price} ₽</p>
                <button
                  className="btn-cart w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg mt-auto"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.classList.add('added');
                    btn.textContent = '✅ Добавлено';
                    setTimeout(() => {
                      btn.classList.remove('added');
                      btn.textContent = '🛒 В корзину';
                    }, 1000);
                    dispatch(addToCart({ productId: p.id, quantity: 1 }) as any);
                  }}
                >
                  🛒 В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
