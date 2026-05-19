import React, { useEffect, useState } from 'react';
import { getHealthAuditLog, HealthAuditLog } from '../api/audit';

const STATUS_LABELS: Record<string, string> = { healthy: 'Здорово', ill: 'Болеет', dead: 'Погибло' };
const STATUS_CLASSES: Record<string, string> = { healthy: 'health-healthy', ill: 'health-ill', dead: 'health-dead' };

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span>—</span>;
  return <span className={`health-badge ${STATUS_CLASSES[status] ?? ''}`}>{STATUS_LABELS[status] ?? status}</span>;
}

export default function HealthAuditPage() {
  const [logs, setLogs] = useState<HealthAuditLog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getHealthAuditLog()
      .then(setLogs)
      .catch(() => setError('Ошибка загрузки журнала'));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Журнал изменений состояния здоровья</h2>
      </div>
      {error && <div className="error-msg">{error}</div>}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Дерево</th>
            <th>Было</th>
            <th>Стало</th>
            <th>Дата и время</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>#{l.tree_id}</td>
              <td><StatusBadge status={l.old_status} /></td>
              <td><StatusBadge status={l.new_status} /></td>
              <td>{new Date(l.changed_at).toLocaleString('ru-RU')}</td>
            </tr>
          ))}
          {logs.length === 0 && !error && (
            <tr><td colSpan={5} className="empty-row">Нет записей</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
