import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube } from 'lucide-react'

const links = {
  Shop: ['New Arrivals', 'Running', 'Lifestyle', 'Basketball', 'Sale'],
  Info: ['About Us', 'Sizing Guide', 'Authenticity', 'Sustainability'],
  Support: ['FAQ', 'Shipping & Returns', 'Track Order', 'Contact'],
}

export default function Footer() {
  return (
    <footer className="dark-surface bg-[#080808] border-t border-white/5 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="mb-5 inline-block">
              <span className="text-white font-black text-lg tracking-tight">NO LOGO JUST VIBE</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Premium sneakers, authenticity guaranteed. Handpicked drops for the culture.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      to="/products"
                      className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © 2026 NO LOGO JUST VIBE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white/25 hover:text-white/60 text-xs transition-colors">Privacy</Link>
            <Link to="/" className="text-white/25 hover:text-white/60 text-xs transition-colors">Terms</Link>
            <Link to="/admin" className="text-white/25 hover:text-white/60 text-xs transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
