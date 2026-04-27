"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
        background: 'rgba(247,248,252,.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E3E8F2',
        transition: 'box-shadow .3s ease',
        boxShadow: scrolled ? '0 2px 20px rgba(8,15,29,.06)' : 'none',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#080F1D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .2s ease, transform .25s cubic-bezier(.34,1.56,.64,1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1F56F4'
            e.currentTarget.style.transform = 'rotate(-6deg)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#080F1D'
            e.currentTarget.style.transform = 'rotate(0deg)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <span style={{ fontSize: '1.125rem', fontWeight: '800', letterSpacing: '-.02em', color: '#080F1D', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          FlowTrack
        </span>
      </Link>

      {/* Desktop links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hide-mobile">
        {['How it works', 'Services'].map((label, i) => (
          <Link
            key={i}
            href={label === 'How it works' ? '#how' : '#services'}
            style={{
              padding: '8px 18px', borderRadius: '9999px',
              fontSize: '.875rem', fontWeight: '500', color: '#4B5875',
              textDecoration: 'none',
              transition: 'background .18s, color .18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#080F1D' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5875' }}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/book"
          style={{
            padding: '11px 26px', borderRadius: '9999px',
            background: '#080F1D', color: '#fff',
            fontSize: '.875rem', fontWeight: '700',
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            transition: 'background .2s, transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s',
            letterSpacing: '.01em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1F56F4'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(31,86,244,.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#080F1D'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Book now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="show-mobile"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px', color: '#080F1D',
        }}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '68px', left: 0, right: 0,
          background: '#FFFFFF', borderBottom: '1px solid #E3E8F2',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          boxShadow: '0 8px 32px rgba(8,15,29,.08)',
        }}>
          {['How it works', 'Services'].map((label, i) => (
            <Link
              key={i}
              href={label === 'How it works' ? '#how' : '#services'}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '14px 16px', borderRadius: '14px',
                background: '#F7F8FC', color: '#4B5875',
                fontSize: '1rem', fontWeight: '500', textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '16px', borderRadius: '9999px', marginTop: '4px',
              background: '#080F1D', color: '#fff',
              fontSize: '1rem', fontWeight: '700', textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Book now
          </Link>
        </div>
      )}
    </header>
  )
}