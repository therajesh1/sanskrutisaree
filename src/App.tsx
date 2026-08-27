import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'

type Page = 'home' | 'collection' | 'pdp' | 'cart' | 'checkout' | 'about' | 'contact'
type CartItem = { id: number; name: string; price: number; qty: number; img: string; fabric: string }

const PRODUCTS = [
  { id: 1, name: 'Aarohi Silk Saree', fabric: 'Pure Silk', price: 12500, img: 'https://images.unsplash.com/photo-1572470176170-98fa8abcb741?w=600&h=750&fit=crop&auto=format', tag: 'New' },
  { id: 2, name: 'Meher Banarasi Saree', fabric: 'Banarasi Silk', price: 18900, img: 'https://images.unsplash.com/photo-1761125135357-99cbe52a6271?w=600&h=750&fit=crop&auto=format', tag: 'Bestseller' },
  { id: 3, name: 'Aarna Georgette Saree', fabric: 'Georgette', price: 8900, img: 'https://images.unsplash.com/photo-1693023656257-87c142566ad3?w=600&h=750&fit=crop&auto=format', tag: 'New' },
  { id: 4, name: 'Riva Designer Saree', fabric: 'Designer Collection', price: 14500, img: 'https://images.unsplash.com/photo-1660669996485-f4713e9c8f01?w=600&h=750&fit=crop&auto=format', tag: '' },
  { id: 5, name: 'Kavya Chanderi Saree', fabric: 'Chanderi Silk', price: 9800, img: 'https://images.unsplash.com/photo-1730208551087-9248386a8f26?w=600&h=750&fit=crop&auto=format', tag: '' },
  { id: 6, name: 'Noor Organza Saree', fabric: 'Pure Organza', price: 16200, img: 'https://images.unsplash.com/photo-1517424401253-3db93d0d6c93?w=600&h=750&fit=crop&auto=format', tag: 'Limited' },
  { id: 7, name: 'Zara Kanjivaram Saree', fabric: 'Kanjivaram Silk', price: 22000, img: 'https://images.unsplash.com/photo-1664636124899-4a121f1ce449?w=600&h=750&fit=crop&auto=format', tag: 'New' },
  { id: 8, name: 'Tara Tissue Saree', fabric: 'Tissue Silk', price: 11500, img: 'https://images.unsplash.com/photo-1664636125274-743c470f62e6?w=600&h=750&fit=crop&auto=format', tag: '' },
]

const CATEGORIES = [
  { name: 'Silk Sarees', img: 'https://images.unsplash.com/photo-1761125135357-99cbe52a6271?w=600&h=800&fit=crop&auto=format' },
  { name: 'Designer Sarees', img: 'https://images.unsplash.com/photo-1660669996485-f4713e9c8f01?w=600&h=800&fit=crop&auto=format' },
  { name: 'Banarasi Sarees', img: 'https://images.unsplash.com/photo-1628973434123-3e956f203dd6?w=600&h=800&fit=crop&auto=format' },
  { name: 'Georgette Sarees', img: 'https://images.unsplash.com/photo-1693023656257-87c142566ad3?w=600&h=800&fit=crop&auto=format' },
  { name: 'Festive Sarees', img: 'https://images.unsplash.com/photo-1664636124899-4a121f1ce449?w=600&h=800&fit=crop&auto=format' },
  { name: 'Wedding Sarees', img: 'https://images.unsplash.com/photo-1756483510768-60fed6aaa44f?w=600&h=800&fit=crop&auto=format' },
]

const COLLECTIONS = [
  { name: 'Festive Edit', desc: 'Ceremonial grandeur for every celebration', img: 'https://images.unsplash.com/photo-1664636125274-743c470f62e6?w=700&h=900&fit=crop&auto=format' },
  { name: 'Wedding Edit', desc: 'Bridal magnificence, reimagined', img: 'https://images.unsplash.com/photo-1756483510768-60fed6aaa44f?w=700&h=900&fit=crop&auto=format' },
  { name: 'Contemporary Edit', desc: 'Modern drapes for the discerning woman', img: 'https://images.unsplash.com/photo-1716504628105-bd76d91e85f2?w=700&h=900&fit=crop&auto=format' },
  { name: 'Classic Silk Edit', desc: 'Timeless weaves, enduring elegance', img: 'https://images.unsplash.com/photo-1664636126154-7a6ce64edd21?w=700&h=900&fit=crop&auto=format' },
]

const INSTAGRAM = [
  'https://images.unsplash.com/photo-1716504628105-bd76d91e85f2?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1756483510768-60fed6aaa44f?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1664636124899-4a121f1ce449?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1664636126154-7a6ce64edd21?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1749804946005-e0db1140461b?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1664636125274-743c470f62e6?w=400&h=400&fit=crop&auto=format',
]

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

// Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#C0392B' : 'none'} stroke={filled ? '#C0392B' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const BagIcon = ({ count }: { count?: number }) => (
  <span className="relative">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
    {count != null && count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-charcoal text-ivory text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
        {count}
      </span>
    )}
  </span>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#A58B5B" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

