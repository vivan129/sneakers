import { useState } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="bg-accent py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-4">
          Stay In The Loop
        </p>
        <h2 className="text-white font-black text-3xl md:text-5xl tracking-tight mb-4">
          Get Early Access to Drops
        </h2>
        <p className="text-white/70 text-base md:text-lg mb-10 max-w-md mx-auto">
          Subscribe for exclusive releases, restocks, and first access to limited editions.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-3 bg-white/20 text-white px-6 py-4 font-semibold">
            <CheckCircle size={20} />
            You're on the list! We'll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-3.5 text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="newsletter-go px-6 py-3.5 font-semibold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              GO <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
