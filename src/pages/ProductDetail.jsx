import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Heart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { apiUrl } from '../lib/api'

const badgeColors = {
  New: 'bg-accent text-white', Hot: 'bg-white text-black', Limited: 'bg-purple-500 text-white',
  Exclusive: 'bg-yellow-500 text-black', Sale: 'bg-green-500 text-white', Classic: 'bg-gray-600 text-white',
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const needsSizeSelection = product?.sizes?.length > 0

  useEffect(() => {
    setLoading(true)
    setSelectedSize(null)
    Promise.all([
      fetch(apiUrl(`/api/products/${id}`)).then(r => r.ok ? r.json() : null),
      fetch(apiUrl('/api/products')).then(r => r.json()),
    ]).then(([prod, all]) => {
      setProduct(prod)
      if (prod) setRelated(all.filter(p => p.category === prod.category && p.id !== prod.id).slice(0, 4))
      setLoading(false)
    })
  }, [id])

  const handleAddToCart = () => {
    if (!product.inStock || (needsSizeSelection && !selectedSize)) return
    addItem(product, needsSizeSelection ? selectedSize : null)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (loading) return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-[#111]" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-[#111] w-24" />
            <div className="h-8 bg-[#111] w-3/4" />
            <div className="h-6 bg-[#111] w-20" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <p className="text-white/40 text-lg mb-6">Product not found</p>
        <Link to="/products" className="btn-outline">Back to Products</Link>
      </div>
    </div>
  )

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/30 text-xs mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-square bg-[#0f0f0f] overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <span className={`absolute top-4 left-4 px-2.5 py-1 text-xs font-bold tracking-widest uppercase ${badgeColors[product.badge] ?? 'bg-white text-black'}`}>
                {product.badge}
              </span>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white/70 text-sm font-semibold tracking-widest uppercase border border-white/20 px-4 py-2">Sold Out</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-white/40 text-sm font-medium mb-2">{product.brand}</p>
            <h1 className="text-white font-black text-3xl lg:text-4xl tracking-tight mb-4">{product.name}</h1>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-6">{product.category}</p>
            {product.description && (
              <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-xl">{product.description}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-white font-black text-3xl">${product.price}</span>
              {product.originalPrice && (
                <span className="text-white/30 text-xl line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="text-green-400 text-sm font-semibold">
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Size selector */}
            {product.inStock && needsSizeSelection && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-xs uppercase tracking-wide font-semibold">
                    {product.productType === 'apparel' ? 'Select Size' : 'Select Size (US)'}
                  </span>
                  {!selectedSize && <span className="text-accent text-xs">Please select a size</span>}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-semibold border transition-all duration-150 ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'border-white/15 text-white/60 hover:border-white/50 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || (needsSizeSelection && !selectedSize)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold text-sm uppercase tracking-wide transition-all duration-200 ${
                  added
                    ? 'bg-green-500 text-white'
                    : product.inStock && (!needsSizeSelection || selectedSize)
                    ? 'bg-accent text-white hover:bg-accent-hover active:scale-95'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={16} />
                {added ? 'Added to Bag!' : !product.inStock ? 'Sold Out' : !selectedSize && needsSizeSelection ? 'Select a Size' : 'Add to Bag'}
              </button>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`w-14 border transition-colors ${wishlist ? 'border-red-400 text-red-400' : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white'}`}
              >
                <Heart size={18} className={wishlist ? 'fill-red-400 mx-auto' : 'mx-auto'} />
              </button>
            </div>

            {/* Details */}
            <div className="border-t border-white/5 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Brand</span>
                <span className="text-white font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Category</span>
                <span className="text-white font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Availability</span>
                <span className={product.inStock ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                  {product.inStock ? 'In Stock' : 'Sold Out'}
                </span>
              </div>
              {needsSizeSelection && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Available Sizes</span>
                  <span className="text-white font-medium">{product.sizes.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-white font-black text-2xl mb-8">More in {product.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
