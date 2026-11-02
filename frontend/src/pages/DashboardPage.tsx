import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';
import { FacultyDashboard } from '../components/dashboard/FacultyDashboard';
import { PlacementDashboard } from '../components/dashboard/PlacementDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'faculty':
      return <FacultyDashboard />;
    case 'placement_coordinator':
      return <PlacementDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};
