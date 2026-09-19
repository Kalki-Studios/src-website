export default function TechStack() {
  const stack = [
    {
      category: "Frontend & Web",
      techs: ["React", "Next.js", "Tailwind CSS", "Vue.js", "TypeScript"],
    },
    {
      category: "Backend & Database",
      techs: ["Node.js", "Python", "PostgreSQL", "Firebase", "MongoDB"],
    },
    {
      category: "Mobile App Development",
      techs: ["Flutter", "React Native", "Swift", "Kotlin", "Android Studio"],
    },
    {
      category: "Hardware & AI",
      techs: ["Arduino", "Raspberry Pi", "TensorFlow", "PyTorch", "OpenCV"],
    },
  ];

  return (
    <section className="py-24 bg-white border-y" style={{ borderColor: "var(--rule)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-xs font-bold tracking-widest text-[var(--mute)] uppercase mb-3">
            TECHNICAL ARSENAL
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4 tracking-tight">
            Built with industry-standard tech.
          </h2>
          <p className="text-lg text-[var(--mute)] max-w-2xl">
            We don&apos;t just throw code together. We use the same modern frameworks, 
            languages, and microcontrollers used by top tech companies, ensuring your 
            project is robust, well-documented, and ready for review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider">
                {group.category}
              </h3>
              <ul className="space-y-2">
                {group.techs.map((tech, i) => (
                  <li 
                    key={i} 
                    className="flex items-center text-[var(--mute)] hover:text-[var(--ink)] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                    <span className="font-medium text-sm">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
