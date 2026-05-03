import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Documentation', path: '/docs', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-surface overflow-hidden text-ink dark:text-body-dark font-body">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-card border-r border-slate-200 dark:border-surface-elevated flex flex-col transition-transform duration-300 transform lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary font-display uppercase">AutoDoc AI</Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${location.pathname === item.path ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted hover:bg-surface-elevated hover:text-body-dark'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-surface-elevated space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <img src={user?.avatarUrl} alt={user?.username} className="w-8 h-8 rounded-full bg-slate-100" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Navbar */}
        <header className="lg:hidden h-16 bg-white dark:bg-surface-card border-b border-slate-200 dark:border-surface-elevated flex items-center justify-between px-4 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-primary font-display uppercase">AutoDoc AI</span>
          <img src={user?.avatarUrl} alt={user?.username} className="w-8 h-8 rounded-full" />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
