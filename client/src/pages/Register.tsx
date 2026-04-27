import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ email, password }) as any).then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-2" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 active:scale-95 transition-all" type="submit"> Зарегистрироваться </button>
      </form>
      <Link to="/login" className="text-blue-500 mt-2 block">Войти</Link>
    </div>
  );
}