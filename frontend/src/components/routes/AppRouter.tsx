import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Providers } from '@components/Providers/Providers';
import { AppShell } from '@components/layout/AppShell';
import HomePage from '@components/pages/HomePage';
import DocsPage from '@components/pages/DocsPage';
import { ExampleFeaturePage } from '@components/features/ExampleFeature';

function Layout() {
  return (
    <Providers>
      {() => (
        <AppShell title="Starter App">
          <Outlet />
        </AppShell>
      )}
    </Providers>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'docs', element: <DocsPage /> },
      { path: 'example', element: <ExampleFeaturePage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
