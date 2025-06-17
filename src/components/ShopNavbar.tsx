import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
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
		<nav className="w-full px-2 sm:px-3 py-3 sm:py-4 bg-primary text-white shadow sticky top-0 z-20">
			<div className="max-w-6xl mx-auto flex items-center justify-between">
				<div
					className="font-bold text-base sm:text-lg cursor-pointer font-orbitron flex items-center gap-2 sm:gap-3"
					onClick={() => handleNav("/shop")}
				>
					<img
						src="/ztech%20logo.jpg"
						alt="Ztech Logo"
						className="w-7 h-7 sm:w-8 sm:h-8"
					/>
					<span>Zedekiah Shop</span>
				</div>
				{/* Desktop nav */}
				<div className="hidden md:flex gap-4 sm:gap-6 items-center">
					{navLinks.map((link) => (
						<button
							key={link.to}
							className={
								"hover:underline hover:text-accent transition-all px-1 py-1 text-xs sm:text-base" +
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
					className="md:hidden p-2 rounded hover:bg-accent/10"
					onClick={() => setOpen((o) => !o)}
					aria-label="Open navigation menu"
				>
					<Menu size={24} />
				</button>
			</div>
			{/* Mobile drawer */}
			{open && (
				<div className="md:hidden mt-2 bg-primary/95 rounded shadow p-2 animate-slide-in-right z-30 absolute left-0 right-0">
					<div className="flex flex-col gap-2">
						{navLinks.map((link) => (
							<button
								key={link.to}
								onClick={() => handleNav(link.to)}
								className={
									"text-left w-full px-1 py-2 rounded hover:bg-accent/20 text-xs sm:text-base" +
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
