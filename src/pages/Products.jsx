import { useState, useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { apiUrl } from '../lib/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [activeBrand, setActiveBrand] = useState('All')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    fetch(apiUrl('/api/products')).then(r => r.json()).then(setProducts)
  }, [])

  const brandOptions = ['All', ...Array.from(new Set(products.map(p => p.brand))).sort()]
  const categoryOptions = ['All', ...Array.from(new Set(products.map(p => p.category))).sort()]

  const filtered = products
    .filter(p => activeBrand === 'All' || p.brand === activeBrand)
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="dark-surface pt-28 pb-10 border-b border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-white font-black text-4xl md:text-5xl tracking-tight mb-2">All Products</h1>
          <p className="text-white/40 text-sm">{filtered.length} styles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-10">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <SlidersHorizontal size={14} className="text-white/40" />
            <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {brandOptions.map(b => (
              <button key={b} onClick={() => setActiveBrand(b)}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors border ${activeBrand === b ? 'bg-white text-black border-white' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}>
                {b}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors border ${activeCategory === c ? 'bg-accent text-white border-accent' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-transparent border border-white/10 text-white/60 text-xs font-medium px-3 py-1.5 outline-none cursor-pointer hover:border-white/30 transition-colors">
              <option value="default" className="bg-black">Sort: Featured</option>
              <option value="price-asc" className="bg-black">Price: Low to High</option>
              <option value="price-desc" className="bg-black">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="dark-surface grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/30 text-lg mb-4">No products found</p>
            <button onClick={() => { setActiveBrand('All'); setActiveCategory('All') }} className="btn-outline text-sm">
              <X size={14} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
