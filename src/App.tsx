import AuthLayout from '@/components/layouts/AuthLayout';
import MainLayout from '@/components/layouts/MainLayout';
import LoginPage from '@/modules/auth/LoginPage/LoginPage';
import RegisterPage from '@/modules/auth/RegisterPage/RegsterPage';
import BoardsPage from '@/modules/Boards/Boards';
import BoardDetail from '@/modules/BoardDetail/BoardDetail';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { storage } from '@/lib/storage';

function RootRedirect() {
  const token = storage.getToken();
  if (token) {
    return <Navigate to='/boards' replace />;
  }
  return <Navigate to='/auth/login' replace />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
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
      {
        path: 'boards/:boardId',
        element: <BoardDetail />,
      },
    ],
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