// Sanskruti Logo — Devanagari wordmark with bindi + Latin subtitle
function SanskrutiLogo({ inverted = false, size = 'md' }: { inverted?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const gold = '#B8954A'
  const red = '#D92B2B'
  const sizes = { sm: { dev: '1.5rem', lat: '0.55rem', dot: 10, dotOffset: { top: -4, left: -4 } }, md: { dev: '2rem', lat: '0.65rem', dot: 13, dotOffset: { top: -5, left: -5 } }, lg: { dev: '2.8rem', lat: '0.8rem', dot: 16, dotOffset: { top: -6, left: -6 } } }
  const s = sizes[size]

  return (
    <div className="flex flex-col items-start leading-none select-none">
      <div className="relative inline-block">
        <span
          style={{
            position: 'absolute',
            top: s.dotOffset.top,
            left: s.dotOffset.left,
            width: s.dot,
            height: s.dot,
            borderRadius: '50%',
            background: red,
            display: 'block',
          }}
        />
        <span
          style={{
            fontFamily: "'Yatra One', serif",
            fontSize: s.dev,
            color: inverted ? '#F7F3ED' : gold,
            lineHeight: 1,
            display: 'block',
            paddingLeft: '0.5rem',
          }}
        >
          संस्कृती
        </span>
      </div>
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: s.lat,
          letterSpacing: '0.22em',
          color: inverted ? 'rgba(247,243,237,0.75)' : gold,
          textTransform: 'lowercase',
          marginTop: '0.2em',
          alignSelf: 'flex-end',
          paddingRight: '0.1em',
        }}
      >
        sanskruti
      </span>
    </div>
  )
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const ChevronUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
)

