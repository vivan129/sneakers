import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { categories } from '../data/products'

export default function Categories() {
  return (
    <section className="dark-surface bg-[#080808] py-20 md:py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="tag mb-3">Browse By Style</p>
          <h2 className="section-title text-white">Categories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to="/products"
              className="group relative overflow-hidden aspect-[3/4] block"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-50 group-hover:brightness-60"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                  <p className="text-white/50 text-xs font-medium">{cat.count} styles</p>
                </div>
                <div className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-200">
                  <ArrowUpRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
