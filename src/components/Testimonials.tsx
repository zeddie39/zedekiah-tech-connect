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
	{
		quote:
			"Expert advice and friendly staff. Solved my networking issues in no time.",
		author: "Miriam O.",
	},
	{
		quote:
			"Affordable and top-notch maintenance for our office equipment.",
		author: "Edward N.",
	},
	{
		quote: "Truly reliable. Our POS system is now efficient and fast!",
		author: "Susan F.",
	},
	{
		quote:
			"Quick turnaround and good communication. Highly recommended.",
		author: "Ahmed B.",
	},
];

const Testimonials = () => (
	<section className="py-16 px-4 bg-muted text-center">
		<h2 className="text-3xl font-bold mb-10 text-primary animate-fade-in font-playfair">
			What Our Clients Say
		</h2>
		<div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
			{testimonials.map((t, i) => (
				<blockquote
					key={t.author}
					className="glass-card aspect-square w-full flex flex-col justify-center items-start relative p-8 rounded-2xl border-l-4 border-accent shadow-lg animate-fade-in"
					style={{
						animationDelay: `${i * 0.15}s`,
						minHeight: "280px",
						maxHeight: "400px",
					}}
				>
					<span className="absolute -left-6 top-6 text-accent">
						<Sparkle size={32} strokeWidth={1.2} />
					</span>
					<p className="italic text-lg md:text-xl mb-4 text-gray-700">{`"${t.quote}"`}</p>
					<footer className="font-semibold text-accent mt-auto pl-3">
						— {t.author}
					</footer>
				</blockquote>
			))}
		</div>
	</section>
);

export default Testimonials;
