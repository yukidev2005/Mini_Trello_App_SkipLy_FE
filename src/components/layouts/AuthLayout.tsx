import { Outlet, useNavigate } from 'react-router';
import authLeftImg from '@/assets/auth_image.png';
import authRightImg from '@/assets/hero.png';

export default function AuthLayout() {
  const isAuth = localStorage.getItem('skipli_access_toke');
  const navigate = useNavigate();

  if (isAuth) {
    navigate('/boards');
  }

  return (
    <div className='relative min-h-dvh w-full bg-[#f0f2f5] flex items-center justify-center overflow-hidden font-sans'>
      {/* Left illustration */}
      <img
        src={authLeftImg}
        alt=''
        aria-hidden='true'
        className='absolute bottom-0 left-0 w-70 object-contain pointer-events-none select-none'
      />

      {/* Center card area */}
      <div className='relative z-10 flex items-center justify-center w-full px-4 py-8'>
        <Outlet />
      </div>

      {/* Right illustration */}
      <img
        src={authRightImg}
        alt=''
        aria-hidden='true'
        className='absolute bottom-0 right-0 w-70 object-contain pointer-events-none select-none'
      />
    </div>
  );
}
