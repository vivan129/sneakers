import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { apiUrl } from '../lib/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const next = new URLSearchParams(location.search).get('next') || ''
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      login(data)
      navigate(next ? `/${next.replace(/^\//, '')}` : '/')
    } catch {
      setError('Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark-surface min-h-screen bg-black">
      <Navbar />
      <div className="px-6 py-12 pt-28 flex items-center justify-center">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 border border-white/10 bg-[#0e0e0e] overflow-hidden">
        <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10">
          <Link to="/" className="inline-block mb-8">
            <span className="text-white font-black text-lg tracking-tight">NO LOGO JUST VIBE</span>
          </Link>
          <h1 className="text-white font-black text-3xl leading-tight mb-3">Welcome Back</h1>
          <p className="text-white/50 text-sm mb-8">Sign in to manage your orders, wishlist, and profile.</p>
          <div className="space-y-4 text-sm">
            <p className="text-white/70">• Faster checkout with saved details</p>
            <p className="text-white/70">• Track all your orders in one place</p>
            <p className="text-white/70">• Get early access to new drops</p>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <h2 className="text-white font-black text-2xl mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>
            )}
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-black border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-2">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-black border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-white/30 text-sm mt-6">
            No account?{' '}
            <Link to="/signup" className="text-accent hover:underline">Create one</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
