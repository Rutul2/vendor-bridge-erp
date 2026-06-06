// src/layouts/DashboardLayout.jsx
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import {
  LayoutDashboard, Users, FileText, MessageSquareQuote,
  CheckCircle2, ShoppingCart, Receipt, BarChart3, Activity,
  Bell, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { MOCK_NOTIFICATIONS } from "../utils/mockData";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Vendors", path: "/vendors", icon: Users },
  { name: "RFQs", path: "/rfqs", icon: FileText },
  { name: "Quotations", path: "/quotations", icon: MessageSquareQuote },
  { name: "Approvals", path: "/approvals", icon: CheckCircle2 },
  { name: "Purchase Orders", path: "/purchase-orders", icon: ShoppingCart },
  { name: "Invoices", path: "/invoices", icon: Receipt },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Activity", path: "/activity", icon: Activity },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate("/login"); };

  // Get current page name for breadcrumb
  const currentNav = navItems.find(item =>
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  );

  return (
    <div className="flex h-screen bg-background text-textMain">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-primary-500/20">
              V
            </div>
            <h1 className="text-lg font-bold tracking-wide text-white">VendorBridge</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-surfaceHighlight">
            <X size={18} className="text-textMuted" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                    : "text-textMuted hover:bg-surfaceHighlight hover:text-textMain border border-transparent"
                }`}
              >
                <Icon size={18} className={isActive ? "text-primary-400" : ""} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0] || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-textMain truncate">{user?.name || "Demo User"}</p>
              <p className="text-xs text-textDim">{user?.role || "Officer"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary-600/5 rounded-full blur-[120px] -z-0 pointer-events-none" />

        {/* Header */}
        <header className="h-14 bg-surface/70 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-surfaceHighlight">
              <Menu size={20} className="text-textMuted" />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-textMuted">
              <span>VendorBridge</span>
              <ChevronRight size={14} className="text-textDim" />
              <span className="text-textMain font-medium">{currentNav?.name || "Dashboard"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg hover:bg-surfaceHighlight transition-colors relative"
              >
                <Bell size={18} className="text-textMuted" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl z-50 animate-slide-up">
                    <div className="px-4 py-3 border-b border-border">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {MOCK_NOTIFICATIONS.slice(0, 4).map((n) => (
                        <div key={n._id} className={`px-4 py-3 border-b border-border/50 hover:bg-surfaceHighlight transition-colors ${!n.read ? 'bg-primary-500/5' : ''}`}>
                          <p className="text-sm text-textMain font-medium">{n.title}</p>
                          <p className="text-xs text-textMuted mt-0.5">{n.message}</p>
                        </div>
                      ))}
                    </div>
                    <Link to="/activity" onClick={() => setNotifOpen(false)} className="block px-4 py-2.5 text-center text-xs font-medium text-primary-400 hover:bg-surfaceHighlight transition-colors rounded-b-xl">
                      View all notifications
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Role badge */}
            <span className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider bg-surfaceHighlight px-2.5 py-1 rounded-md text-primary-400 border border-border">
              {user?.role || "Officer"}
            </span>

            {/* Logout */}
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-danger-500/10 transition-colors group" title="Logout">
              <LogOut size={18} className="text-textMuted group-hover:text-danger-400 transition-colors" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
