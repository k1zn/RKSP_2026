import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, saveAuth } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      const data = await register(name, email, password, age ? Number(age) : undefined);
      saveAuth(data.access_token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1><img src="/logo192.png" alt="logo" className="app-logo" /> Дендрарий</h1>
        <p className="login-subtitle">Регистрация</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Иван Иванов"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
            />
          </div>
          <div className="form-group">
            <label>Возраст (необязательно)</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              min={0}
              max={150}
              placeholder="25"
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label>Повторите пароль</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="login-switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
