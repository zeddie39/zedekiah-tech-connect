import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, ArrowLeft, ShoppingBag, Heart, ShoppingCart, LayoutDashboard, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";

const navLinks = [
	{ label: "Shop", to: "/shop", icon: ShoppingBag },
	{ label: "Wishlist", to: "/wishlist", icon: Heart },
	{ label: "Cart", to: "/cart", icon: ShoppingCart },
	{ label: "Orders", to: "/orders", icon: ShoppingBag },
	{ label: "Add Product", to: "/shop/new", icon: PlusCircle },
];

export default function ShopNavbar() {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { cart } = useCart();
	const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

	const handleNav = (to: string) => {
		setOpen(false);
		if (location.pathname !== to) navigate(to);
	};

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-accent/10 bg-primary/90 backdrop-blur-xl supports-[backdrop-filter]:bg-primary/80">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
				<div className="flex items-center gap-3">
					{/* Back button, hidden on shop home */}
					{location.pathname !== "/shop" && (
						<Button
							variant="ghost"
							size="icon"
							className="mr-1 -ml-2 text-white/60 hover:text-accent hover:bg-white/5"
							onClick={() => navigate(-1)}
							aria-label="Go back"
						>
							<ArrowLeft size={20} />
						</Button>
					)}

					<Link to="/shop" className="flex items-center gap-2.5 group">
						<div className="relative">
							<div className="absolute inset-0 bg-accent/20 rounded-full blur-md group-hover:bg-accent/35 transition-all duration-300" />
							<img src="/ZTech electrictronics logo.png" alt="Ztech" className="w-10 h-10 rounded-full relative z-10 border-2 border-accent/30 group-hover:border-accent/60 transition-all" />
						</div>
						<div className="hidden sm:flex flex-col">
							<span className="font-bold text-lg tracking-tight text-accent leading-tight">
								ZTech Store
							</span>
							<span className="text-[10px] text-white/40 font-medium tracking-widest uppercase -mt-0.5">Premium Electronics</span>
						</div>
					</Link>
				</div>

				{/* Desktop nav */}
				<div className="hidden md:flex gap-1 items-center">
					{navLinks.map((link) => {
						const Icon = link.icon;
						const isActive = location.pathname === link.to;
						return (
							<button
								key={link.to}
								className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
									isActive
										? "text-accent bg-accent/10"
										: "text-white/70 hover:text-white hover:bg-white/5"
								}`}
								onClick={() => handleNav(link.to)}
							>
								<Icon size={16} />
								{link.label}
								{/* Cart badge */}
								{link.to === "/cart" && cartCount > 0 && (
									<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary px-1 shadow-lg shadow-accent/30">
										{cartCount > 99 ? "99+" : cartCount}
									</span>
								)}
								{/* Active indicator */}
								{isActive && (
									<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-accent" />
								)}
							</button>
						);
					})}
					<div className="h-8 w-px bg-white/10 mx-2" />
					<Button
						variant="outline"
						size="sm"
						className="gap-2 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 bg-transparent"
						onClick={() => navigate('/dashboard')}
					>
						<LayoutDashboard size={16} />
						Dashboard
					</Button>
				</div>

				{/* Mobile: Cart + Hamburger */}
				<div className="flex items-center gap-1 md:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate('/cart')}
						className="relative text-white/70 hover:text-accent hover:bg-white/5"
					>
						<ShoppingCart size={20} />
						{cartCount > 0 && (
							<span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-accent text-[9px] font-bold text-primary px-0.5 shadow-lg shadow-accent/30">
								{cartCount > 99 ? "99+" : cartCount}
							</span>
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setOpen((o) => !o)}
						aria-label="Open navigation menu"
						className="text-white/70 hover:text-white hover:bg-white/5"
					>
						{open ? <X size={24} /> : <Menu size={24} />}
					</Button>
				</div>
			</div>

			{/* Mobile drawer */}
			{open && (
				<div className="md:hidden absolute top-16 left-0 right-0 bg-primary/95 backdrop-blur-xl border-b border-accent/10 shadow-2xl shadow-black/50 z-40">
					<div className="p-4 flex flex-col gap-1.5">
						{navLinks.map((link) => {
							const Icon = link.icon;
							const isActive = location.pathname === link.to;
							return (
								<button
									key={link.to}
									className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
										isActive
											? "text-accent bg-accent/10 border border-accent/20"
											: "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
									}`}
									onClick={() => handleNav(link.to)}
								>
									<Icon size={18} />
									{link.label}
									{link.to === "/cart" && cartCount > 0 && (
										<span className="ml-auto min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary px-1">
											{cartCount}
										</span>
									)}
								</button>
							);
						})}
						<div className="my-1.5 border-t border-white/[0.06]" />
						<button
							className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-accent hover:bg-white/5 border border-white/[0.06] transition-all"
							onClick={() => handleNav('/dashboard')}
						>
							<LayoutDashboard size={18} />
							Back to Dashboard
						</button>
					</div>
				</div>
			)}
		</nav>
	);
}
