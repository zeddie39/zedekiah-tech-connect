import { Sparkle } from "lucide-react";

const testimonials = [
	   {
			   quote: "Fantastic service & fast repairs. My laptop feels brand new!",
			   author: "Achieng Otieno",
	   },
	   {
			   quote: "They set up CCTV for our shop quickly and professionally.",
			   author: "Mwangi Kamau",
	   },
	   {
			   quote:
					   "Expert advice and friendly staff. Solved my networking issues in no time.",
			   author: "Wanjiru Njeri",
	   },
	   {
			   quote:
					   "Affordable and top-notch maintenance for our office equipment.",
			   author: "Mutiso Ndambuki",
	   },
	   {
			   quote: "Truly reliable. Our POS system is now efficient and fast!",
			   author: "Nyambura Wambui",
	   },
	   {
			   quote:
					   "Quick turnaround and good communication. Highly recommended.",
			   author: "Abdi Yusuf",
	   },
];

const Testimonials = () => (
	<section className="py-16 px-4 bg-muted text-center">
		<h2 className="text-3xl font-bold mb-10 text-primary animate-fade-in font-playfair">
			What Our Clients Say
		</h2>
		<div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			{testimonials.map((t, i) => (
				<blockquote
					key={t.author}
					className="glass-card w-full flex flex-col justify-center items-start relative p-4 sm:p-5 md:p-6 rounded-xl border-l-4 border-accent shadow-md animate-fade-in"
					style={{
						animationDelay: `${i * 0.15}s`,
						minHeight: "180px",
						maxHeight: "260px",
					}}
				>
					<span className="absolute -left-4 top-4 text-accent">
						<Sparkle size={22} strokeWidth={1.2} />
					</span>
					<p className="italic text-base md:text-lg mb-3 text-gray-700">{`"${t.quote}"`}</p>
					<footer className="font-semibold text-accent mt-auto pl-2 text-sm md:text-base">
						— {t.author}
					</footer>
				</blockquote>
			))}
		</div>
	</section>
);

export default Testimonials;
