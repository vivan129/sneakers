import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { apiUrl } from '../lib/api'

export default function Checkout() {
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name ?? '', address: '', city: '', zip: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) return <Navigate to="/login?next=checkout" replace />

  if (items.length === 0) return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <ShoppingBag size={48} className="text-white/10 mx-auto mb-6" />
        <p className="text-white/40 text-lg mb-6">Your bag is empty</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    </div>
  )

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          customer: user.name,
          items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty, size: i.size })),
          amountNum: total,
          shipping: form,
        }),
      })
      const order = await res.json()
      if (!res.ok) { setError(order.error || 'Something went wrong'); return }
      clearCart()
      navigate(`/order-success?orderId=${encodeURIComponent(order.id)}`)
    } catch {
      setError('Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  const shipping = 12
  const tax = Math.round(total * 0.08)

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-white font-black text-3xl mb-10">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Order summary */}
          <div className="md:col-span-2 order-2 md:order-1">
            <div className="bg-[#0f0f0f] border border-white/5 p-6 sticky top-8">
              <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-5">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover bg-[#1a1a1a]" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-white text-[9px] font-bold flex items-center justify-center rounded-full">{item.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                      <p className="text-white/30 text-[10px]">{item.brand}{item.size ? ` · Size ${item.size}` : ''}</p>
                      <p className="text-white text-xs font-bold mt-1">${(item.price * item.qty).toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-white/40">
                  <span>Subtotal</span><span>${total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>Shipping</span><span>${shipping}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>Tax (8%)</span><span>${tax}</span>
                </div>
                <div className="flex justify-between text-white font-black text-base pt-2 border-t border-white/5">
                  <span>Total</span><span>${total + shipping + tax}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping form */}
          <form onSubmit={handlePlaceOrder} className="md:col-span-3 order-1 md:order-2 space-y-6">
            <div>
              <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-5">Shipping Information</h2>
              {error && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-4 py-3 mb-4">{error}</p>}

              <div className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Full Name</label>
                  <input type="text" required value={form.name} onChange={set('name')}
                    className="w-full bg-[#0f0f0f] border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Street Address</label>
                  <input type="text" required value={form.address} onChange={set('address')}
                    placeholder="123 Main St"
                    className="w-full bg-[#0f0f0f] border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors placeholder-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">City</label>
                    <input type="text" required value={form.city} onChange={set('city')}
                      className="w-full bg-[#0f0f0f] border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">ZIP Code</label>
                    <input type="text" required value={form.zip} onChange={set('zip')}
                      className="w-full bg-[#0f0f0f] border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment placeholder */}
            <div>
              <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-5">Payment</h2>
              <div className="bg-[#0f0f0f] border border-white/10 p-4 rounded-sm">
                <p className="text-white/30 text-xs text-center">💳 Payment gateway integration pending</p>
                <p className="text-white/20 text-[10px] text-center mt-1">Orders will process in demo mode</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-4 text-base disabled:opacity-50"
            >
              {loading ? 'Placing Order…' : `Place Order · $${total + shipping + tax}`}
            </button>

            <p className="text-white/20 text-xs text-center">
              By placing your order you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
