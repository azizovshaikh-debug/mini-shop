import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  useEffect(() => {
    axios.get(API + '/orders/my', { headers })
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 text-xl">Загрузка...</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Мои заказы</h1>
        <div className="text-center py-20 text-gray-400 text-xl">
          У вас пока нет заказов
        </div>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    pending: '🕐 В обработке',
    shipped: '🚚 Отправлен',
    delivered: '✅ Доставлен',
    cancelled: '❌ Отменён',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Мои заказы</h1>
      <div className="grid gap-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md p-5 animate-fadeIn">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-gray-500 text-sm">Заказ №{order.id}</p>
                <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleString('ru-RU')}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            <div className="border-t pt-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span className="text-gray-700">{item.product?.name || 'Товар'} x {item.quantity}</span>
                  <span className="text-gray-600">{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mt-3 flex justify-between items-center">
              <div>
                {order.address && <p className="text-gray-500 text-sm">📍 {order.address}</p>}
                {order.phone && <p className="text-gray-500 text-sm">📞 {order.phone}</p>}
                {order.comment && <p className="text-gray-400 text-xs mt-1">💬 {order.comment}</p>}
              </div>
              <p className="text-xl font-extrabold text-green-600">{order.total.toFixed(2)} ₽</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
