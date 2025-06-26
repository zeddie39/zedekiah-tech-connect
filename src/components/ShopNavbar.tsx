import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
	{ label: "Shop", to: "/shop" },
	{ label: "Cart", to: "/cart" },
	{ label: "Orders", to: "/orders" },
	{ label: "Add Product", to: "/shop/new" },
];

export default function ShopNavbar() {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleNav = (to: string) => {
		setOpen(false);
		if (location.pathname !== to) navigate(to);
	};

	return (
		<nav className="w-full px-2 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur border-b border-gray-200 text-primary shadow-sm sticky top-0 z-30 transition-all">
			<div className="max-w-6xl mx-auto flex items-center justify-between">
				<div className="flex items-center gap-2 sm:gap-3">
					{/* Back button, hidden on shop home */}
					{location.pathname !== "/shop" && (
						<button
							className="mr-2 p-1 rounded-full hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
							onClick={() => navigate(-1)}
							aria-label="Go back"
						>
							<ArrowLeft size={20} className="text-primary" />
						</button>
					)}
					<img
						src="/ZTech electrictronics logo.png"
						alt="Ztech Logo"
						className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow"
					/>
					<span className="text-primary">Ztech Electronics Ltd Shop</span>
				</div>
				{/* Desktop nav */}
				<div className="hidden md:flex gap-4 sm:gap-6 items-center">
					{navLinks.map((link) => (
						<button
							key={link.to}
							className={
								"hover:text-accent text-gray-700 font-medium transition-colors px-2 py-1 rounded" +
								(location.pathname === link.to ? " underline text-accent" : "")
							}
							onClick={() => handleNav(link.to)}
						>
							{link.label}
						</button>
					))}
				</div>
				{/* Hamburger (mobile) */}
				<button
					className="md:hidden p-2 rounded-full bg-accent/10 border border-accent/30 shadow flex items-center justify-center"
					onClick={() => setOpen((o) => !o)}
					aria-label="Open navigation menu"
				>
					<Menu size={28} color="#1e293b" />
				</button>
			</div>
			{/* Mobile drawer */}
			{open && (
				<div className="md:hidden mt-2 bg-white/95 border-b border-accent/20 rounded shadow p-2 animate-slide-in-right z-40 absolute left-0 right-0">
					<div className="flex flex-col gap-2">
						{navLinks.map((link) => (
							<button
								key={link.to}
								onClick={() => handleNav(link.to)}
								className={
									"text-left w-full px-2 py-2 rounded hover:bg-accent/10 text-gray-700 font-medium transition-colors" +
									(location.pathname === link.to ? " text-accent underline" : "")
								}
							>
								{link.label}
							</button>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}
