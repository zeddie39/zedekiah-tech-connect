import React from "react";

const reasons = [
	{
		title: "Trusted Expertise",
		description:
			"Our certified technicians and consultants have years of experience in electronics repair, IT, and security solutions.",
	},
	{
		title: "Customer-Centric Service",
		description:
			"We prioritize your satisfaction with transparent pricing, honest advice, and fast turnaround times.",
	},
	{
		title: "Cutting-Edge Solutions",
		description:
			"From AI-powered diagnostics to secure e-commerce and AR support, we leverage the latest technology to serve you better.",
	},
	{
		title: "Secure & Reliable",
		description:
			"Your data and devices are handled with utmost care, privacy, and security. We are fully insured and compliant with industry standards.",
	},
	{
		title: "Community Commitment",
		description:
			"We support local businesses, empower youth with tech skills, and give back through outreach and training programs.",
	},
	{
		title: "Comprehensive Services",
		description:
			"From repairs and installations to consulting and e-commerce, we are your one-stop tech partner.",
	},
	{
		title: "Proven Track Record",
		description:
			"Hundreds of satisfied customers and businesses trust us for their tech needs.",
	},
	{
		title: "Fast & Responsive Support",
		description:
			"Our team is available 24/7 for emergencies and always ready to help you.",
	},
	{
		title: "Transparent Communication",
		description:
			"We keep you informed at every step, with no hidden fees or surprises.",
	},
	{
		title: "Innovation & Growth",
		description:
			"We constantly invest in new tools, training, and technology to deliver the best solutions.",
	},
];

const WhyChooseUs = () => (
	<section id="whychooseus" className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
		<div className="container mx-auto px-4 py-12 min-h-screen">
			<h1 className="text-4xl font-bold text-center text-primary mb-8 font-orbitron">
				Why Choose Ztech Electronics Ltd?
			</h1>
			<p className="text-lg text-center text-gray-700 mb-10 max-w-2xl mx-auto">
				Discover what sets us apart and why so many individuals and businesses trust
				us for their electronics, IT, and security needs.
			</p>
			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{reasons.map((reason, idx) => (
					<div
						key={idx}
						className="bg-white rounded-2xl shadow-lg p-8 border border-accent/20 flex flex-col items-center text-center hover:shadow-xl transition"
					>
						<h2 className="text-2xl font-semibold text-accent mb-3 font-orbitron">
							{reason.title}
						</h2>
						<p className="text-gray-700 text-base">
							{reason.description}
						</p>
					</div>
				))}
			</div>
			<div className="mt-12 text-center">
				<a
					href="/contact"
					className="inline-block bg-accent text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-accent/80 transition-all text-lg"
				>
					Contact Us Today
				</a>
			</div>
		</div>
	</section>
);

export default WhyChooseUs;
