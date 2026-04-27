import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, checkout } from '../store/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.cart.items);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchCart() as any);
  }, []);

  const total = items.reduce((sum: number, item: any) => sum + item.product?.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!address || !phone) {
      alert('Заполните адрес и телефон');
      return;
    }
    dispatch(checkout({ address, phone, comment }) as any);
  };

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Корзина</h1>
        <p>Корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Корзина</h1>
      {items.map((item: any) => (
        <div key={item.id} className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center">
          <div>
            <p className="font-bold">{item.product?.name}</p>
            <p>{item.quantity} x {item.product?.price} ₽</p>
          </div>
          <button className="text-red-500" onClick={() => dispatch(removeFromCart(item.id) as any)}>Удалить</button>
        </div>
      ))}

      <div className="bg-white p-4 rounded shadow mt-4">
        <p className="font-bold text-lg">Итого: {total.toFixed(2)} ₽</p>

        <div className="mt-4 grid gap-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Адрес доставки*"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Телефон*"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <textarea
            className="border p-2 rounded w-full"
            placeholder="Комментарий к заказу"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

       <button
  className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 active:scale-95 transition-all"
  onClick={(e) => {
    const btn = e.currentTarget;
    btn.textContent = '✅ Заказ оформлен!';
    btn.classList.add('bg-green-700');
    setTimeout(() => {
      btn.textContent = 'Оформить заказ';
      btn.classList.remove('bg-green-700');
    }, 1500);
    handleCheckout();
  }}
>
  Оформить заказ
</button>
      </div>
    </div>
  );
}
