import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { APP_NAME } from '../config/appConfig';
import { usePlanStore } from '../store/planStore';
import { useConnectivityStore } from '../store/connectivityStore';
import Badge from '../components/ui/Badge';
import clsx from 'clsx';

export default function RootLayout() {
  const navigate = useNavigate();
  const plan = usePlanStore((state) => state.plan);
  const connectivityStatus = useConnectivityStore((state) => state.status);

  // TODO: Load settings and check onboarding status
  // For now, we'll assume onboarding is complete

  const navItems = [
    { to: '/live', label: 'Live', icon: '🎙️' },
    { to: '/meetings', label: 'Meetings', icon: '📋' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
    { to: '/account', label: 'Account', icon: '👤' },
  ];

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200">
          <h1 className="text-xl font-bold text-neutral-900">{APP_NAME}</h1>
          <p className="text-xs text-neutral-500 mt-1">Invisible AI Assistant</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-100'
                )
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 space-y-2">
          {/* Plan Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600">Plan</span>
            <Badge variant={plan?.tier === 'pro' ? 'success' : 'default'}>
              {plan?.tier === 'pro' ? 'Pro' : 'Free'}
            </Badge>
          </div>

          {/* Connectivity */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600">Status</span>
            <Badge
              variant={
                connectivityStatus === 'online'
                  ? 'success'
                  : connectivityStatus === 'offline'
                  ? 'error'
                  : 'warning'
              }
            >
              {connectivityStatus}
            </Badge>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
