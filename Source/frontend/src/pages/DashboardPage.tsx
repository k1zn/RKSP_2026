import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredUser } from '../api/auth';
import { getTrees } from '../api/trees';
import { getSpecies } from '../api/species';
import { getLocations } from '../api/locations';
import { getUsers } from '../api/users';

export default function DashboardPage() {
  const user = getStoredUser();
  const [stats, setStats] = useState({ trees: 0, species: 0, locations: 0, users: 0 });

  useEffect(() => {
    Promise.all([getTrees(), getSpecies(), getLocations(), getUsers()])
      .then(([trees, species, locations, users]) => {
        setStats({ trees: trees.length, species: species.length, locations: locations.length, users: users.length });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      <h2>Добро пожаловать, {user?.name}</h2>
      <p className="page-description">
        Дендрарий — информационная система для каталогизации древесных пород и управления данными о деревьях в парках и дендропарках.
      </p>
      <div className="stats-grid">
        <Link to="/trees" className="stat-card">
          <div className="stat-number">{stats.trees}</div>
          <div className="stat-label">Деревьев</div>
        </Link>
        <Link to="/species" className="stat-card">
          <div className="stat-number">{stats.species}</div>
          <div className="stat-label">Видов</div>
        </Link>
        <Link to="/locations" className="stat-card">
          <div className="stat-number">{stats.locations}</div>
          <div className="stat-label">Локаций</div>
        </Link>
        {user?.role === 'admin' ? (
          <Link to="/users" className="stat-card">
            <div className="stat-number">{stats.users}</div>
            <div className="stat-label">Пользователей</div>
          </Link>
        ) : (
          <div className="stat-card">
            <div className="stat-number">{stats.users}</div>
            <div className="stat-label">Пользователей</div>
          </div>
        )}
      </div>
    </div>
  );
}
