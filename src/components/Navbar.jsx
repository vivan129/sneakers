import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, LogOut, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'
import { apiUrl } from '../lib/api'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Collections', to: '/products' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { count } = useCart()
  const isHome = location.pathname === '/'

  const handleLogout = () => { logout(); navigate('/') }
  const headerSolid = scrolled || !isHome || menuOpen

  const suggestions = products
    .filter((p) => {
      const q = searchTerm.trim().toLowerCase()
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
    .slice(0, 6)

  const selectSuggestion = (p) => {
    setSearchTerm('')
    setSearchOpen(false)
    setActiveIndex(-1)
    navigate(`/products/${p.id}`)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    fetch(apiUrl('/api/products')).then((r) => r.json()).then(setProducts).catch(() => setProducts([]))
  }, [])

  if (location.pathname.startsWith('/admin')) return null

  return (
    <>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${headerSolid ? 'bg-black/95 backdrop-blur-sm border-b border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]' : 'bg-transparent dark-surface dark-surface--transparent'}`}>
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          {/* Brand text only */}
          <Link to="/" className="group leading-none">
            <span className="block text-white font-black text-2xl tracking-tight group-hover:text-accent transition-colors">
              NO LOGO JUST VIBE
            </span>
            <p className="text-[10px] md:text-xs text-white/50 mt-1 transition-colors group-hover:text-white/70">
              You don&apos;t wear a product. You wear a legacy
            </p>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <li key={link.label}>
                <Link to={link.to} className={`text-sm font-medium tracking-wide transition-colors hover:text-white ${location.pathname === link.to ? 'text-white' : 'text-white/50'}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop search */}
          <div className="hidden lg:block relative w-72 xl:w-80">
            <div className="relative">
              <Search
                size={14}
                className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  headerSolid ? 'text-black/45' : 'text-white/50'
                }`}
              />
              <input
                type="text"
                value={searchTerm}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 120)}
                onChange={(e) => { setSearchTerm(e.target.value); setSearchOpen(true); setActiveIndex(-1) }}
                onKeyDown={(e) => {
                  if (!suggestions.length) return
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setActiveIndex((i) => (i + 1) % suggestions.length)
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
                  }
                  if (e.key === 'Enter' && activeIndex >= 0) {
                    e.preventDefault()
                    selectSuggestion(suggestions[activeIndex])
                  }
                }}
                placeholder="Search sneakers..."
                className={`w-full py-2 pl-9 pr-3 text-sm outline-none transition-colors ${
                  headerSolid
                    ? 'bg-[#f7f4ec] border border-black/15 text-black placeholder-black/35 focus:border-black/35'
                    : 'bg-[#0f0f0f] border border-white/10 text-white/90 placeholder-white/40 focus:border-white/30'
                }`}
              />
            </div>

            {searchOpen && (
              <div
                className={`absolute top-full mt-2 w-full z-50 overflow-hidden ${
                  headerSolid
                    ? 'bg-[#fffdf8] border border-black/15 shadow-[0_16px_30px_rgba(0,0,0,0.12)]'
                    : 'dark-surface bg-[#0f0f0f] border border-white/10 shadow-[0_16px_30px_rgba(0,0,0,0.35)]'
                }`}
              >
                {suggestions.length === 0 ? (
                  <p className={`px-3 py-3 text-xs ${headerSolid ? 'text-black/45' : 'text-white/40'}`}>No matching products</p>
                ) : (
                  suggestions.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={() => selectSuggestion(p)}
                      className={`w-full text-left px-3 py-2.5 last:border-b-0 transition-colors ${
                        headerSolid ? 'border-b border-black/10' : 'border-b border-white/5'
                      } ${
                        idx === activeIndex
                          ? (headerSolid ? 'bg-black/5' : 'bg-white/10')
                          : (headerSolid ? 'hover:bg-black/5' : 'hover:bg-white/5')
                      }`}
                    >
                      <p className={`text-sm font-semibold ${headerSolid ? 'text-black' : 'text-white'}`}>{p.name}</p>
                      <p className={`text-[11px] ${headerSolid ? 'text-black/45' : 'text-white/40'}`}>{p.brand} · {p.category}</p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/profile" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="text-white/30 hover:text-white transition-colors" title="Sign out">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-white/50 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
                <Link to="/signup" className="text-xs font-semibold uppercase tracking-wide border border-white/20 text-white/70 hover:text-white hover:border-white/50 px-4 py-2 transition-colors">Sign Up</Link>
              </div>
            )}

            {/* Profile icon (shown only when NOT logged in, since logged-in users already see their name) */}
            {!user && (
              <Link to="/login" className="hidden md:flex text-white/25 hover:text-white/60 transition-colors" title="Sign in">
                <User size={15} />
              </Link>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative text-white/70 hover:text-white transition-colors">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button className="md:hidden text-white/70 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`md:hidden bg-black/98 border-t border-white/5 transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-6 pt-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sneakers..."
                className="w-full bg-[#0f0f0f] border border-white/10 text-white/90 placeholder-white/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
            {searchTerm.trim() && (
              <div className="mt-2 border border-white/10 bg-[#0f0f0f]">
                {suggestions.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectSuggestion(p)}
                    className="w-full text-left px-3 py-2 border-b border-white/5 last:border-b-0"
                  >
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-[11px] text-white/40">{p.brand}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <ul className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <li key={link.label}>
                <Link to={link.to} className="text-white/70 hover:text-white text-base font-medium transition-colors block py-1">{link.label}</Link>
              </li>
            ))}
            {user ? (
              <>
                <li><Link to="/profile" className="text-white/70 hover:text-white text-base font-medium transition-colors block py-1">My Profile</Link></li>
                <li><button onClick={handleLogout} className="text-white/50 hover:text-white text-base font-medium transition-colors block py-1 text-left">Sign Out</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-white/70 hover:text-white text-base font-medium block py-1">Sign In</Link></li>
                <li><Link to="/signup" className="text-accent font-semibold text-base block py-1">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </header>
    </>
  )
}
