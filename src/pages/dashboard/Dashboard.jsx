import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight } from 'lucide-react'
import { apiUrl } from '../../lib/api'

const statusColors = {
  Delivered: 'text-green-400 bg-green-400/10',
  Shipped: 'text-blue-400 bg-blue-400/10',
  Processing: 'text-yellow-400 bg-yellow-400/10',
  Cancelled: 'text-red-400 bg-red-400/10',
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    fetch(apiUrl('/api/stats')).then(r => r.json()).then(setStats)
    fetch(apiUrl('/api/orders?limit=5')).then(r => r.json()).then(setRecentOrders)
    fetch(apiUrl('/api/stats/bestsellers')).then(r => r.json()).then(setBestSellers)
  }, [])

  const statCards = stats ? [
    { label: 'Total Revenue', value: stats.revenue,                                        icon: DollarSign,  sub: stats.revenueThisWeek },
    { label: 'Total Orders',  value: stats.orders,                                         icon: ShoppingCart, sub: stats.ordersChange },
    { label: 'Products',      value: stats.products,                                       icon: Package,      sub: `${stats.products} in catalog` },
    { label: 'Customers',     value: stats.users,                                          icon: Users,        sub: stats.newUsers },
  ] : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white font-black text-2xl mb-1">Overview</h1>
        <p className="text-white/30 text-sm">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats === null ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#fffdf8] border border-black/10 p-5 animate-pulse">
              <div className="h-3 bg-black/10 w-24 mb-4" />
              <div className="h-8 bg-black/10 w-16 mb-2" />
              <div className="h-3 bg-black/10 w-20" />
            </div>
          ))
        ) : (
          statCards.map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="bg-[#fffdf8] border border-black/10 p-5">
              <div className="flex items-start justify-between mb-4">
                <p className="text-white/40 text-xs font-medium uppercase tracking-wide">{label}</p>
                <div className="w-8 h-8 bg-black/5 flex items-center justify-center">
                  <Icon size={15} className="text-white/40" />
                </div>
              </div>
              <p className="text-white font-black text-2xl mb-2">{value}</p>
              <p className="text-white/30 text-xs">{sub}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[#fffdf8] border border-black/10">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Recent Orders</h2>
            <Link to="/admin/orders" className="text-white/30 hover:text-white text-xs font-medium transition-colors flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-10">No orders yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Order', 'Customer', 'Product', 'Amount', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-white/30 text-xs font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-black/[0.03] transition-colors">
                      <td className="px-5 py-3.5 text-white/60 font-mono text-xs">{order.id}</td>
                      <td className="px-5 py-3.5 text-white font-medium">{order.customer}</td>
                      <td className="px-5 py-3.5 text-white/60 text-xs truncate max-w-[140px]">{order.product}</td>
                      <td className="px-5 py-3.5 text-white font-semibold">{order.amount}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-sm uppercase tracking-wide ${statusColors[order.status] ?? 'text-white/40 bg-white/5'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Best sellers */}
        <div className="bg-[#fffdf8] border border-black/10">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Best Sellers</h2>
            <Link to="/admin/products" className="text-white/30 hover:text-white text-xs transition-colors">
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {bestSellers.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-6">No sales data yet</p>
            ) : (
              bestSellers.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-white/20 text-xs font-bold w-4 flex-shrink-0">{i + 1}</span>
                  <img src={product.image} alt={product.name} className="w-9 h-9 object-cover bg-[#1a1a1a] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{product.name}</p>
                    <p className="text-white/30 text-[10px]">{product.sold > 0 ? `${product.sold} sold` : product.brand}</p>
                  </div>
                  <span className="text-white text-xs font-bold flex-shrink-0">${product.price}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
