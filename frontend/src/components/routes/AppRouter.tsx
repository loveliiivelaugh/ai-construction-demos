import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { Providers } from '@components/Providers/Providers';
import { AppShell } from '@components/layout/AppShell';
import { ConstructionLayout } from '@components/layout/ConstructionLayout';
import HomePage from '@components/pages/HomePage';
import DocsPage from '@components/pages/DocsPage';
import { ExampleFeaturePage } from '@components/features/ExampleFeature';
import {
  DashboardPage,
  CRMPage,
  BiddingPage,
  ProjectsPage,
  BlueprintsPage,
  MaterialsPage,
  WorkforcePage,
  PayrollPage,
  ContractsPage,
} from '@components/features/construction';

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

function ConstructionPortalLayout() {
  return (
    <Providers>
      {() => (
        <ConstructionLayout>
          <Outlet />
        </ConstructionLayout>
      )}
    </Providers>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/construction/dashboard" replace /> },
      { path: 'docs', element: <DocsPage /> },
      { path: 'example', element: <ExampleFeaturePage /> },
      { path: 'home', element: <HomePage /> },
    ],
  },
  {
    path: '/construction',
    element: <ConstructionPortalLayout />,
    children: [
      { index: true, element: <Navigate to="/construction/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'crm', element: <CRMPage /> },
      { path: 'bidding', element: <BiddingPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'blueprints', element: <BlueprintsPage /> },
      { path: 'materials', element: <MaterialsPage /> },
      { path: 'workforce', element: <WorkforcePage /> },
      { path: 'payroll', element: <PayrollPage /> },
      { path: 'contracts', element: <ContractsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
