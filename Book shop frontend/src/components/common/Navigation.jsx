import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Receipt, 
  LogOut,
  BookOpen 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from './GlassCard';

const Navigation = () => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      permission: 'view_dashboard',
    },
    {
      path: '/customers',
      label: 'Customers',
      icon: Users,
      permission: 'view_customers',
    },
    {
      path: '/items',
      label: 'Items',
      icon: Package,
      permission: 'view_items',
    },
    {
      path: '/billing',
      label: 'Billing',
      icon: Receipt,
      permission: 'manage_bills',
    },
  ];

  const isActivePath = (path) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 p-4">
      <GlassCard className="h-full flex flex-col">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3 mb-8 p-2">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Pahana Edu</h1>
            <p className="text-gray-300 text-sm">Billing System</p>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-6 p-3 bg-white bg-opacity-10 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{user?.username}</p>
              <p className="text-gray-300 text-sm capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            const hasPerms = hasPermission(item.permission);
            
            // Add debug logging
            console.log(`Permission check for ${item.label}:`, {
              permission: item.permission,
              hasPermission: hasPerms,
              user: user,
              userRole: user?.role
            });

            if (!hasPerms) {
              console.log(`❌ ${item.label} hidden - no permission for: ${item.permission}`);
              return null;
            }

            console.log(`✅ ${item.label} visible - has permission: ${item.permission}`);

            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  nav-link
                  ${isActive ? 'active bg-white bg-opacity-20' : ''}
                `}
              >
                <Icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-white border-opacity-20">
          <button
            onClick={logout}
            className="nav-link w-full text-left hover:bg-red-500 hover:bg-opacity-20"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Navigation;