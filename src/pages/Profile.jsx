import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Package, ShoppingBag, Calendar, LogOut } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { apiUrl } from '../lib/api'

const statusColors = {
  Delivered: 'text-green-400 bg-green-400/10',
  Shipped: 'text-blue-400 bg-blue-400/10',
  Processing: 'text-yellow-400 bg-yellow-400/10',
  Cancelled: 'text-red-400 bg-red-400/10',
}

export default function Profile() {
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      fetch(apiUrl(`/api/users/${user.id}`)).then(r => r.json()),
      fetch(apiUrl(`/api/orders?userId=${user.id}`)).then(r => r.json()),
    ]).then(([u, o]) => {
      setUserData(u)
      setOrders(o)
      setLoading(false)
    })
  }, [user?.id])

  if (!user) return <Navigate to="/login?next=profile" replace />

  const displayTotal = userData
    ? (userData.totalNum > 0 ? '$' + userData.totalNum.toLocaleString('en-US', { maximumFractionDigits: 0 }) : userData.total)
    : '—'

  return (
    <div className="dashboard-light bg-black min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-white font-black text-3xl mb-1">{user.name}</h1>
            <p className="text-white/40 text-sm">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors border border-white/10 hover:border-white/30 px-4 py-2"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-[#0f0f0f] border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={14} className="text-white/30" />
              <p className="text-white/30 text-xs uppercase tracking-wide">Orders</p>
            </div>
            <p className="text-white font-black text-3xl">{loading ? '—' : userData?.orders ?? 0}</p>
          </div>
          <div className="bg-[#0f0f0f] border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package size={14} className="text-white/30" />
              <p className="text-white/30 text-xs uppercase tracking-wide">Total Spent</p>
            </div>
            <p className="text-white font-black text-3xl">{loading ? '—' : displayTotal}</p>
          </div>
          <div className="bg-[#0f0f0f] border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-white/30" />
              <p className="text-white/30 text-xs uppercase tracking-wide">Member Since</p>
            </div>
            <p className="text-white font-black text-lg">{user.joined}</p>
          </div>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">Order History</h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-[#0f0f0f] animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-[#0f0f0f] border border-white/5">
              <ShoppingBag size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm mb-6">No orders yet</p>
              <Link to="/products" className="btn-primary text-sm">Start Shopping</Link>
            </div>
          ) : (
            <div className="bg-[#0f0f0f] border border-white/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Order', 'Items', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-white/30 text-xs font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 text-accent font-mono text-xs font-bold">{order.id}</td>
                      <td className="px-5 py-4 text-white/60 text-xs max-w-[200px]">
                        <span className="line-clamp-2">{order.product}</span>
                      </td>
                      <td className="px-5 py-4 text-white font-bold">{order.amount}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColors[order.status] ?? 'text-white/40 bg-white/5'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/30 text-xs">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
