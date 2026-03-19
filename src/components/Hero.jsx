import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'

/*
  VIDEO SETUP:
  Place your hero video at /public/hero.mp4
  Recommended: 1920x1080, compressed to <15MB, dark/moody footage of sneakers or urban running.
  Free options: pexels.com → search "sneakers", "running", "urban"
*/

export default function Hero() {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onLoaded = async () => {
      setVideoLoaded(true)
      try {
        await v.play()
      } catch {
        setVideoError(true)
      }
    }
    const onError = () => setVideoError(true)
    v.addEventListener('loadeddata', onLoaded)
    v.addEventListener('error', onError)
    // Attempt autoplay on mount for stricter browser policies.
    v.play().catch(() => {})
    return () => {
      v.removeEventListener('loadeddata', onLoaded)
      v.removeEventListener('error', onError)
    }
  }, [])

  return (
    <section className="dark-surface relative w-full h-screen min-h-[680px] flex items-center justify-center overflow-hidden bg-black">

      {/* ── VIDEO BACKGROUND ── */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded && !videoError ? 'opacity-60' : 'opacity-0'
        }`}
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        disablePictureInPicture
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* ── FALLBACK BACKGROUND (shown when no video) ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 60% 50%, #1a0a00 0%, #0d0d0d 40%, #000 100%)',
        }}
      />

      {/* Decorative ring — back layer */}
      <div
        className="absolute animate-pulse2 pointer-events-none"
        style={{
          right: '8%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(280px, 40vw, 560px)',
          height: 'clamp(280px, 40vw, 560px)',
          borderRadius: '50%',
          border: '1.5px solid rgba(255,77,0,0.12)',
          boxShadow: '0 0 80px rgba(255,77,0,0.06) inset',
        }}
      />
      <div
        className="absolute animate-pulse2 pointer-events-none"
        style={{
          right: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(200px, 28vw, 400px)',
          height: 'clamp(200px, 28vw, 400px)',
          borderRadius: '50%',
          border: '1px solid rgba(255,77,0,0.07)',
          animationDelay: '2s',
        }}
      />

      {/* ── GRADIENT OVERLAY ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* ── CONTENT ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.22em] mb-4 animate-fade-up">
            Welcome to NO LOGO JUST VIBE
          </p>

          {/* Tag */}
          <p className="tag animate-fade-up mb-5 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-accent" />
            New Season 2026
          </p>

          {/* Headline */}
          <h1 className="font-black leading-[0.92] tracking-tight mb-6 animate-fade-up-delay">
            <span
              className="block text-white"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)' }}
            >
              RUN THE
            </span>
            <span
              className="block text-[#e8e8e8]"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)' }}
            >
              STREETS.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-md mb-10 animate-fade-up-delay2">
            The finest kicks, handpicked for those who move with purpose.
            Limited drops. Authentic pairs. Always fresh.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-fade-up-delay3">
            <Link to="/products" className="btn-primary">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="btn-outline">
              View Collection
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-12 animate-fade-up-delay3">
            {[
              { value: '500+', label: 'Styles' },
              { value: '100%', label: 'Authentic' },
              { value: 'Free', label: 'Returns' },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col">
                <span className="text-white font-bold text-sm">{badge.value}</span>
                <span className="text-white/40 text-xs font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <a
        href="#featured"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors z-10"
      >
        <span className="text-[10px] tracking-widest uppercase font-medium">Scroll</span>
        <ChevronDown size={16} className="animate-scroll-bounce" />
      </a>
    </section>
  )
}
