/* ============================================================
   Footer — Server Component
   No interactivity — renders as static HTML.
   ============================================================ */

import Link from "next/link";

const footerLinks = [
  { label: "Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Book a Session", href: "/book" },
  { label: "Verify Booking", href: "/booking/verify" },
];

export default function Footer() {
  return (
    <footer className="bg-[#080F1D] text-white">
      <div className="container py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
                  <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                  <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                  <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
                </svg>
              </span>
              <span className="font-bold text-lg tracking-tight">FlowTrack</span>
            </div>
            <p className="text-white text-sm max-w-xs leading-relaxed">
              Book your custom outfit online. No WhatsApp back-and-forth.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 list-none m-0 p-0">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-white/60 text-sm font-medium transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white text-xs">
          <span>© {new Date().getFullYear()} FlowTrack.</span>
          <span>Nigerian Men&apos;s Fashion Booking Platform</span>
        </div>
      </div>
    </footer>
  );
}
