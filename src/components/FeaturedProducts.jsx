import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { apiUrl } from '../lib/api'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(apiUrl('/api/products')).then(r => r.json()).then(data => setProducts(data.slice(0, 8)))
  }, [])

  return (
    <section id="featured" className="dark-surface bg-black py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="tag mb-3">Curated Picks</p>
            <h2 className="section-title text-white">Featured Drops</h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors group">
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link to="/products" className="btn-outline">View All Products <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  )
}
