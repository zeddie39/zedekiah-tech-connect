import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, ArrowLeft, ShoppingBag, Heart, ShoppingCart, LayoutDashboard, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
						return (
							<Button
								key={link.to}
								variant={isActive ? "secondary" : "ghost"}
								size="sm"
								className={`gap-2 ${isActive ? "text-primary" : "text-muted-foreground"}`}
								onClick={() => handleNav(link.to)}
							>
								<Icon size={16} />
								{link.label}
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
						onClick={() => navigate('/cart')}
						className="relative"
					>
						<ShoppingCart size={20} />
						{/* Note: Cart count would go here if available via props/context */}
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
							return (
								<Button
									key={link.to}
									variant={isActive ? "secondary" : "ghost"}
									className="justify-start gap-3 w-full"
									onClick={() => handleNav(link.to)}
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
		</nav>
	);
}
