import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/MMO.png"; // Adjust the path as necessary
import {
  Menu,
  X,
  Home,
  User,
  ClipboardList,
  Settings,
  Users,
  BarChart3,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAdmin, isManager } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Onboarding", href: "/onboarding", icon: ClipboardList },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", icon: BarChart3 },
    { name: "User Management", href: "/admin/users", icon: Users },
    {
      name: "Onboarding Management",
      href: "/admin/onboarding",
      icon: Settings,
    },
  ];

  const isActivePath = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-secondary-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/20" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-50 w-72 bg-white border-r border-secondary-200 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-out md:translate-x-0 md:static md:inset-0`}
      >
        {/* Sidebar header */}
        <div className="flex justify-center py-8 px-8 items-center border-b border-secondary-200">
          <div className="flex items-center">
            <img
              src={logo}
              alt="MMO Health Systems Logo"
              className="h-24 w-24 rounded-lg shadow-lg"
            />

          </div>
          <button
            className="md:hidden text-white/70 hover:text-white p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-8 py-6 border-b border-secondary-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-medium text-sm">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.full_name || "User"}
              </p>
              <p className="text-xs text-secondary-500 truncate">
                {user?.employee_id && `ID: ${user.employee_id}`}
              </p>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary-100 text-secondary-700 mt-2">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8 space-y-1 overflow-y-auto">
          {/* Main navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-500 text-black"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? "text-black"
                        : "text-secondary-400 group-hover:text-secondary-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Admin navigation */}
          {(isAdmin || isManager) && (
            <div className="pt-8">
              <div className="px-3 mb-3">
                <h3 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              <div className="space-y-1">
                {adminNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary-500 text-black"
                          : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive
                            ? "text-black"
                            : "text-secondary-400 group-hover:text-secondary-500"
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Logout button */}
        <div className="p-6 border-t border-secondary-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-secondary-600 rounded-lg hover:bg-secondary-50 hover:text-secondary-900 transition-colors group"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-500" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-20 bg-white shadow-sm border-b border-secondary-200">
          <button
            className="px-6 border-r border-secondary-200 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50 focus:outline-none md:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-8 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-secondary-900">
                {navigation.find((item) => isActivePath(item.href))?.name ||
                  adminNavigation.find((item) => isActivePath(item.href))
                    ?.name ||
                  "Dashboard"}
              </h1>
            </div>

            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* Notifications */}
              <button className="relative p-2 text-secondary-400 hover:text-secondary-500 hover:bg-secondary-50 focus:outline-none rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 p-2 text-sm rounded-lg text-secondary-700 hover:bg-secondary-50 focus:outline-none transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <span className="text-black font-medium text-sm">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black/5 border border-secondary-200 overflow-hidden">
                    <div className="py-1">
                      <div className="px-4 py-3 bg-secondary-50 border-b border-secondary-100">
                        <p className="font-medium text-secondary-900 text-sm">
                          {user?.full_name}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="mr-3 h-4 w-4 text-secondary-400" />
                        <span>Profile Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="mx-auto px-6 lg:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
