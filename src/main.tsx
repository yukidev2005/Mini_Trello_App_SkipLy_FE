import { createRoot } from 'react-dom/client';
import './index.css';
import ReactQueryProvider from '@/components/ReactQueryProvider.tsx';
import App from '@/App';

createRoot(document.getElementById('root')!).render(
  <ReactQueryProvider>
    <App />
  </ReactQueryProvider>,
);
