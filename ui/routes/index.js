import React, { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';

// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';

// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/analytics" /> },
        { path: 'profile/:userId', element: <Profile /> },
        { path: 'analytics', element: <GeneralApp /> },

        // documents
        { path: 'documents', element: <Documents /> },
        { path: 'documents/create', element: <DocumentCreate /> },
        { path: 'documents/:documentId/edit', element: <DocumentCreate /> },

        // sessions
        { path: 'sessions', element: <Sessions /> },
        { path: 'sessions/create', element: <SessionCreate /> },
        { path: 'sessions/:sessionId/edit', element: <SessionCreate /> },

        // locations
        { path: 'locations', element: <Locations /> },
        { path: 'locations/create', element: <LocationCreate /> },
        { path: 'locations/:locationId/edit', element: <LocationCreate /> },

        // areas
        { path: 'areas', element: <Areas /> },
        { path: 'areas/create', element: <AreaCreate /> },
        { path: 'areas/:areaId/edit', element: <AreaCreate /> },

        // templates
        { path: 'templates', element: <Templates /> },
        { path: 'templates/create', element: <TemplateCreate /> },
        { path: 'templates/:templateId/edit', element: <TemplateCreate /> },
        { path: 'templates/preview', element: <PreviewTemplate /> },

        // schedules
        { path: 'schedules', element: <Schedules /> },
        { path: 'schedules/create', element: <ScheduleCreate /> },
        { path: 'schedules/:scheduleId/edit', element: <ScheduleCreate /> },
        { path: 'schedules/preview', element: <ScheduleTemplate /> },
        
        // Admin/entities
        {
          path: 'entities',
          element: (
            <RoleBasedGuard>
              <Entities />
            </RoleBasedGuard>
          )
        },
        {
          path: 'entities/create',
          element: (
            <RoleBasedGuard>
              <EntityCreate />
            </RoleBasedGuard>
          )
        },
        {
          path: 'entities/:entityId/edit',
          element: (
            <RoleBasedGuard>
              <EntityCreate />
            </RoleBasedGuard>
          )
        },

        // Admin/users
        {
          path: 'users',
          element: (
            <RoleBasedGuard>
              <User />
            </RoleBasedGuard>
          )
        },
        {
          path: 'users/:userId/edit',
          element: (
            <RoleBasedGuard>
              <UserProfile />
            </RoleBasedGuard>
          )
        },

        // Admin/user-settings
        {
          path: 'user-settings',
          element: (
            <RoleBasedGuard>
              <UserSettings />
            </RoleBasedGuard>
          )
        }
      ]
    },
    {
      path: 'auth',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="login" /> },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> }
      ]
    },
    { path: '/verify-email/:token', element: <VerifyEmail /> },
    { path: '/reset-password/:token', element: <NewPassword /> },

    // Main RoutesResetPassword
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '/', element: <Navigate to="/auth/login" replace /> },
        // { element: <HomePage />, index: true },
        { path: 'contact-us', element: <ContactPage /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// main pages
const HomePage = Loadable(lazy(() => import('../pages/external_pages/Home')));
const ContactPage = Loadable(lazy(() => import('../pages/external_pages/Contact')));

// others
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const Page404 = Loadable(lazy(() => import('../pages/other/Page404')));

// documents
const Documents = Loadable(lazy(() => import('../pages/dashboard/document')));
const DocumentCreate = Loadable(lazy(() => import('../pages/dashboard/document/DocumentCreate')));

// sessions
const Sessions = Loadable(lazy(() => import('../pages/dashboard/session')));
const SessionCreate = Loadable(lazy(() => import('../pages/dashboard/session/SessionCreate')));

// entities
const Entities = Loadable(lazy(() => import('../pages/dashboard/entity')));
const EntityCreate = Loadable(lazy(() => import('../pages/dashboard/entity/EntityCreate')));

// locations
const Locations = Loadable(lazy(() => import('../pages/dashboard/location')));
const LocationCreate = Loadable(lazy(() => import('../pages/dashboard/location/LocationCreate')));

// areas
const Areas = Loadable(lazy(() => import('../pages/dashboard/area')));
const AreaCreate = Loadable(lazy(() => import('../pages/dashboard/area/AreaCreate')));

// templates
const Templates = Loadable(lazy(() => import('../pages/dashboard/template')));
const TemplateCreate = Loadable(lazy(() => import('../pages/dashboard/template/TemplateCreate')));

const PreviewTemplate = Loadable(lazy(() => import('../pages/dashboard/template/PreviewTemplate')));

// schedules
const Schedules = Loadable(lazy(() => import('../pages/dashboard/schedule')));
const ScheduleCreate = Loadable(lazy(() => import('../pages/dashboard/schedule/ScheduleCreate')));

const ScheduleTemplate = Loadable(lazy(() => import('../pages/dashboard/schedule/ScheduleTemplate')));

// users
const User = Loadable(lazy(() => import('../pages/dashboard/user')));
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/user-profile')));

// user settings
const UserSettings = Loadable(lazy(() => import('../pages/dashboard/userSettings')));

const Profile = Loadable(lazy(() => import('../pages/profile')));

// authentications
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/authentication/NewPassword')));
const VerifyEmail = Loadable(lazy(() => import('../pages/authentication/VerifyEmail')));
