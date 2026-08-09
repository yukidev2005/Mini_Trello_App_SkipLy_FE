export function Spinner() {
  return (
    <span className='inline-block w-4.5 h-4.5 border-2 border-white/40 border-t-white rounded-full animate-spin' />
  );
}

export function PrivacyFooter() {
  return (
    <div className='flex flex-col items-center gap-1.5'>
      <a href='#' className='text-[12px] text-blue-600 hover:underline'>
        Privacy Policy
      </a>
      <p className='text-[11px] text-gray-400 text-center leading-relaxed'>
        This site is protected by reCAPTCHA and the Google{' '}
        <a href='#' className='text-blue-600 hover:underline'>
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href='#' className='text-blue-600 hover:underline'>
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </div>
  );
}
