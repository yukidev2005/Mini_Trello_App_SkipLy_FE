import AuthLayout from '@/components/layouts/AuthLayout';
import MainLayout from '@/components/layouts/MainLayout';
import LoginPage from '@/modules/auth/LoginPage/LoginPage';
import RegisterPage from '@/modules/auth/RegisterPage/RegsterPage';
import BoardsPage from '@/modules/Boards/Boards';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to='/auth/login' replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'boards',
        element: <BoardsPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
