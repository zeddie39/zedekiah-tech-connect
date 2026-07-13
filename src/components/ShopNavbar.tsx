import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, ArrowLeft, ShoppingBag, Heart, ShoppingCart, LayoutDashboard, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";

const BG = "#0c0818";
const CARD_BG = "#150f28";
const BORDER = "rgba(255,255,255,0.06)";
const ACCENT = "#ff9800";

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
		<nav className="sticky top-0 z-50 w-full backdrop-blur-xl" style={{ background: `${BG}ee`, borderBottom: `1px solid ${BORDER}` }}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
				<div className="flex items-center gap-3">
					{location.pathname !== "/shop" && (
						<button className="mr-1 -ml-2 p-2 rounded-lg text-gray-500 hover:text-[#ff9800] hover:bg-white/[0.03] transition-all"
							onClick={() => navigate(-1)} aria-label="Go back">
							<ArrowLeft size={18} />
						</button>
					)}

					<Link to="/shop" className="flex items-center gap-2.5 group">
						<div className="relative">
							<div className="absolute inset-0 bg-[#ff9800]/15 rounded-full blur-md group-hover:bg-[#ff9800]/25 transition-all" />
							<img src="/ZTech electrictronics logo.png" alt="Ztech" className="w-9 h-9 rounded-full relative z-10 border border-[#ff9800]/25 group-hover:border-[#ff9800]/50 transition-all" />
						</div>
						<span className="font-bold text-base tracking-tight text-[#ff9800] hidden sm:inline-block">
							ZTech Store
						</span>
					</Link>
				</div>

				{/* Desktop nav */}
				<div className="hidden md:flex gap-0.5 items-center">
					{navLinks.map(link => {
						const Icon = link.icon;
						const isActive = location.pathname === link.to;
						return (
							<button key={link.to}
								className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
									isActive ? "text-[#ff9800] bg-[#ff9800]/8" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
								}`}
								onClick={() => handleNav(link.to)}>
								<Icon size={15} />
								{link.label}
								{link.to === "/cart" && cartCount > 0 && (
									<span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-[#ff9800] text-[9px] font-bold text-black px-0.5 shadow shadow-[#ff9800]/30">
										{cartCount > 99 ? "99+" : cartCount}
									</span>
								)}
							</button>
						);
					})}
					<div className="h-6 w-px mx-2" style={{ background: BORDER }} />
					<Button variant="outline" size="sm" className="gap-1.5 text-[13px] bg-transparent text-[#ff9800] hover:bg-[#ff9800]/8"
						style={{ borderColor: `${ACCENT}30` }}
						onClick={() => navigate('/dashboard')}>
						<LayoutDashboard size={14} /> Dashboard
					</Button>
				</div>

				{/* Mobile */}
				<div className="flex items-center gap-1 md:hidden">
					<button className="relative p-2 rounded-lg text-gray-400 hover:text-[#ff9800] hover:bg-white/[0.03] transition-all"
						onClick={() => navigate('/cart')}>
						<ShoppingCart size={18} />
						{cartCount > 0 && (
							<span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-[#ff9800] text-[8px] font-bold text-black px-0.5">
								{cartCount > 99 ? "99+" : cartCount}
							</span>
						)}
					</button>
					<button className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] transition-all"
						onClick={() => setOpen(o => !o)} aria-label="Navigation menu">
						{open ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* Mobile drawer */}
			{open && (
				<div className="md:hidden absolute top-14 left-0 right-0 backdrop-blur-xl shadow-2xl shadow-black/50 z-40"
					style={{ background: `${BG}f5`, borderBottom: `1px solid ${BORDER}` }}>
					<div className="p-3 flex flex-col gap-1">
						{navLinks.map(link => {
							const Icon = link.icon;
							const isActive = location.pathname === link.to;
							return (
								<button key={link.to}
									className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
										isActive ? "text-[#ff9800] bg-[#ff9800]/8" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
									}`}
									onClick={() => handleNav(link.to)}>
									<Icon size={16} />
									{link.label}
									{link.to === "/cart" && cartCount > 0 && (
										<span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#ff9800] text-[10px] font-bold text-black px-1">
											{cartCount}
										</span>
									)}
								</button>
							);
						})}
						<div className="my-1 border-t" style={{ borderColor: BORDER }} />
						<button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-[#ff9800] hover:bg-white/[0.03] transition-all"
							onClick={() => handleNav('/dashboard')}>
							<LayoutDashboard size={16} /> Dashboard
						</button>
					</div>
				</div>
			)}
		</nav>
	);
}
