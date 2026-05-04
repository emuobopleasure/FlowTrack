import Link from "next/link";

/* ── Service cards data ───────────────────────────────────── */
const services = [
    {
        id: "custom-outfit",
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M10 4L6 8v16h16V8l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 4h8M10 4c0 2.2-1.8 4-4 4M18 4c0 2.2 1.8 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 14v6M11 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        title: "Custom Outfit",
        description: "Designed and sewn from scratch to your exact measurements. Agbada, senator suit, native wear done right.",
        price: "From ₦80,000",
    },
    {
        id: "alteration",
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 14l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Alteration",
        description: "Fix the fit on outfits you already own. Let it out, take it in, adjust the length, precise alterations.",
        price: "From ₦15,000",
    },
    {
        id: "consultation",
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M8 6h12a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10 22l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 12h8M10 9h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        title: "Consultation",
        description: "Not sure what style to wear for an event? Book a 30-minute session and leave with a clear plan.",
        price: "From ₦5,000",
    },
];


const Services = () => {
    return (
        <section id="services" className="py-24 bg-off-white"
            aria-labelledby="services-heading">
            {/* ══════════════════════════════════════
            SERVICES SECTION
            ══════════════════════════════════════ */}
            <div className="container">
                {/* Section header */}
                <div className="mb-14">
                    <span className="text-navy text-sm font-semibold uppercase tracking-widest">
                        What We Offer
                    </span>
                    <h2 id="services-heading" className="text-4xl sm:text-5xl font-bold text-text-primary mt-3 leading-tight">
                        Pick your service
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <article
                            key={service.id}
                            id={`service-${service.id}`}
                            className="
                    bg-white rounded-2xl p-8 border border-border-light
                    hover:border-navy/30 hover:-translate-y-1
                    transition-all duration-300 ease-out
                    flex flex-col gap-5
                  "
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-navy/8 flex items-center justify-center text-navy">
                                {service.icon}
                            </div>

                            {/* Text */}
                            <div className="flex flex-col gap-2 flex-1">
                                <h3 className="text-xl font-bold text-text-primary">{service.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
                            </div>

                            {/* Price + CTA */}
                            <div className="flex items-center justify-between pt-4 border-t border-border-light">
                                <span className="text-navy font-bold text-sm">{service.price}</span>
                                <Link
                                    href="/book"
                                    className="
                        text-navy text-sm font-semibold
                        inline-flex items-center gap-1.5
                        hover:gap-2.5 transition-all duration-200
                      "
                                >
                                    Book now
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                        <path d="M2 7h10M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Services