// Header
function Header({ page, setPage, cartCount, scrolled, mobileMenuOpen, setMobileMenuOpen }: {
  page: Page; setPage: (p: Page) => void; cartCount: number;
  scrolled: boolean; mobileMenuOpen: boolean; setMobileMenuOpen: (b: boolean) => void;
}) {
  const isHero = page === 'home' && !scrolled
  const textColor = isHero ? 'text-ivory' : 'text-charcoal'
  const bgClass = isHero ? 'bg-transparent' : 'bg-ivory border-b border-border'

  const nav = (p: Page) => { setPage(p); setMobileMenuOpen(false); window.scrollTo(0, 0) }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}
        style={{ height: '72px' }}
      >
        <div className="h-full mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Left nav — desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => nav('collection')} className={`nav-link ${textColor}`}>New Arrivals</button>
            <button onClick={() => nav('collection')} className={`nav-link ${textColor}`}>Sarees</button>
            <button onClick={() => nav('collection')} className={`nav-link ${textColor}`}>Collections</button>
            <button onClick={() => nav('collection')} className={`nav-link ${textColor}`}>Edit</button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden ${textColor}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </button>

          {/* Logo — center */}
          <button
            onClick={() => nav('home')}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ transform: 'translateX(-50%)' }}
          >
            <SanskrutiLogo inverted={isHero} size="sm" />
          </button>

          {/* Right icons */}
          <div className={`flex items-center gap-5 ${textColor}`}>
            <button className="hidden sm:flex hover:opacity-70 transition-opacity"><SearchIcon /></button>
            <button className="hidden sm:flex hover:opacity-70 transition-opacity"><UserIcon /></button>
            <button className="hidden sm:flex hover:opacity-70 transition-opacity"><HeartIcon /></button>
            <button className="hover:opacity-70 transition-opacity" onClick={() => nav('cart')}>
              <BagIcon count={cartCount} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-400 ${mobileMenuOpen ? 'visible' : 'invisible'}`}
      >
        <div
          className={`absolute inset-0 bg-charcoal/40 transition-opacity duration-400 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 bottom-0 w-80 bg-ivory flex flex-col transition-transform duration-400 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-border">
            <SanskrutiLogo size="sm" />
            <button onClick={() => setMobileMenuOpen(false)} className="text-charcoal"><CloseIcon /></button>
          </div>
          <nav className="flex flex-col p-8 gap-6">
            {[['New Arrivals', 'collection'], ['Sarees', 'collection'], ['Collections', 'collection'], ['About', 'about'], ['Contact', 'contact']].map(([label, p]) => (
              <button
                key={label}
                onClick={() => nav(p as Page)}
                className="text-left font-serif text-2xl text-charcoal hover:text-gold transition-colors font-medium"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-auto p-8 border-t border-border">
            <p className="text-warm-grey text-sm mb-1">Contact us</p>
            <p className="text-charcoal text-sm font-medium">9769831819</p>
          </div>
        </div>
      </div>
    </>
  )
}

// HomePage
function HomePage({ setPage, wishlist, toggleWishlist, addToCart }: {
  setPage: (p: Page) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  addToCart: (p: typeof PRODUCTS[0]) => void;
}) {
  const navigate = useNavigate()
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0) }

  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-beige">
        <img
          src="https://images.unsplash.com/photo-1739429942851-9083ee185d3d?w=1600&h=1000&fit=crop&auto=format"
          alt="Indian woman in premium saree"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        <div className="relative z-10 w-full px-8 lg:px-16 pb-20 lg:pb-24">
          <p className="section-label text-gold-light mb-5">The New Collection</p>
          <h1 className="hero-text text-ivory max-w-4xl mb-6">
            The Art of<br />
            <em>Timeless</em> Drape
          </h1>
          <p className="text-ivory/80 text-base lg:text-lg max-w-md mb-10 font-light leading-relaxed">
            Discover sarees where traditional craftsmanship meets contemporary elegance.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary" onClick={() => go('collection')}>Shop Sarees</button>
            <button className="btn-outline" onClick={() => go('collection')}>Explore Collection <ArrowRight /></button>
          </div>
        </div>
        {/* Hero scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/50 z-10">
          <div className="w-px h-12 bg-ivory/30 animate-pulse" />
        </div>
      </section>

      {/* Brand Intro */}
      <section className="grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative overflow-hidden bg-beige min-h-[400px] lg:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1572470176170-98fa8abcb741?w=900&h=700&fit=crop&auto=format"
            alt="Woman in elegant saree"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>
        <div className="flex items-center bg-ivory px-10 lg:px-20 py-20">
          <div className="max-w-lg">
            <p className="section-label mb-5">Our Ethos</p>
            <h2 className="display-text text-charcoal mb-6">
              Crafted for the<br /><em>Modern Woman</em>
            </h2>
            <p className="text-warm-grey text-base leading-relaxed mb-8 font-light">
              Sanskruti celebrates the timeless beauty of Indian drapes through thoughtfully curated sarees, refined craftsmanship and contemporary styling. Each piece is a testament to the artisans who weave stories into silk.
            </p>
            <button
              className="inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-widest uppercase hover:gap-4 transition-all duration-300"
              onClick={() => go('about')}
            >
              Discover Our Story <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="bg-ivory py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-4">Browse</p>
            <h2 className="display-text text-charcoal">Explore the Collection</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="category-card bg-beige"
                style={{ aspectRatio: '3/4' }}
                onClick={() => go('collection')}
              >
                <div className="relative overflow-hidden w-full h-full">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                  <div className="overlay" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-7 z-10">
                    <p className="text-ivory font-serif text-base lg:text-xl font-medium mb-1">{cat.name}</p>
                    <span className="arrow text-ivory/80 text-xs tracking-widest uppercase flex items-center gap-2 font-semibold">
                      Shop Now <ArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-beige/40 py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <p className="section-label mb-3">Just In</p>
              <h2 className="display-text text-charcoal">New Arrivals</h2>
              <p className="text-warm-grey text-sm mt-2 font-light">The latest expressions of timeless Indian craftsmanship.</p>
            </div>
            <button className="btn-outline-dark mt-6 lg:mt-0 self-start lg:self-auto" onClick={() => go('collection')}>
              View All <ArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlisted={wishlist.includes(product.id)}
                onWishlist={() => toggleWishlist(product.id)}
                onAddToCart={() => addToCart(product)}
                onClick={() => { navigate('/product/' + product.id); window.scrollTo(0, 0) }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center overflow-hidden bg-charcoal">
        <img
          src="https://images.unsplash.com/photo-1708182564325-fb1d3a3864d3?w=1600&h=900&fit=crop&auto=format"
          alt="Editorial fashion campaign"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
        <div className="relative z-10 px-8 lg:px-20 max-w-3xl">
          <p className="section-label text-gold-light mb-5">The Edit</p>
          <h2 className="font-serif text-ivory text-4xl lg:text-6xl xl:text-7xl font-medium leading-tight mb-6">
            A Story in<br />Every Thread
          </h2>
          <p className="text-ivory/75 text-base font-light leading-relaxed mb-10 max-w-md">
            From intimate celebrations to unforgettable occasions, discover sarees designed to become part of your story.
          </p>
          <button className="btn-outline" onClick={() => go('collection')}>Explore the Edit <ArrowRight /></button>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="bg-ivory py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-4">Curated</p>
            <h2 className="display-text text-charcoal">The Signature Edit</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {COLLECTIONS.map((col) => (
              <div
                key={col.name}
                className="collection-card relative overflow-hidden cursor-pointer bg-beige"
                style={{ aspectRatio: '3/4' }}
                onClick={() => go('collection')}
              >
                <img src={col.img} alt={col.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="collection-overlay absolute inset-0" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                  <p className="text-ivory font-serif text-lg font-medium mb-1">{col.name}</p>
                  <p className="text-ivory/70 text-xs font-light leading-snug hidden lg:block">{col.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand pillars */}
      <section className="bg-beige/50 border-y border-border py-14 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { icon: '✦', label: 'Pure Materials', desc: 'Authenticated silks and luxury fabrics' },
            { icon: '◈', label: 'Master Artisans', desc: 'Hand-woven by generational craftspeople' },
            { icon: '⬡', label: 'Curated Edit', desc: 'Each piece thoughtfully selected' },
            { icon: '◇', label: 'Free Shipping', desc: 'Complimentary delivery across India' },
          ].map((p) => (
            <div key={p.label}>
              <div className="text-gold text-xl mb-3">{p.icon}</div>
              <p className="text-charcoal text-xs font-semibold tracking-widest uppercase mb-2">{p.label}</p>
              <p className="text-warm-grey text-xs leading-relaxed font-light">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="bg-ivory py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Social</p>
            <h2 className="display-text text-charcoal mb-2">Follow the Sanskruti Edit</h2>
            <p className="text-warm-grey text-sm font-light">Discover new arrivals, styling inspiration and stories from Sanskruti.</p>
            <p className="text-charcoal text-xs tracking-widest uppercase font-semibold mt-3">@Sanskruti</p>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {INSTAGRAM.map((src, i) => (
              <div key={i} className="relative overflow-hidden bg-beige cursor-pointer group" style={{ aspectRatio: '1' }}>
                <img src={src} alt="Instagram post" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />
    </main>
  )
}

// Product Card
function ProductCard({ product, wishlisted, onWishlist, onAddToCart, onClick }: {
  product: typeof PRODUCTS[0];
  wishlisted: boolean;
  onWishlist: () => void;
  onAddToCart: () => void;
  onClick: () => void;
}) {
  return (
    <div className="product-card">
      <div className="img-wrap" style={{ aspectRatio: '3/4' }} onClick={onClick}>
        <img src={product.img} alt={product.name} />
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 bg-ivory text-charcoal text-[10px] font-semibold tracking-widest uppercase px-2 py-1">
            {product.tag}
          </span>
        )}
        <button
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onWishlist() }}
          aria-label="Add to wishlist"
        >
          <HeartIcon filled={wishlisted} />
        </button>
        <div className="quick-actions">
          <button className="quick-view-btn" onClick={(e) => { e.stopPropagation(); onClick() }}>Quick View</button>
          <button className="add-bag-btn" onClick={(e) => { e.stopPropagation(); onAddToCart() }}>Add to Bag</button>
        </div>
      </div>
      <div className="pt-4 pb-2">
        <p className="text-charcoal font-serif text-sm font-medium mb-0.5">{product.name}</p>
        <p className="text-warm-grey text-xs tracking-wide mb-2 uppercase font-light">{product.fabric}</p>
        <p className="text-charcoal text-sm font-semibold">{fmt(product.price)}</p>
      </div>
    </div>
  )
}

// Footer
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0) }
  return (
    <footer className="bg-charcoal text-ivory pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-ivory/10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4"><SanskrutiLogo inverted size="md" /></div>
            <p className="text-ivory/50 text-xs tracking-widest uppercase mb-6">Timeless Indian Elegance.</p>
            <div className="flex flex-col gap-1 text-ivory/60 text-xs font-light">
              <p>9769831819</p>
              <p>sanskrutisarees17@gmail.com</p>
            </div>
          </div>

          {[
            { title: 'Shop', links: ['New Arrivals', 'Sarees', 'Collections', 'Best Sellers'] },
            { title: 'About', links: ['Our Story', 'Craftsmanship', 'Contact'] },
            { title: 'Help', links: ['Shipping', 'Returns', 'FAQs', 'Size Guide'] },
            { title: 'Connect', links: ['Instagram', 'Facebook', 'WhatsApp'] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-ivory/40 text-[10px] tracking-widest uppercase font-semibold mb-5">{col.title}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      className="text-ivory/70 text-xs font-light hover:text-ivory transition-colors duration-200"
                      onClick={() => {
                        if (link === 'Our Story' || link === 'Craftsmanship') go('about')
                        else if (link === 'Contact') go('contact')
                        else go('collection')
                      }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 text-center">
          <p className="text-ivory/30 text-xs font-light">
            © 2026 Sanskruti. All Rights Reserved. &nbsp;|&nbsp; Vashi, Navi Mumbai, Maharashtra 400703
          </p>
        </div>
      </div>
    </footer>
  )
}

// Collection Page
function CollectionPage({ setPage, wishlist, toggleWishlist, addToCart }: {
  setPage: (p: Page) => void; wishlist: number[]; toggleWishlist: (id: number) => void; addToCart: (p: typeof PRODUCTS[0]) => void;
}) {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('featured')
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <main className="pt-[72px] min-h-screen bg-ivory">
      {/* Page header */}
      <div className="border-b border-border px-6 lg:px-12 py-12 bg-ivory">
        <p className="section-label mb-3 text-center">Explore</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-center text-charcoal font-medium mb-3">Sarees</h1>
        <p className="text-warm-grey text-sm text-center font-light">Explore Sanskruti's curated collection of timeless Indian sarees.</p>
      </div>

      {/* Filters + sort bar */}
      <div className="sticky top-[72px] z-30 bg-ivory border-b border-border px-6 lg:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-charcoal hover:text-gold transition-colors"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filters
          </button>
          <span className="text-warm-grey text-xs">{PRODUCTS.length} products</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-warm-grey hidden sm:block">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium text-charcoal bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Filter sidebar + grid */}
      <div className="flex px-6 lg:px-12 py-10 gap-8 max-w-7xl mx-auto">
        {/* Filters sidebar */}
        {filterOpen && (
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-36">
              {[
                { label: 'Category', opts: ['Silk Sarees', 'Banarasi', 'Georgette', 'Designer', 'Festive', 'Wedding'] },
                { label: 'Price', opts: ['Under ₹10,000', '₹10,000–₹15,000', '₹15,000–₹20,000', 'Above ₹20,000'] },
                { label: 'Fabric', opts: ['Pure Silk', 'Banarasi Silk', 'Georgette', 'Chanderi', 'Organza'] },
                { label: 'Occasion', opts: ['Wedding', 'Festive', 'Casual', 'Party', 'Office'] },
              ].map((group) => (
                <div key={group.label} className="mb-6">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-warm-grey mb-3">{group.label}</p>
                  <div className="flex flex-col gap-2">
                    {group.opts.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-3 h-3 accent-charcoal" />
                        <span className="text-xs text-charcoal/70 group-hover:text-charcoal transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Product grid */}
        <div className="flex-1">
          <div className={`grid gap-4 lg:gap-6 ${filterOpen ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlisted={wishlist.includes(product.id)}
                onWishlist={() => toggleWishlist(product.id)}
                onAddToCart={() => addToCart(product)}
                onClick={() => { navigate('/product/' + product.id); window.scrollTo(0, 0) }}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer setPage={setPage} />
    </main>
  )
}

// PDP
function PDPPage({ setPage, addToCart, wishlist, toggleWishlist }: {
  setPage: (p: Page) => void; addToCart: (p: typeof PRODUCTS[0]) => void; wishlist: number[]; toggleWishlist: (id: number) => void;
}) {
  const { id } = useParams()
  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0]
  const [selectedImg, setSelectedImg] = useState(0)
  const [openSection, setOpenSection] = useState<string | null>('Description')
  const [added, setAdded] = useState(false)

  const otherImgs = PRODUCTS.filter((p) => p.id !== product.id).map((p) => p.img)
  const imgs = [product.img, ...otherImgs.slice(0, 3)]

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const sections = [
    { label: 'Description', content: `The ${product.name} is an exquisite masterpiece of Indian textile artistry. Woven from the finest ${product.fabric.toLowerCase()} threads by master artisans, this saree embodies centuries of tradition transformed into contemporary elegance. The rich lustre and fluid drape make it perfect for special occasions.` },
    { label: 'Details & Care', content: `Fabric: ${product.fabric} · Length: 6.3 metres with matching blouse piece · Care: Dry clean only · Store wrapped in muslin cloth · Do not wring or twist · Avoid direct sunlight when storing` },
    { label: 'Shipping', content: 'Complimentary shipping across India on all orders. Estimated delivery: 3–7 business days. Express delivery available at checkout.' },
    { label: 'Returns', content: 'Easy 15-day returns on unworn, unwashed items with original packaging and tags intact. Contact us at sanskrutisarees17@gmail.com to initiate a return.' },
  ]

  return (
    <main className="pt-[72px] min-h-screen bg-ivory">
      {/* Breadcrumb */}
      <div className="px-6 lg:px-12 py-4 flex items-center gap-2 text-xs text-warm-grey border-b border-border">
        <button onClick={() => setPage('home')} className="hover:text-charcoal">Home</button>
        <span>/</span>
        <button onClick={() => setPage('collection')} className="hover:text-charcoal">Sarees</button>
        <span>/</span>
        <span className="text-charcoal">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Image gallery */}
          <div>
            <div className="relative overflow-hidden bg-beige mb-3" style={{ aspectRatio: '3/4' }}>
              <img src={imgs[selectedImg]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {imgs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`overflow-hidden bg-beige border-2 transition-colors ${selectedImg === i ? 'border-charcoal' : 'border-transparent'}`}
                  style={{ aspectRatio: '3/4' }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <p className="section-label mb-3">Pure Silk</p>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal font-medium mb-3">{product.name}</h1>

            <div className="flex items-center gap-1.5 mb-5">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              <span className="text-warm-grey text-xs ml-1">(28 reviews)</span>
            </div>

            <p className="text-charcoal text-2xl font-semibold mb-6">{fmt(product.price)}</p>

            <p className="text-warm-grey text-sm font-light leading-relaxed mb-8 max-w-md">
              An exquisite masterpiece of Indian textile artistry, woven from the finest pure silk threads by master artisans. Fluid drape, timeless elegance.
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8 py-6 border-y border-border">
              {[
                ['Fabric', 'Pure Silk'],
                ['Colour', 'Ivory / Charcoal'],
                ['Length', '6.3 Metres'],
                ['Blouse', 'Included'],
                ['Occasion', 'Wedding / Festive'],
                ['Care', 'Dry Clean Only'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-warm-grey text-[10px] tracking-widest uppercase font-semibold mb-0.5">{k}</p>
                  <p className="text-charcoal text-sm">{v}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                className={`btn-primary justify-center py-4 ${added ? 'opacity-80' : ''}`}
                onClick={handleAdd}
              >
                {added ? '✓ Added to Bag' : 'Add to Bag'}
              </button>
              <button
                className={`btn-outline-dark justify-center py-4 flex items-center gap-2 ${wishlist.includes(product.id) ? 'bg-charcoal/5' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <HeartIcon filled={wishlist.includes(product.id)} />
                {wishlist.includes(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: '◇', label: 'Free Shipping' },
                { icon: '✦', label: 'Secure Payment' },
                { icon: '◈', label: 'Easy Assistance' },
                { icon: '⬡', label: 'Authenticity Assured' },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2.5 text-xs text-warm-grey">
                  <span className="text-gold text-sm">{t.icon}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div>
              {sections.map((s) => (
                <div key={s.label}>
                  <button className="accordion-btn" onClick={() => setOpenSection(openSection === s.label ? null : s.label)}>
                    {s.label}
                    {openSection === s.label ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  <div
                    className="accordion-content text-warm-grey text-sm font-light leading-relaxed"
                    style={{ maxHeight: openSection === s.label ? '200px' : '0', opacity: openSection === s.label ? 1 : 0, paddingBottom: openSection === s.label ? '1rem' : 0 }}
                  >
                    {s.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-20 lg:mt-28">
          <h2 className="font-serif text-2xl lg:text-3xl text-charcoal font-medium mb-10 text-center">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {PRODUCTS.slice(4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlisted={wishlist.includes(product.id)}
                onWishlist={() => toggleWishlist(product.id)}
                onAddToCart={() => addToCart(product)}
                onClick={() => window.scrollTo(0, 0)}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </main>
  )
}

// Cart Page
function CartPage({ setPage, cart, updateQty, removeItem }: {
  setPage: (p: Page) => void; cart: CartItem[]; updateQty: (id: number, qty: number) => void; removeItem: (id: number) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal > 15000 ? 0 : 299
  const total = subtotal + shipping

  return (
    <main className="pt-[72px] min-h-screen bg-ivory">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-14">
        <p className="section-label mb-3">Review</p>
        <h1 className="font-serif text-4xl text-charcoal font-medium mb-12">Your Bag</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-warm-grey text-lg font-light mb-6">Your bag is empty</p>
            <button className="btn-primary" onClick={() => setPage('collection')}>Continue Shopping</button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 flex flex-col divide-y divide-border">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-5 py-6">
                  <div className="w-24 h-32 flex-shrink-0 bg-beige overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-serif text-base text-charcoal font-medium">{item.name}</p>
                      <p className="text-charcoal font-semibold text-sm ml-4">{fmt(item.price * item.qty)}</p>
                    </div>
                    <p className="text-warm-grey text-xs uppercase tracking-wide mb-4">{item.fabric}</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="flex items-center border border-border">
                        <button className="px-3 py-2 hover:bg-beige transition-colors" onClick={() => updateQty(item.id, item.qty - 1)}><MinusIcon /></button>
                        <span className="px-4 text-sm font-medium">{item.qty}</span>
                        <button className="px-3 py-2 hover:bg-beige transition-colors" onClick={() => updateQty(item.id, item.qty + 1)}><PlusIcon /></button>
                      </div>
                      <button className="text-warm-grey text-xs underline hover:text-charcoal" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-beige/50 p-8 sticky top-28">
                <h2 className="font-serif text-lg text-charcoal font-medium mb-6">Order Summary</h2>
                <div className="flex flex-col gap-3 mb-6 text-sm">
                  <div className="flex justify-between"><span className="text-warm-grey">Subtotal</span><span className="text-charcoal">{fmt(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-warm-grey">Shipping</span><span className="text-charcoal">{shipping === 0 ? 'Free' : fmt(shipping)}</span></div>
                  {shipping === 0 && <p className="text-gold text-xs">✓ Free shipping applied</p>}
                  <div className="flex justify-between font-semibold text-base pt-3 border-t border-border">
                    <span>Total</span><span>{fmt(total)}</span>
                  </div>
                </div>
                <button className="btn-primary w-full justify-center py-4 text-sm" onClick={() => { setPage('checkout'); window.scrollTo(0, 0) }}>
                  Proceed to Checkout
                </button>
                <button className="w-full text-center text-xs text-warm-grey mt-4 hover:text-charcoal" onClick={() => setPage('collection')}>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer setPage={setPage} />
    </main>
  )
}

// Checkout Page
function CheckoutPage({ setPage, cart }: { setPage: (p: Page) => void; cart: CartItem[] }) {
  const [payment, setPayment] = useState('upi')
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + (subtotal > 15000 ? 0 : 299)

  return (
    <main className="pt-[72px] min-h-screen bg-ivory">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-14">
        <button onClick={() => setPage('cart')} className="flex items-center gap-2 text-warm-grey text-xs tracking-widest uppercase hover:text-charcoal mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M19 12H5"/><path d="m12 5-7 7 7 7"/></svg>
          Back to Bag
        </button>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <p className="section-label mb-3">Checkout</p>
            <h1 className="font-serif text-3xl text-charcoal font-medium mb-10">Complete Your Order</h1>

            <div className="flex flex-col gap-8">
              {/* Contact */}
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal mb-5 pb-3 border-b border-border">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1"><input type="text" placeholder="First Name" /></div>
                  <div className="col-span-2 sm:col-span-1"><input type="text" placeholder="Last Name" /></div>
                  <div className="col-span-2"><input type="email" placeholder="Email Address" /></div>
                  <div className="col-span-2"><input type="tel" placeholder="Phone Number" /></div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal mb-5 pb-3 border-b border-border">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><input type="text" placeholder="Address Line 1" /></div>
                  <div className="col-span-2"><input type="text" placeholder="Address Line 2 (Optional)" /></div>
                  <div><input type="text" placeholder="City" /></div>
                  <div><input type="text" placeholder="State" /></div>
                  <div><input type="text" placeholder="PIN Code" /></div>
                  <div>
                    <select>
                      <option>India</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal mb-5 pb-3 border-b border-border">Payment Method</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm & more' },
                    { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex, Rupay' },
                    { value: 'netbanking', label: 'Net Banking', desc: 'All major Indian banks' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Available on orders above ₹5,000' },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${payment === opt.value ? 'border-charcoal bg-charcoal/5' : 'border-border hover:border-warm-grey'}`}>
                      <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={() => setPayment(opt.value)} className="mt-0.5 accent-charcoal" />
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{opt.label}</p>
                        <p className="text-xs text-warm-grey font-light">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {payment === 'upi' && (
                  <div className="mt-4"><input type="text" placeholder="Enter UPI ID (e.g. name@upi)" /></div>
                )}
                {payment === 'card' && (
                  <div className="grid gap-3 mt-4">
                    <input type="text" placeholder="Card Number" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM / YY" />
                      <input type="text" placeholder="CVV" />
                    </div>
                    <input type="text" placeholder="Cardholder Name" />
                  </div>
                )}
              </div>

              <button className="btn-primary justify-center py-4 text-sm">
                Place Order · {fmt(total)}
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-beige/40 p-8">
              <h2 className="font-serif text-lg text-charcoal font-medium mb-6">Order Summary</h2>
              <div className="flex flex-col divide-y divide-border">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 py-4">
                    <div className="relative">
                      <div className="w-16 h-20 bg-beige overflow-hidden">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 bg-warm-grey text-ivory text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">{item.qty}</span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="text-xs font-medium text-charcoal">{item.name}</p>
                      <p className="text-warm-grey text-[10px]">{item.fabric}</p>
                    </div>
                    <p className="text-sm text-charcoal font-semibold">{fmt(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border text-sm">
                <div className="flex justify-between"><span className="text-warm-grey">Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-warm-grey">Shipping</span><span>{subtotal > 15000 ? 'Free' : fmt(299)}</span></div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border mt-1">
                  <span>Total</span><span>{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// About Page
function AboutPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <main className="pt-[72px] min-h-screen bg-ivory">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] bg-beige flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1572470176170-98fa8abcb741?w=1600&h=800&fit=crop&auto=format"
          alt="Sanskruti heritage"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative z-10 px-8 lg:px-20 pb-16">
          <p className="section-label text-gold-light mb-4">Our Heritage</p>
          <h1 className="font-serif text-4xl lg:text-6xl text-ivory font-medium">The Story of Sanskruti</h1>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-6 lg:px-0 py-20 text-center">
        <p className="text-warm-grey text-lg font-light leading-loose">
          Sanskruti is rooted in the timeless elegance of Indian craftsmanship while embracing the evolving style of the modern woman. Founded in Navi Mumbai, we curate sarees that are more than garments — they are heirlooms in the making.
        </p>
      </section>

      {/* Sections */}
      {[
        { label: 'Our Story', title: 'Born from a love of Indian textiles', body: "Sanskruti began as a passionate pursuit of the finest Indian weaves — sourced directly from the looms of Varanasi, Kanjivaram, Chanderi and beyond. Our founder's vision was simple: bring the exquisite artistry of India's master weavers to the modern woman who values both heritage and contemporary taste.", img: 'https://images.unsplash.com/photo-1693023656257-87c142566ad3?w=700&h=500&fit=crop&auto=format', reverse: false },
        { label: 'Our Philosophy', title: 'Quality without compromise', body: "Every saree in our collection is personally curated, authenticated for its fabric, weave, and finish. We believe in slow fashion — in choosing pieces that outlast trends, that earn a permanent place in a wardrobe. Sanskruti is a celebration of the artisan's hand, not the machine's speed.", img: 'https://images.unsplash.com/photo-1628973434123-3e956f203dd6?w=700&h=500&fit=crop&auto=format', reverse: true },
        { label: 'Craftsmanship', title: 'Woven by master artisans', body: 'Our relationships with weaving communities span generations. We work directly with artisan clusters across India — from the silk weavers of Banaras to the block printers of Jaipur — ensuring fair compensation and the preservation of dying techniques. Each saree carries the spirit of its maker.', img: 'https://images.unsplash.com/photo-1612744192242-35cd7a7d35e6?w=700&h=500&fit=crop&auto=format', reverse: false },
      ].map((s) => (
        <section key={s.label} className={`max-w-7xl mx-auto px-6 lg:px-12 py-14 grid lg:grid-cols-2 gap-12 items-center ${s.reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <div className="overflow-hidden bg-beige" style={{ aspectRatio: '4/3' }}>
            <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="section-label mb-4">{s.label}</p>
            <h2 className="font-serif text-2xl lg:text-3xl text-charcoal font-medium mb-5">{s.title}</h2>
            <p className="text-warm-grey text-base font-light leading-relaxed">{s.body}</p>
          </div>
        </section>
      ))}

      <Footer setPage={setPage} />
    </main>
  )
}

// Contact Page
function ContactPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <main className="pt-[72px] min-h-screen bg-ivory">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <p className="section-label mb-4">Reach Out</p>
            <h1 className="font-serif text-4xl lg:text-5xl text-charcoal font-medium mb-10">Get in Touch</h1>

            <div className="flex flex-col gap-8">
              {[
                { label: 'Phone', value: '9769831819', href: 'tel:9769831819' },
                { label: 'Email', value: 'sanskrutisarees17@gmail.com', href: 'mailto:sanskrutisarees17@gmail.com' },
              ].map((c) => (
                <div key={c.label}>
                  <p className="text-warm-grey text-xs tracking-widest uppercase font-semibold mb-2">{c.label}</p>
                  <a href={c.href} className="text-charcoal text-base hover:text-gold transition-colors font-light">{c.value}</a>
                </div>
              ))}
              <div>
                <p className="text-warm-grey text-xs tracking-widest uppercase font-semibold mb-2">Visit Us</p>
                <address className="text-charcoal text-base font-light not-italic leading-relaxed">
                  Sanskruti Sarees<br />
                  21, Chadda Crescent, Sector 17<br />
                  Abhudaya Bank Marg, Vashi<br />
                  Navi Mumbai, Maharashtra 400703
                </address>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-10 bg-beige h-48 lg:h-64 flex items-center justify-center border border-border">
              <div className="text-center">
                <p className="text-warm-grey text-xs tracking-widest uppercase font-semibold mb-1">Find Us</p>
                <p className="text-warm-grey text-xs font-light">Vashi, Navi Mumbai</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal font-medium mb-8">Send a Message</h2>
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Email Address" />
              <input type="tel" placeholder="Phone Number" />
              <textarea placeholder="Your message..." rows={5} style={{ resize: 'vertical' }} />
              <button type="submit" className="btn-primary justify-center py-4">Send Message</button>
            </form>
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </main>
  )
}

// Mobile bottom nav
function BottomNav({ page, setPage, cartCount }: { page: Page; setPage: (p: Page) => void; cartCount: number }) {
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0) }
  const tabs = [
    { label: 'Home', page: 'home' as Page, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: 'Shop', page: 'collection' as Page, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    { label: 'Search', page: 'collection' as Page, icon: <SearchIcon /> },
    { label: 'Wishlist', page: 'collection' as Page, icon: <HeartIcon /> },
    { label: 'Bag', page: 'cart' as Page, icon: <BagIcon count={cartCount} /> },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory border-t border-border flex">
      {tabs.map((t) => (
        <button
          key={t.label}
          onClick={() => go(t.page)}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${page === t.page ? 'text-charcoal' : 'text-warm-grey'}`}
        >
          {t.icon}
          <span className="text-[9px] tracking-widest uppercase font-semibold">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

// App root
export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  let page: Page = 'home'
  if (pathname === '/') page = 'home'
  else if (pathname.startsWith('/product/')) page = 'pdp'
  else if (pathname === '/collection') page = 'collection'
  else if (pathname === '/cart') page = 'cart'
  else if (pathname === '/checkout') page = 'checkout'
  else if (pathname === '/about') page = 'about'
  else if (pathname === '/contact') page = 'contact'

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const toggleWishlist = (id: number) => {
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id])
  }

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id)
      if (existing) return c.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...c, { id: product.id, name: product.name, price: product.price, qty: 1, img: product.img, fabric: product.fabric }]
    })
  }

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) return setCart((c) => c.filter((i) => i.id !== id))
    setCart((c) => c.map((i) => i.id === id ? { ...i, qty } : i))
  }

  const removeItem = (id: number) => setCart((c) => c.filter((i) => i.id !== id))
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const setPage = (p: Page) => {
    window.scrollTo(0, 0)
    if (p === 'home') navigate('/')
    else navigate('/' + p)
  }

  return (
    <div className="relative">
      <Header
        page={page}
        setPage={setPage}
        cartCount={cartCount}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <Routes>
        <Route path="/" element={<HomePage setPage={setPage} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
        <Route path="/collection" element={<CollectionPage setPage={setPage} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
        <Route path="/product/:id" element={<PDPPage setPage={setPage} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
        <Route path="/cart" element={<CartPage setPage={setPage} cart={cart} updateQty={updateQty} removeItem={removeItem} />} />
        <Route path="/checkout" element={<CheckoutPage setPage={setPage} cart={cart} />} />
        <Route path="/about" element={<AboutPage setPage={setPage} />} />
        <Route path="/contact" element={<ContactPage setPage={setPage} />} />
        {/* Fallback */}
        <Route path="*" element={<HomePage setPage={setPage} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
      </Routes>

      <BottomNav page={page} setPage={setPage} cartCount={cartCount} />

      {/* Mobile bottom nav spacer */}
      <div className="lg:hidden h-16" />
    </div>
  )
}
