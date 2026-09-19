const STEPS = [
  {
    number: "1",
    title: "Submit your requirement",
    body: "Fill out the form with your project details, deadline, and how to reach you. Attach your problem statement or project synopsis if you have one.",
  },
  {
    number: "2",
    title: "We review it",
    body: "All requests are reviewed personally. We take on projects that fit our capacity and expertise — not every request, so the ones we accept get full attention.",
  },
  {
    number: "3",
    title: "We contact you",
    body: "If your project is selected, we reach out to discuss and confirm the details before starting.",
  },
  {
    number: "4",
    title: "We build it",
    body: "Work begins. You get a working prototype or complete project, delivered before your deadline.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-20"
      style={{ borderBottom: "1px solid var(--rule)" }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <div
            className="text-xs font-medium tracking-widest uppercase mb-4 flex items-center gap-2"
            style={{ color: "var(--mute)" }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--rule)" }} />
            The process
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ letterSpacing: "-0.02em", maxWidth: "26ch" }}
          >
            How it works
          </h2>
          <p className="mt-3 text-sm prose-width" style={{ color: "var(--mute)" }}>
            Submitting a request does not guarantee that your project will be taken up. We review every
            request and reach out only to students whose projects we&apos;re able to take.
          </p>
        </div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 mt-8">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="relative pt-8 md:pt-10 md:pr-8"
              style={{
                borderTop: "1px solid var(--rule)",
              }}
            >
              {/* Step number badge intersecting the top border */}
              <div
                className="absolute top-0 left-0 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border bg-white shadow-sm"
                style={{
                  borderColor: "var(--rule)",
                  color: "var(--ink)",
                }}
              >
                <span className="text-xs font-bold">{step.number}</span>
              </div>

              <div
                className="text-base font-bold mb-2"
                style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
              >
                {step.title}
              </div>
              <div className="text-sm leading-relaxed" style={{ color: "var(--mute)" }}>
                {step.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
