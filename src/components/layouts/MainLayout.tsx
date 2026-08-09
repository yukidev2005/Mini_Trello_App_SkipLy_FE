import { Outlet, useNavigate } from 'react-router';
import Header from '@/components/Header';

export default function MainLayout() {
  const isAuth = localStorage.getItem('skipli_access_toke');
  const navigate = useNavigate();

  if (!isAuth) {
    navigate('/auth/login');
  }

  return (
    <div className='flex flex-col min-h-dvh bg-[#f0f2f5]'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
