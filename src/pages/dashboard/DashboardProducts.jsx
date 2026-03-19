import { useState, useEffect, useRef } from 'react'
import { Plus, Search, Edit2, Trash2, X, Upload, ImageIcon } from 'lucide-react'
import { apiUrl } from '../../lib/api'

const BRANDS = ['Nike', 'Adidas', 'Jordan', 'Converse', 'New Balance', 'Puma', 'Reebok', 'NO LOGO']
const SHOE_CATEGORIES = ['Running', 'Lifestyle', 'Basketball', 'Skateboarding']
const APPAREL_CATEGORIES = ['Tops', 'Hoodies', 'Bottoms', 'Outerwear']
const BADGES = ['', 'New', 'Hot', 'Sale', 'Limited', 'Classic', 'Exclusive']
const SHOE_SIZES = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13]
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const emptyForm = {
  productType: 'shoes',
  name: '', brand: 'Nike', price: '', originalPrice: '',
  description: '',
  image: '', category: 'Running', badge: '', sizes: [], inStock: true,
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product ? { ...emptyForm, ...product } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const categories = form.productType === 'apparel' ? APPAREL_CATEGORIES : SHOE_CATEGORIES
  const sizeOptions = form.productType === 'apparel' ? APPAREL_SIZES : SHOE_SIZES

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const data = new FormData()
      data.append('image', file)
      const res = await fetch(apiUrl('/api/upload'), { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Upload failed'); return }
      setForm(f => ({ ...f, image: json.url }))
    } catch {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size].sort((a, b) => a - b),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.image.trim() || !form.price || !form.description.trim()) {
      setError('Name, description, image, and price are required')
      return
    }
    setSaving(true)
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        badge: form.badge || null,
      }
      const url = product ? apiUrl(`/api/products/${product.id}`) : apiUrl('/api/products')
      const method = product ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); return }
      onSave(data)
      onClose()
    } catch {
      setError('Could not connect to server')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-bold text-sm uppercase tracking-wide">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Product Name</label>
              <input
                type="text" required value={form.name} onChange={set('name')}
                className="w-full bg-black border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="Air Phantom X"
              />
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Type</label>
              <select value={form.productType} onChange={(e) => {
                const nextType = e.target.value
                const nextCategory = nextType === 'apparel' ? APPAREL_CATEGORIES[0] : SHOE_CATEGORIES[0]
                setForm((f) => ({ ...f, productType: nextType, category: nextCategory, sizes: [] }))
              }}
                className="w-full bg-black border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-white/30 transition-colors cursor-pointer">
                <option value="shoes" className="bg-black">Shoes</option>
                <option value="apparel" className="bg-black">Apparel</option>
              </select>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Brand</label>
              <select value={form.brand} onChange={set('brand')}
                className="w-full bg-black border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-white/30 transition-colors cursor-pointer">
                {BRANDS.map(b => <option key={b} value={b} className="bg-black">{b}</option>)}
              </select>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Category</label>
              <select value={form.category} onChange={set('category')}
                className="w-full bg-black border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-white/30 transition-colors cursor-pointer">
                {categories.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Price ($)</label>
              <input
                type="number" min="0" step="0.01" required value={form.price} onChange={set('price')}
                className="w-full bg-black border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="189"
              />
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Original Price ($)</label>
              <input
                type="number" min="0" step="0.01" value={form.originalPrice} onChange={set('originalPrice')}
                className="w-full bg-black border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="Optional"
              />
            </div>

            <div className="col-span-2">
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Description</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={set('description')}
                className="w-full bg-black border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-white/30 transition-colors resize-none"
                placeholder="Write a short product description..."
              />
            </div>

            <div className="col-span-2">
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Product Image</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
              {form.image ? (
                <div className="relative group w-full h-36 bg-black border border-white/10 overflow-hidden">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, image: '' })); fileRef.current.value = '' }}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold"
                  >
                    <X size={14} /> Change Image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  disabled={uploading}
                  className="w-full h-36 bg-black border border-dashed border-white/20 hover:border-white/40 transition-colors flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 disabled:opacity-50"
                >
                  {uploading ? (
                    <><div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /><span className="text-xs">Uploading…</span></>
                  ) : (
                    <><Upload size={20} /><span className="text-xs font-medium">Click to upload image</span><span className="text-[10px]">PNG, JPG, WEBP up to 5MB</span></>
                  )}
                </button>
              )}
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wide block mb-1.5">Badge</label>
              <select value={form.badge} onChange={set('badge')}
                className="w-full bg-black border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-white/30 transition-colors cursor-pointer">
                {BADGES.map(b => <option key={b} value={b} className="bg-black">{b || 'None'}</option>)}
              </select>
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.inStock ? 'bg-green-500' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.inStock ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-white/50 text-sm">In Stock</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-white/40 text-xs uppercase tracking-wide block mb-2">
              Sizes ({form.productType === 'apparel' ? 'XS-XXL' : 'US'})
            </label>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`w-10 h-9 text-xs font-semibold border transition-colors ${
                    form.sizes.includes(size)
                      ? 'bg-accent border-accent text-white'
                      : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-white/10 text-white/50 hover:text-white py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-50">
              {saving ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DashboardProducts() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | product object (edit)

  useEffect(() => {
    fetch(apiUrl('/api/products')).then(r => r.json()).then(setProducts)
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (saved) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === saved.id)
      return exists ? prev.map(p => p.id === saved.id ? saved : p) : [saved, ...prev]
    })
  }

  const toggleStock = async (product) => {
    const updated = await fetch(apiUrl(`/api/products/${product.id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, inStock: !product.inStock }),
    }).then(r => r.json())
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await fetch(apiUrl(`/api/products/${id}`), { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      {modal !== null && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl mb-1">Products</h1>
          <p className="text-white/30 text-sm">{products.length} total products</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary text-xs py-2.5 px-5">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-white/5 text-white placeholder-white/20 pl-10 pr-4 py-3 text-sm outline-none focus:border-white/20 transition-colors max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Type', 'Brand', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-white/30 text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover bg-[#1a1a1a] flex-shrink-0" />
                      <span className="text-white font-medium truncate max-w-[160px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-white/50 capitalize">{product.productType ?? 'shoes'}</td>
                  <td className="px-5 py-3.5 text-white/50">{product.brand}</td>
                  <td className="px-5 py-3.5 text-white/50">{product.category}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">${product.price}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleStock(product)}
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide cursor-pointer transition-colors ${
                        product.inStock
                          ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20'
                          : 'text-red-400 bg-red-400/10 hover:bg-red-400/20'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal(product)}
                        className="text-white/30 hover:text-white transition-colors p-1"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-white/30 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-white/20 py-10 text-sm">No products found</p>
        )}
      </div>
    </div>
  )
}
