import React, { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser, User, CreateUserDto } from '../api/users';
import { getStoredUser } from '../api/auth';

const emptyForm: CreateUserDto = { name: '', email: '', age: undefined, password: 'changeme', role: 'user' };

export default function UsersPage() {
  const currentUser = getStoredUser();
  const [list, setList] = useState<User[]>([]);
  const [form, setForm] = useState<CreateUserDto>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = () => getUsers().then(setList).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createUser(form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить пользователя?')) return;
    try {
      await deleteUser(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Пользователи</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Добавить пользователя</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="inline-form">
          <div className="form-row">
            <div className="form-group">
              <label>Имя *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Возраст</label>
              <input type="number" value={form.age ?? ''} onChange={e => setForm({ ...form, age: e.target.value ? +e.target.value : undefined })} min={0} max={150} />
            </div>
            <div className="form-group">
              <label>Роль</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="user">Пользователь</option>
                <option value="admin">Админ</option>
                <option value="guest">Гость</option>
              </select>
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="btn-primary">Сохранить</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Возраст</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {list.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.age ?? '—'}</td>
              <td>
                <span className={`role-badge role-${u.role}`}>
                  {u.role === 'admin' ? 'Админ' : u.role === 'user' ? 'Пользователь' : 'Гость'}
                </span>
              </td>
              <td>
                {u.id !== currentUser?.id && u.role !== 'admin' && (
                  <button className="btn-danger" onClick={() => handleDelete(u.id)}>Удалить</button>
                )}
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={6} className="empty-row">Нет данных</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
