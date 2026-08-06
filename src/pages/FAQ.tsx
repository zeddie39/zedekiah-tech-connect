import React from "react";

const faqs = [
	{
		question: "What services does Ztech Electronics Limited offer?",
		answer: (
			<span>
				We specialize in:
				<ul className="list-disc pl-5 mt-2 space-y-1">
					<li>Electronics repair (phones, laptops, TVs, etc.)</li>
					<li>Smart diagnostics using AI & AR (coming soon)</li>
					<li>Tech consultation and IT infrastructure planning</li>
					<li>
						An online marketplace for buying, selling, and advertising electronics
					</li>
					<li>Real-time customer support and secure repair ticket tracking</li>
				</ul>
			</span>
		),
	},
	{
		question: "How can I request a repair?",
		answer: (
			<span>
				You can request a repair directly on our platform by:
				<ul className="list-decimal pl-5 mt-2 space-y-1">
					<li>Logging into your account</li>
					<li>Describing your issue or uploading a photo of your gadget</li>
					<li>Submitting the request to receive a diagnosis or quote</li>
					<li>Dropping off or shipping your device to our workshop</li>
				</ul>
			</span>
		),
	},
	{
		question: "Do you offer warranties on repairs?",
		answer: "Yes, most repairs come with a limited warranty (duration depends on the type of repair). We will inform you of the warranty details before the job is finalized.",
	},
	{
		question: "Can I sell my device on your platform?",
		answer: (
			<span>
				Yes! Verified users can list electronics for sale or advertising. You’ll need to:
				<ul className="list-decimal pl-5 mt-2 space-y-1">
					<li>Create an account</li>
					<li>Upload clear photos and device details</li>
					<li>Set your price and availability</li>
				</ul>
				We manually review listings to ensure quality and safety.
			</span>
		),
	},
	{
		question: "Is my personal data safe?",
		answer: "Absolutely. We use strong encryption, secure logins, and comply with privacy regulations. Your data will never be sold or misused.",
	},
	{
		question: "How does the AI-powered assistant work?",
		answer: (
			<span>
				Our AI assistant allows users to:
				<ul className="list-disc pl-5 mt-2 space-y-1">
					<li>Upload images of faulty gadgets</li>
					<li>Describe problems in chat</li>
				</ul>
				It then analyzes the input and provides smart recommendations or repair paths. This tool is constantly improving and does not replace professional evaluation.
			</span>
		),
	},
	{
		question: "How long does a typical repair take?",
		answer: "It depends on the issue. Standard repairs (screen replacement, battery, etc.) can take 1–3 business days. Complex motherboard or software repairs may take longer, but you’ll receive real-time updates.",
	},
	{
		question: "Do you pick up or deliver repaired items?",
		answer: "Yes, we offer pickup and delivery services in select locations. This can be arranged during your service request or by contacting support.",
	},
	{
		question: "How can I contact customer support?",
		answer: (
			<span>
				You can reach us via:
				<ul className="list-disc pl-5 mt-2 space-y-1">
					<li>Live chat on the platform</li>
					<li>
						Email:{" "}
						<a
							href="mailto:zeedy028@gmail.com"
							className="underline text-amber-600 hover:text-amber-700 dark:text-amber-400 font-semibold"
						>
							zeedy028@gmail.com
						</a>
					</li>
					<li>
						Phone:{" "}
						<a
							href="tel:+254757756763"
							className="underline text-amber-600 hover:text-amber-700 dark:text-amber-400 font-semibold"
						>
							+254 757 756 763
						</a>
					</li>
				</ul>
			</span>
		),
	},
	{
		question: "Where is Ztech Electronics Limited located?",
		answer: "We are based in Kenya, but we serve customers countrywide and aim to expand our support with digital and remote services, including virtual consultations and AR support.",
	},
	{
		question: "Can businesses or schools partner with Ztech?",
		answer: "Yes! We offer B2B services, including bulk repair plans, tech infrastructure setup, and device management for schools, offices, and organizations. Get in touch for a customized solution.",
	},
];

const FAQPage = () => (
	<div className="container mx-auto px-4 py-16 text-foreground" id="faq">
		<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-foreground mb-10 font-orbitron">
			Frequently Asked Questions (FAQs)
		</h2>
		<div className="max-w-3xl mx-auto space-y-6">
			{faqs.map((faq, idx) => (
				<div
					key={idx}
					className="bg-white dark:bg-card/90 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-border transition-all duration-300"
				>
					<h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-3 font-orbitron">
						{faq.question}
					</h3>
					<div className="text-gray-600 dark:text-foreground/80 text-base leading-relaxed">{faq.answer}</div>
				</div>
			))}
		</div>
	</div>
);

export default FAQPage;
