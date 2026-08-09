import { Outlet, Navigate } from 'react-router';
import Header from '@/components/Header';
import { storage } from '@/lib/storage';

export default function MainLayout() {
  const token = storage.getToken();

  if (!token) {
    return <Navigate to='/auth/login' replace />;
  }

  return (
    <div className='relative min-h-dvh'>
      <Header />
      <div className='pt-12'>
        <Outlet />
      </div>
    </div>
  );
}
