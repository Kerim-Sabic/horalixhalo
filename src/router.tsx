import { createHashRouter, Navigate } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import OnboardingPage from './pages/OnboardingPage';
import LiveMeetingPage from './pages/LiveMeetingPage';
import MeetingsPage from './pages/MeetingsPage';
import MeetingDetailPage from './pages/MeetingDetailPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';

// Overlay route (rendered in separate window)
import OverlayPage from './pages/OverlayPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/live" replace />,
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />,
      },
      {
        path: 'live',
        element: <LiveMeetingPage />,
      },
      {
        path: 'meetings',
        element: <MeetingsPage />,
      },
      {
        path: 'meetings/:id',
        element: <MeetingDetailPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
    ],
  },
  {
    path: '/overlay',
    element: <OverlayPage />,
  },
]);
