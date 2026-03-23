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
  const [coinTilt, setCoinTilt] = useState({ x: 0, y: 0 })

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
          videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
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

      {/* ── CONTENT ── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          className="coin-wrap pointer-events-auto"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const px = (e.clientX - rect.left) / rect.width - 0.5
            const py = (e.clientY - rect.top) / rect.height - 0.5
            setCoinTilt({ x: py * -16, y: px * 16 })
          }}
          onMouseLeave={() => setCoinTilt({ x: 0, y: 0 })}
          style={{ '--coin-tilt-x': `${coinTilt.x}deg`, '--coin-tilt-y': `${coinTilt.y}deg` }}
        >
          <div className="coin">
            <div className="coin-face coin-front">
              <span>NO LOGO</span>
            </div>
            <div className="coin-face coin-back">
              <span>NO LOGO JUST VIBES</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 w-full max-w-7xl px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up-delay3 justify-center">
            <Link to="/products" className="btn-primary w-full sm:w-auto justify-center px-7 py-3.5">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="btn-outline w-full sm:w-auto justify-center px-7 py-3.5 border-white/50 bg-black/20 backdrop-blur-sm hover:bg-black/35">
              View Collection
            </Link>
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
