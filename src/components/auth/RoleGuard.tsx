
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser, UserRole } from '@/data/mockData';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const navigate = useNavigate();
  const user = currentUser;
  
  React.useEffect(() => {
    if (!allowedRoles.includes(user.role) && !fallback) {
      navigate('/');
    }
  }, [user.role, allowedRoles, navigate, fallback]);

  if (!allowedRoles.includes(user.role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
