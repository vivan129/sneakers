import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft,
  Menu, X, TrendingUp, LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/admin/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/users', icon: Users, label: 'Users' },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="dashboard-light min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0d0d0d] border-r border-white/5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Brand text only */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <div>
            <span className="text-white font-bold text-sm tracking-tight">NO LOGO JUST VIBE</span>
          </div>
          <button className="md:hidden text-white/40 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3">
          <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase px-3 mb-4">Management</p>
          <ul className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/40 hover:text-red-400 transition-colors w-full">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0d0d0d] sticky top-0 z-30">
          <button
            className="md:hidden text-white/50 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:flex items-center gap-2 text-white/30 text-sm">
            <TrendingUp size={14} />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-semibold">{user?.name ?? 'Admin'}</p>
              <p className="text-white/30 text-xs">Admin</p>
            </div>
            <div className="w-8 h-8 bg-accent flex items-center justify-center rounded-sm">
              <span className="text-white text-xs font-bold">{user?.name?.[0] ?? 'A'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
