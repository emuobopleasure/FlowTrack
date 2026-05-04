import Link from "next/link"

export const DarkCta = () => (
  <section
    className="py-24 px-8 sm:px-12 lg:px-20 bg-[#1B3A6B]"
    aria-labelledby="cta-heading"
  >
    <div className="container text-center flex flex-col items-center gap-8">
      <h2
        id="cta-heading"
        className="text-4xl sm:text-5xl font-bold text-white leading-tight"
      >
        Ready to look your best?
      </h2>

      <p className="text-white/70 text-lg max-w-md leading-relaxed">
        Join hundreds of men who book their custom outfits online, no queues,
        no confusion.
      </p>

      <Link
        href="/book"
        className="cta-link cta-link-white"
        aria-label="Book a session now"
      >
        Book a Session
        <svg
          width="16" height="16"
          viewBox="0 0 16 16" fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  </section>
)