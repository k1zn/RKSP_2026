import React, { useEffect, useState } from 'react';
import { getTrees, createTree, updateTree, deleteTree, Tree, CreateTreeDto } from '../api/trees';
import { getSpecies, Species } from '../api/species';
import { getLocations, Location } from '../api/locations';
import { getStoredUser } from '../api/auth';

const HEALTH_LABELS: Record<string, string> = { healthy: 'Здорово', ill: 'Болеет', dead: 'Погибло' };
const HEALTH_CLASSES: Record<string, string> = { healthy: 'health-healthy', ill: 'health-ill', dead: 'health-dead' };

const emptyForm: CreateTreeDto = { species_id: 0, location_id: undefined, plant_date: '', health_status: 'healthy', notes: '' };

export default function TreesPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === 'admin';
  const canAdd = isAdmin || user?.role === 'user';
  const [trees, setTrees] = useState<Tree[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [locationsList, setLocationsList] = useState<Location[]>([]);
  const [form, setForm] = useState<CreateTreeDto>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = () => getTrees().then(setTrees).catch(() => {});

  useEffect(() => {
    load();
    getSpecies().then(setSpeciesList).catch(() => {});
    getLocations().then(setLocationsList).catch(() => {});
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (t: Tree) => {
    setEditId(t.id);
    setForm({
      species_id: t.species_id,
      location_id: t.location_id ?? undefined,
      plant_date: t.plant_date ?? '',
      health_status: t.health_status,
      notes: t.notes ?? '',
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
    if (!form.species_id) { setError('Выберите вид'); return; }
    try {
      if (editId !== null) {
        await updateTree(editId, form);
      } else {
        await createTree(form);
      }
      handleCancel();
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить дерево?')) return;
    try {
      await deleteTree(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Деревья</h2>
        {canAdd && <button className="btn-primary" onClick={openAdd}>+ Добавить дерево</button>}
      </div>

      {showForm && canAdd && (
        <form onSubmit={handleSubmit} className="inline-form">
          <h3 style={{ marginBottom: 12, fontSize: 15, color: '#1b4332' }}>
            {editId !== null ? 'Редактирование дерева' : 'Новое дерево'}
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label>Вид *</label>
              <select value={form.species_id} onChange={e => setForm({ ...form, species_id: +e.target.value })} required>
                <option value={0}>— выберите вид —</option>
                {speciesList.map(s => <option key={s.id} value={s.id}>{s.common_name} ({s.latin_name})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Локация</label>
              <select value={form.location_id ?? ''} onChange={e => setForm({ ...form, location_id: e.target.value ? +e.target.value : undefined })}>
                <option value="">— не указана —</option>
                {locationsList.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Дата посадки</label>
              <input type="date" value={form.plant_date || ''} onChange={e => setForm({ ...form, plant_date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Состояние</label>
              <select value={form.health_status} onChange={e => setForm({ ...form, health_status: e.target.value })}>
                <option value="healthy">Здорово</option>
                <option value="ill">Болеет</option>
                <option value="dead">Погибло</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Заметки</label>
            <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
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
            <th>Вид</th>
            <th>Локация</th>
            <th>Дата посадки</th>
            <th>Состояние</th>
            <th>Заметки</th>
            {isAdmin && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {trees.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.species?.common_name || '—'}</td>
              <td>{t.location?.name || '—'}</td>
              <td>{t.plant_date || '—'}</td>
              <td><span className={`health-badge ${HEALTH_CLASSES[t.health_status]}`}>{HEALTH_LABELS[t.health_status]}</span></td>
              <td>{t.notes || '—'}</td>
              {isAdmin && (
                <td className="td-actions">
                  <button className="btn-edit" onClick={() => openEdit(t)}>Изменить</button>
                  <button className="btn-danger" onClick={() => handleDelete(t.id)}>Удалить</button>
                </td>
              )}
            </tr>
          ))}
          {trees.length === 0 && <tr><td colSpan={isAdmin ? 7 : 6} className="empty-row">Нет данных</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
