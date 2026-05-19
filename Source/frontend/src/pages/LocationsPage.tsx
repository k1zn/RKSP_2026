import React, { useEffect, useState } from 'react';
import { getLocations, createLocation, deleteLocation, Location, CreateLocationDto } from '../api/locations';
import { getStoredUser } from '../api/auth';

const emptyForm: CreateLocationDto = { name: '', address: '', area_ha: undefined, description: '' };

export default function LocationsPage() {
  const user = getStoredUser();
  const canAdd = user?.role === 'admin' || user?.role === 'user';
  const canDelete = user?.role === 'admin';
  const [list, setList] = useState<Location[]>([]);
  const [form, setForm] = useState<CreateLocationDto>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = () => getLocations().then(setList).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createLocation(form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить локацию?')) return;
    try {
      await deleteLocation(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Локации</h2>
        {canAdd && <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Добавить локацию</button>}
      </div>

      {showForm && canAdd && (
        <form onSubmit={handleSubmit} className="inline-form">
          <div className="form-row">
            <div className="form-group">
              <label>Название *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Адрес</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Площадь (га)</label>
              <input type="number" step="0.1" value={form.area_ha ?? ''} onChange={e => setForm({ ...form, area_ha: e.target.value ? +e.target.value : undefined })} />
            </div>
          </div>
          <div className="form-group">
            <label>Описание</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
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
            <th>Название</th>
            <th>Адрес</th>
            <th>Площадь</th>
            <th>Описание</th>
            {canDelete && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {list.map(loc => (
            <tr key={loc.id}>
              <td>{loc.id}</td>
              <td>{loc.name}</td>
              <td>{loc.address || '—'}</td>
              <td>{loc.area_ha ? `${loc.area_ha} га` : '—'}</td>
              <td>{loc.description || '—'}</td>
              {canDelete && (
                <td>
                  <button className="btn-danger" onClick={() => handleDelete(loc.id)}>Удалить</button>
                </td>
              )}
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={canDelete ? 6 : 5} className="empty-row">Нет данных</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
