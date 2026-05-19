import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth, getStoredUser } from '../api/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/"><img src="/logo192.png" alt="logo" className="app-logo" /> Дендрарий</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Главная</Link>
        <Link to="/trees">Деревья</Link>
        <Link to="/species">Виды</Link>
        <Link to="/locations">Локации</Link>
        {user?.role === 'admin' && <Link to="/users">Пользователи</Link>}
      </div>
      <div className="navbar-user">
        {user && (
          <>
            <span className="user-info">
              {user.name}{' '}
              <span className={`role-badge role-${user.role}`}>
                {user.role === 'admin' ? 'Админ' : user.role === 'user' ? 'Пользователь' : 'Гость'}
              </span>
            </span>
            <button onClick={handleLogout} className="btn-logout">Выйти</button>
          </>
        )}
      </div>
    </nav>
  );
}
