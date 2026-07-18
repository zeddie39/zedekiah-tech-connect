import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, ArrowLeft, ShoppingBag, Heart, ShoppingCart, LayoutDashboard, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import CartDrawer from "@/components/shop/CartDrawer";

const navLinks = [
	{ label: "Shop", to: "/shop", icon: ShoppingBag },
	{ label: "Wishlist", to: "/wishlist", icon: Heart },
	{ label: "Cart", to: "/cart", icon: ShoppingCart },
	{ label: "Orders", to: "/orders", icon: ShoppingBag },
	{ label: "Add Product", to: "/shop/new", icon: PlusCircle },
];

export default function ShopNavbar() {
	const [open, setOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const { cartCount } = useCart();
	const navigate = useNavigate();
	const location = useLocation();

	const handleNav = (to: string) => {
		setOpen(false);
		if (location.pathname !== to) navigate(to);
	};

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
				<div className="flex items-center gap-3">
					{/* Back button, hidden on shop home */}
					{location.pathname !== "/shop" && (
						<Button
							variant="ghost"
							size="icon"
							className="mr-1 -ml-2 text-muted-foreground hover:text-primary"
							onClick={() => navigate(-1)}
							aria-label="Go back"
						>
							<ArrowLeft size={20} />
						</Button>
					)}

					<Link to="/shop" className="flex items-center gap-2 group">
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:bg-primary/40 transition-all" />
							<img src="/ZTech electrictronics logo.png" alt="Ztech" className="w-9 h-9 rounded-full relative z-10 border border-primary/20" />
						</div>
						<span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden sm:inline-block">
							ZTech Store
						</span>
					</Link>
				</div>

				{/* Desktop nav */}
				<div className="hidden md:flex gap-1 items-center">
					{navLinks.map((link) => {
						const Icon = link.icon;
						const isActive = location.pathname === link.to;
						const isCart = link.label === "Cart";
						return (
							<Button
								key={link.to}
								variant={isActive ? "secondary" : "ghost"}
								size="sm"
								className={`gap-2 relative ${isActive ? "text-primary" : "text-muted-foreground"}`}
								onClick={() => {
									if (isCart) {
										setCartOpen(true);
									} else {
										handleNav(link.to);
									}
								}}
							>
								<Icon size={16} />
								{link.label}
								{isCart && cartCount > 0 && (
									<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white animate-scale-in">
										{cartCount}
									</span>
								)}
							</Button>
						);
					})}
					<div className="h-6 w-px bg-border mx-2" />
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
						onClick={() => navigate('/dashboard')}
					>
						<LayoutDashboard size={16} />
						Dashboard
					</Button>
				</div>

				{/* Hamburger (mobile) */}
				<div className="flex items-center gap-2 md:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setCartOpen(true)}
						className="relative text-muted-foreground hover:text-primary"
					>
						<ShoppingCart size={20} />
						{cartCount > 0 && (
							<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white animate-scale-in">
								{cartCount}
							</span>
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setOpen((o) => !o)}
						aria-label="Open navigation menu"
					>
						<Menu size={24} />
					</Button>
				</div>
			</div>

			{/* Mobile drawer */}
			{open && (
				<div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg animate-in slide-in-from-top-2 z-40">
					<div className="p-4 flex flex-col gap-2">
						{navLinks.map((link) => {
							const Icon = link.icon;
							const isActive = location.pathname === link.to;
							const isCart = link.label === "Cart";
							return (
								<Button
									key={link.to}
									variant={isActive ? "secondary" : "ghost"}
									className="justify-start gap-3 w-full"
									onClick={() => {
										if (isCart) {
											setOpen(false);
											setCartOpen(true);
										} else {
											handleNav(link.to);
										}
									}}
								>
									<Icon size={18} />
									{link.label}
								</Button>
							);
						})}
						<div className="my-2 border-t" />
						<Button
							variant="outline"
							className="justify-start gap-3 w-full"
							onClick={() => handleNav('/dashboard')}
						>
							<LayoutDashboard size={18} />
							Back to Dashboard
						</Button>
					</div>
				</div>
			)}

			<CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
		</nav>
	);
}
