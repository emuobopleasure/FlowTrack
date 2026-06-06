import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <section
            id="hero"
            className="bg-white"
            aria-label="Hero"
        >
            <div className="hero-section-wrapper container min-h-screen pt-16 flex flex-col lg:flex-row">

            {/* ── Image — top on mobile, right on desktop ── */}
            <div className="
                    relative w-full lg:flex-1
                    h-[55vw] min-h-[280px] max-h-[420px]
                    sm:h-[45vw] sm:max-h-[500px]
                    lg:h-auto lg:max-h-none
                    order-first lg:order-last"
            >
                <Image
                    src="/hero-outfits.png"
                    alt="Two Nigerian men in custom agbada and senator suit outfits"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Fade — bottom on mobile, left on desktop */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent lg:hidden" />
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent hidden lg:block" />
            </div>

            {/* ── Content ── */}
            <div className="flex-1 flex flex-col justify-center py-10 lg:py-0 order-last lg:order-first">
                {/* Badge */}
                {/* <span className="animate-fade-up inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-[#1B3A6B]/8 text-[#1B3A6B] text-sm font-semibold mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#1B3A6B] inline-block" />
                    Now Booking — Lagos &amp; Abuja
                </span> */}

                {/* Headline */}
                <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl xl:text-7xl font-bold text-[#0D1B2A] leading-[1.05] tracking-tight mb-5">
                    Dress Sharp.
                    <br />
                    <span className="text-[#1B3A6B]">Book Easy.</span>
                </h1>

                {/* Sub-headline */}
                <p className="animate-fade-up delay-200 text-[#64748B] text-base sm:text-xl leading-relaxed max-w-md mb-8">
                    Custom Nigerian menswear, booked online in minutes. No WhatsApp back-and-forth.
                </p>

                {/* CTAs */}
                <div className="animate-fade-up delay-300 flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
                    <Link href="/book" className="hero-cta-primary inline-flex items-center gap-2.5 px-8" id="hero-book-cta">
                        Book a Session
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <Link href="#services" className="hero-cta-secondary inline-flex items-center gap-2.5 px-8">
                        See Services
                    </Link>
                </div>

                {/* Trust indicators */}
                <div className="animate-fade-up delay-400 flex items-center gap-5 sm:gap-8 mt-10 pt-8 border-t border-[#E2E8F0]">
                    {[
                        { number: "200+", label: "Outfits made" },
                        { number: "24h", label: "Booking confirmed" },
                        { number: "100%", label: "Measurement guarantee" },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col">
                            <span className="text-xl sm:text-2xl font-bold text-[#1B3A6B]">{stat.number}</span>
                            <span className="text-xs text-gray-500 font-medium mt-0.5 leading-tight">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </section>
    );
};

export default Hero;