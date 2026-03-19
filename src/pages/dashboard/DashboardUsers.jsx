import { useState, useEffect } from 'react'
import { Search, UserCheck, UserX } from 'lucide-react'
import { apiUrl } from '../../lib/api'

export default function DashboardUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(apiUrl('/api/users')).then(r => r.json()).then(setUsers)
  }, [])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = async (user) => {
    const updated = await fetch(apiUrl(`/api/users/${user.id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active }),
    }).then(r => r.json())
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl mb-1">Users</h1>
          <p className="text-white/30 text-sm">{users.length} registered customers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111] border border-white/5 p-4">
          <p className="text-white/30 text-xs uppercase tracking-wide mb-2">Total Users</p>
          <p className="text-white font-black text-2xl">{users.length}</p>
        </div>
        <div className="bg-[#111] border border-white/5 p-4">
          <p className="text-white/30 text-xs uppercase tracking-wide mb-2">Active</p>
          <p className="text-white font-black text-2xl">{users.filter((u) => u.active).length}</p>
        </div>
        <div className="bg-[#111] border border-white/5 p-4">
          <p className="text-white/30 text-xs uppercase tracking-wide mb-2">Avg. Orders</p>
          <p className="text-white font-black text-2xl">
            {users.length ? (users.reduce((s, u) => s + u.orders, 0) / users.length).toFixed(1) : '—'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#111] border border-white/5 text-white placeholder-white/20 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-white/20 transition-colors w-64"
        />
      </div>

      <div className="bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-white/30 text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-white/5 flex items-center justify-center rounded-sm flex-shrink-0">
                        <span className="text-white/60 text-[10px] font-bold">{user.name[0]}</span>
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/40 text-xs">{user.email}</td>
                  <td className="px-5 py-4 text-white font-semibold">{user.orders}</td>
                  <td className="px-5 py-4 text-white font-semibold">
                    {user.totalNum > 0 ? '$' + user.totalNum.toLocaleString('en-US', { maximumFractionDigits: 0 }) : user.total}
                  </td>
                  <td className="px-5 py-4 text-white/30 text-xs">{user.joined}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      user.active ? 'text-green-400 bg-green-400/10' : 'text-white/30 bg-white/5'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(user)}
                      className={`text-xs transition-colors ${
                        user.active ? 'text-white/30 hover:text-red-400' : 'text-white/30 hover:text-green-400'
                      }`}
                    >
                      {user.active ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-white/20 py-10 text-sm">No users found</p>
        )}
      </div>
    </div>
  )
}
