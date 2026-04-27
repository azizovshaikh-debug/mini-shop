import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

export default function Admin() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '', category: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  const loadProducts = () => {
    axios.get(API + '/products')
      .then(res => setProducts(res.data))
      .catch(err => setError('Ошибка загрузки: ' + err.message));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(API + '/products/upload', formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, imageUrl: res.data.url });
    } catch (err: any) {
      setError('Ошибка загрузки: ' + err.message);
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price) };
    const request = editId
      ? axios.put(API + '/products/' + editId, data, { headers })
      : axios.post(API + '/products', data, { headers });

    request
      .then(() => {
        setForm({ name: '', description: '', price: '', imageUrl: '', category: '' });
        setEditId(null);
        loadProducts();
      })
      .catch(err => setError('Ошибка сохранения: ' + err.message));
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Удалить товар #' + id + '?')) return;
    axios.delete(API + '/products/' + id, { headers })
      .then(() => loadProducts())
      .catch(err => setError('Ошибка удаления: ' + err.message));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Админ-панель</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
        <input className="border p-2 w-full mb-2" placeholder="Название" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 w-full mb-2" placeholder="Описание" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="border p-2 w-full mb-2" type="number" placeholder="Цена" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />

        {/* Загрузка картинки */}
        <div className="mb-2">
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
          {uploading && <span className="ml-2 text-gray-500">Загрузка...</span>}
          {form.imageUrl && (
            <div className="mt-2">
              <img src={API + form.imageUrl} alt="preview" className="h-20 rounded" />
              <button type="button" className="ml-2 text-red-500 text-sm" onClick={() => setForm({ ...form, imageUrl: '' })}>Удалить</button>
            </div>
          )}
        </div>

        <input className="border p-2 w-full mb-2" placeholder="Категория" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition-all" type="submit">
  {editId ? 'Обновить' : 'Добавить'}
</button>
        {editId && (
          <button type="button" className="ml-2 bg-gray-500 text-white px-4 py-2 rounded" onClick={() => { setEditId(null); setForm({ name: '', description: '', price: '', imageUrl: '', category: '' }); }}>
            Отмена
          </button>
        )}
      </form>

      <div className="grid gap-2">
        {products.map((p: any) => (
          <div key={p.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              {p.imageUrl && <img src={API + p.imageUrl} alt={p.name} className="h-10 w-10 object-cover rounded" />}
              <span>{p.name} - {p.price} руб</span>
            </div>
            <div>
              <button className="text-blue-500 mr-2" onClick={() => { setForm(p); setEditId(p.id); }}>Ред.</button>
              <button className="text-red-500" onClick={() => handleDelete(p.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
