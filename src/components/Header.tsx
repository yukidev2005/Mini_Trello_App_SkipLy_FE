import logo from '@/assets/skiply_logo.png';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { UserInfo } from '@/lib/types/auth.types';

function getInitials(user: UserInfo): string {
  if (user.name) {
    return user.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return user.email[0].toUpperCase();
}

function getUserFromStorage(): UserInfo | null {
  try {
    const raw = localStorage.getItem('skipli_user_info');
    return raw ? (JSON.parse(raw) as UserInfo) : null;
  } catch {
    return null;
  }
}

export default function Header() {
  const user = getUserFromStorage();

  return (
    <header className='w-full fixed top-0 left-0 right-0 h-12 bg-[#2d3142] flex items-center justify-between px-3 sm:px-4 shrink-0'>
      {/* ── Left: grid icon + logo ── */}
      <div className='flex items-center gap-2'>
        {/* Grid / apps icon */}
        <button
          id='header-apps-btn'
          type='button'
          aria-label='Apps'
          className='p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors'
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 18 18'
            fill='currentColor'
            aria-hidden='true'
          >
            <rect x='0' y='0' width='7' height='7' rx='1' />
            <rect x='11' y='0' width='7' height='7' rx='1' />
            <rect x='0' y='11' width='7' height='7' rx='1' />
            <rect x='11' y='11' width='7' height='7' rx='1' />
          </svg>
        </button>

        {/* Skipli logo */}
        <button
          id='header-home-btn'
          type='button'
          aria-label='Home'
          className='flex items-center justify-center rounded hover:bg-white/10 p-0.5 transition-colors'
        >
          <img src={logo} alt='Skipli' className='h-7 w-7 object-contain' />
        </button>
      </div>

      {/* ── Right: notification bell + user avatar ── */}
      <div className='flex items-center gap-1 sm:gap-2'>
        {/* Bell icon */}
        <button
          id='header-notifications-btn'
          type='button'
          aria-label='Notifications'
          className='p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors'
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden='true'
          >
            <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
            <path d='M13.73 21a2 2 0 0 1-3.46 0' />
          </svg>
        </button>

        {/* User avatar */}
        {user ? (
          <button
            id='header-user-btn'
            type='button'
            aria-label={`User: ${user.name ?? user.email}`}
            className='rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
          >
            <Avatar size='default'>
              <AvatarFallback className='bg-red-500 text-white text-xs font-bold'>
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
          </button>
        ) : (
          /* Placeholder khi chưa đăng nhập */
          <div className='size-8 rounded-full bg-red-500 flex items-center justify-center'>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
              className='text-white'
            >
              <path d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z' />
            </svg>
          </div>
        )}
      </div>
    </header>
  );
}
