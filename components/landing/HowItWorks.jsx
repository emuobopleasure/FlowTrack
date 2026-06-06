/* ── How It Works steps ───────────────────────────────────── */
const steps = [
    {
        number: "01",
        title: "Choose Your Service",
        description: "Pick what you need, custom outfit, alteration, or a style consultation.",
    },
    {
        number: "02",
        title: "Share Your Details",
        description: "Tell us your measurements remotely or book a fitting appointment.",
    },
    {
        number: "03",
        title: "Pay & Confirm",
        description: "Pay securely via Paystack. Get a confirmation email with your booking summary.",
    },
];


const HowItWorks = () => {
    return (
        <section id="how-it-works"
            className="py-24 bg-white"
            aria-labelledby="how-heading">
            {/* ══════════════════════════════════════
            HOW IT WORKS
            ══════════════════════════════════════ */}
            <div className="container">
                {/* Header */}
                <div className="mb-14">
                    <span className="text-navy text-sm font-semibold uppercase tracking-widest">
                        Simple Process
                    </span>
                    <h2 id="how-heading" className="text-4xl sm:text-5xl font-bold text-text-primary mt-3 leading-tight">
                        How it works
                    </h2>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {steps.map((step, i) => (
                        <div key={step.number} className="flex flex-col gap-5">
                            {/* Step number */}
                            <div className="flex items-center gap-4">
                                <span
                                    className="text-5xl font-black text-slate-400 leading-none select-none"
                                    aria-hidden="true"
                                >
                                    {step.number}
                                </span>
                                {/* Connector line — only between steps */}
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block flex-1 h-px bg-border-light" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
                            <p className="text-slate-700 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks