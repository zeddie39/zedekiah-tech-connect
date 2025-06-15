
import { Sparkle } from "lucide-react";

const testimonials = [
  {
    quote: "Fantastic service & fast repairs. My laptop feels brand new!",
    author: "Sarah M.",
  },
  {
    quote: "They set up CCTV for our shop quickly and professionally.",
    author: "Jacob K.",
  },
];

const Testimonials = () => (
  <section className="py-16 px-4 bg-muted text-center">
    <h2 className="text-3xl font-bold mb-10 text-primary animate-fade-in">
      What Our Clients Say
    </h2>
    <div className="max-w-2xl mx-auto flex flex-col gap-10">
      {testimonials.map((t, i) => (
        <blockquote
          key={t.author}
          className="glass-card relative p-8 rounded-xl border-l-4 border-accent shadow-lg text-left animate-fade-in"
          style={{ animationDelay: `${i * 0.25}s` }}
        >
          <span className="absolute -left-6 top-6 text-accent">
            <Sparkle size={32} strokeWidth={1.2} />
          </span>
          <p className="italic text-lg md:text-xl mb-4 text-gray-700">{`"${t.quote}"`}</p>
          <footer className="font-semibold text-accent mt-2 pl-3">— {t.author}</footer>
        </blockquote>
      ))}
    </div>
  </section>
);

export default Testimonials;
