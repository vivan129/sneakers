import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { apiUrl } from '../lib/api'

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const next = new URLSearchParams(location.search).get('next') || ''
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch(apiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      login(data)
      navigate(next ? `/${next}` : '/')
    } catch {
      setError('Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="dark-surface min-h-screen bg-black">
      <Navbar />
      <div className="px-6 py-12 pt-28 flex items-center justify-center">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 border border-white/10 bg-[#0e0e0e] overflow-hidden">
        <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10">
          <Link to="/" className="inline-block mb-8">
            <span className="text-white font-black text-lg tracking-tight">NO LOGO JUST VIBE</span>
          </Link>
          <h1 className="text-white font-black text-3xl leading-tight mb-3">Create Your Account</h1>
          <p className="text-white/50 text-sm mb-8">Get access to faster checkout and exclusive product drops.</p>
          <div className="space-y-4 text-sm">
            <p className="text-white/70">• Save your profile and shipping data</p>
            <p className="text-white/70">• Manage orders and account status</p>
            <p className="text-white/70">• Discover shoes and apparel collections</p>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <h2 className="text-white font-black text-2xl mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>
            )}
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-2">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={set('name')}
                className="w-full bg-black border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="Alex Rivera"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
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
                onChange={set('password')}
                className="w-full bg-black border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide block mb-2">Confirm Password</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={set('confirm')}
                className="w-full bg-black border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="text-white/30 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">Sign in</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
