import React, { useEffect, useState } from 'react';
import { getSpecies, createSpecies, updateSpecies, deleteSpecies, Species, CreateSpeciesDto } from '../api/species';
import { getStoredUser } from '../api/auth';

const emptyForm: CreateSpeciesDto = { latin_name: '', common_name: '', family: '', description: '', max_height_m: undefined };

export default function SpeciesPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === 'admin';
  const canAdd = isAdmin || user?.role === 'user';
  const [list, setList] = useState<Species[]>([]);
  const [form, setForm] = useState<CreateSpeciesDto>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = () => getSpecies().then(setList).catch(() => {});

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (s: Species) => {
    setEditId(s.id);
    setForm({
      latin_name: s.latin_name,
      common_name: s.common_name,
      family: s.family ?? '',
      description: s.description ?? '',
      max_height_m: s.max_height_m ?? undefined,
    });
    setError('');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editId !== null) {
        await updateSpecies(editId, form);
      } else {
        await createSpecies(form);
      }
      handleCancel();
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить вид?')) return;
    try {
      await deleteSpecies(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Виды деревьев</h2>
        {canAdd && <button className="btn-primary" onClick={openAdd}>+ Добавить вид</button>}
      </div>

      {showForm && canAdd && (
        <form onSubmit={handleSubmit} className="inline-form">
          <h3 style={{ marginBottom: 12, fontSize: 15, color: '#1b4332' }}>
            {editId !== null ? 'Редактирование вида' : 'Новый вид'}
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label>Латинское название *</label>
              <input value={form.latin_name} onChange={e => setForm({ ...form, latin_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Русское название *</label>
              <input value={form.common_name} onChange={e => setForm({ ...form, common_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Семейство</label>
              <input value={form.family} onChange={e => setForm({ ...form, family: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Макс. высота (м)</label>
              <input type="number" value={form.max_height_m ?? ''} onChange={e => setForm({ ...form, max_height_m: e.target.value ? +e.target.value : undefined })} />
            </div>
          </div>
          <div className="form-group">
            <label>Описание</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="btn-primary">Сохранить</button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>Отмена</button>
          </div>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Латинское название</th>
            <th>Русское название</th>
            <th>Семейство</th>
            <th>Макс. высота</th>
            {isAdmin && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td><em>{s.latin_name}</em></td>
              <td>{s.common_name}</td>
              <td>{s.family || '—'}</td>
              <td>{s.max_height_m ? `${s.max_height_m} м` : '—'}</td>
              {isAdmin && (
                <td className="td-actions">
                  <button className="btn-edit" onClick={() => openEdit(s)}>Изменить</button>
                  <button className="btn-danger" onClick={() => handleDelete(s.id)}>Удалить</button>
                </td>
              )}
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={isAdmin ? 6 : 5} className="empty-row">Нет данных</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
