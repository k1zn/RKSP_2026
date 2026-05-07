import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '../api/auth';

interface Props {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const user = getStoredUser();
    if (!user || user.role !== requiredRole) {
      return (
        <div className="error-page">
          <h2>Доступ запрещён</h2>
          <p>У вас недостаточно прав для просмотра этой страницы.</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
