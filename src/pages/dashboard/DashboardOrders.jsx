import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { apiUrl } from '../../lib/api'

const statusColors = {
  Delivered: 'text-green-400 bg-green-400/10',
  Shipped: 'text-blue-400 bg-blue-400/10',
  Processing: 'text-yellow-400 bg-yellow-400/10',
  Cancelled: 'text-red-400 bg-red-400/10',
}

const statuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function DashboardOrders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetch(apiUrl('/api/orders')).then(r => r.json()).then(setOrders)
  }, [])

  const filtered = orders
    .filter((o) => filterStatus === 'All' || o.status === filterStatus)
    .filter((o) =>
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white font-black text-2xl mb-1">Orders</h1>
        <p className="text-white/30 text-sm">{orders.length} total orders</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#111] border border-white/5 text-white placeholder-white/20 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-white/20 transition-colors w-56"
          />
        </div>

        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors border ${
                filterStatus === s
                  ? 'bg-accent border-accent text-white'
                  : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-white/30 text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-accent font-mono text-xs font-semibold">{order.id}</td>
                  <td className="px-5 py-4 text-white font-medium">{order.customer}</td>
                  <td className="px-5 py-4 text-white/50 text-xs">{order.product}</td>
                  <td className="px-5 py-4 text-white font-bold">{order.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/30 text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-white/20 py-10 text-sm">No orders found</p>
        )}
      </div>
    </div>
  )
}
