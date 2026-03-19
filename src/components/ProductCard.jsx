import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Heart, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const badgeColors = {
  New: 'bg-accent text-white',
  Hot: 'bg-white text-black',
  Limited: 'bg-purple-500 text-white',
  Exclusive: 'bg-yellow-500 text-black',
  Sale: 'bg-green-500 text-white',
  Classic: 'bg-gray-600 text-white',
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [wishlist, setWishlist] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  const [added, setAdded] = useState(false)
  const ref = useRef(null)

  // Close size picker on outside click
  useEffect(() => {
    if (!showSizes) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowSizes(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showSizes])

  const handleBagClick = (e) => {
    e.preventDefault()
    if (!product.inStock) return
    if (product.sizes.length === 0) {
      addItem(product, null)
      flashAdded()
      return
    }
    setShowSizes(true)
  }

  const handleSelectSize = (size) => {
    addItem(product, size)
    setShowSizes(false)
    flashAdded()
  }

  const flashAdded = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div ref={ref} className="relative">
      <Link to={`/products/${product.id}`} className="group block bg-[#0f0f0f] overflow-hidden card-hover">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Add to cart */}
          <button
            onClick={handleBagClick}
            className={`absolute bottom-0 left-0 right-0 py-3 font-semibold text-sm tracking-wide uppercase transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white translate-y-0'
                : 'bg-accent text-white translate-y-full group-hover:translate-y-0'
            }`}
          >
            {added ? '✓ Added to Bag' : (
              <span className="flex items-center justify-center gap-2">
                <ShoppingBag size={15} /> Add to Bag
              </span>
            )}
          </button>

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${badgeColors[product.badge] ?? 'bg-white text-black'}`}>
              {product.badge}
            </span>
          )}

          {/* Out of stock */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase border border-white/20 px-3 py-1.5">Sold Out</span>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlist(!wishlist) }}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60"
          >
            <Heart size={15} className={wishlist ? 'fill-red-500 text-red-500' : 'text-white'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-white/40 text-xs font-medium mb-1">{product.brand}</p>
          <h3 className="text-white font-semibold text-sm mb-2 truncate">{product.name}</h3>
          {product.description && (
            <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-2">{product.description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">${product.price}</span>
            {product.originalPrice && <span className="text-white/30 text-sm line-through">${product.originalPrice}</span>}
          </div>
        </div>
      </Link>

      {/* Size picker popup */}
      {showSizes && (
        <div className="absolute bottom-full left-0 right-0 z-20 bg-[#111] border border-white/10 p-3 mb-1 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">Select Size</span>
            <button onClick={() => setShowSizes(false)} className="text-white/30 hover:text-white transition-colors"><X size={12} /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => handleSelectSize(size)}
                className="px-2 py-1 text-xs border border-white/20 text-white/70 hover:border-accent hover:text-white hover:bg-accent/10 transition-colors font-medium"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
