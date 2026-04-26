"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

/**
 * Navbar
 *
 * Transparent on landing page, becomes a solid white
 * surface with shadow when the user scrolls down.
 * Collapses to a hamburger menu on mobile.
 */

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: `all var(--duration-base) var(--ease-smooth)`,
        background: scrolled
          ? 'rgba(255,255,255,0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        borderBottom: scrolled
          ? '1px solid var(--color-surface-overlay)'
          : '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 'var(--text-heading-sm)',
              fontWeight: '700',
              color: 'var(--color-content-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            FlowTrack
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="hidden-mobile"
        >
          <Link
            href="#how-it-works"
            style={{
              padding: '8px 16px',
              color: 'var(--color-content-secondary)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              transition: `all var(--duration-fast) var(--ease-smooth)`,
            }}
          >
            How it works
          </Link>
          <Link
            href="#services"
            style={{
              padding: '8px 16px',
              color: 'var(--color-content-secondary)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              transition: `all var(--duration-fast) var(--ease-smooth)`,
            }}
          >
            Services
          </Link>
          <Link href="/book">
            <Button size="sm">Book now</Button>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'var(--color-content-primary)',
          }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: 'var(--color-surface-raised)',
            borderTop: '1px solid var(--color-surface-overlay)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Link
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '14px 16px',
              color: 'var(--color-content-secondary)',
              fontSize: 'var(--text-body-md)',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-base)',
            }}
          >
            How it works
          </Link>
          <Link
            href="#services"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '14px 16px',
              color: 'var(--color-content-secondary)',
              fontSize: 'var(--text-body-md)',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-base)',
            }}
          >
            Services
          </Link>
          <Link href="/book" onClick={() => setMenuOpen(false)}>
            <Button fullWidth size="md">Book now</Button>
          </Link>
        </div>
      )}
    </header>
  )
}