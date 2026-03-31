import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [user, setUser] = useState<{ email?: string; avatar_url?: string; full_name?: string } | null>(null);
  const lastScrollY = useRef(window.scrollY);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url,
          full_name: session.user.user_metadata?.full_name,
        });
      } else {
        setUser(null);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url,
          full_name: session.user.user_metadata?.full_name,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  const UserDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full hover:bg-accent/20 transition-colors p-1" aria-label="User menu">
          <Avatar className="w-8 h-8 border-2 border-accent/40">
            <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'User'} />
            <AvatarFallback className="bg-accent/30 text-white text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium truncate text-foreground">
          {user?.full_name || user?.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
          <Package className="mr-2 h-4 w-4" /> Orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 bg-primary/95 backdrop-blur border-b border-accent/30 shadow-lg transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/ZTech electrictronics logo.png" alt="Ztech Logo" className="w-8 h-8 rounded-full shadow" />
          <span className="font-orbitron font-bold text-lg sm:text-xl text-white">Ztech</span>
          <span className="text-accent text-xs sm:text-sm font-semibold ml-1">Electronics Ltd</span>
        </div>
        <div className="hidden md:flex gap-4 sm:gap-6 items-center">
          <button onClick={() => scrollToSection('home')} className="hover:text-accent text-white font-medium transition-colors">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-accent text-white font-medium transition-colors">About</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-accent text-white font-medium transition-colors">Services</button>
          <button onClick={() => scrollToSection('team')} className="hover:text-accent text-white font-medium transition-colors">Team</button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-accent text-white font-medium transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-accent text-white font-medium transition-colors">FAQ</button>
          <button onClick={() => scrollToSection('whychooseus')} className="hover:text-accent text-white font-medium transition-colors">Why Choose Us</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-accent text-white font-medium transition-colors">Contact</button>
          <a href="/gallery" className="hover:text-accent text-white font-medium transition-colors">Gallery</a>
          <a href="/blog" className="hover:text-accent text-white font-medium transition-colors">Blog</a>
          <a href="/shop" className="hover:text-accent text-white font-medium transition-colors">Shop</a>
          {user ? (
            <UserDropdown />
          ) : (
            <a href="/auth" className="hover:text-accent text-white font-medium transition-colors">Login</a>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-accent/20 text-white transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <button className="md:hidden flex items-center bg-accent/10 rounded-full shadow p-2 border border-accent/30" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
          <svg className="w-7 h-7" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-primary/95 border-b border-accent/20 shadow-md flex flex-col items-start px-6 py-4 gap-3 animate-fade-in z-40">
          <button onClick={() => scrollToSection('home')} className="hover:text-accent text-white font-medium w-full text-left">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-accent text-white font-medium w-full text-left">About</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-accent text-white font-medium w-full text-left">Services</button>
          <button onClick={() => scrollToSection('team')} className="hover:text-accent text-white font-medium w-full text-left">Team</button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-accent text-white font-medium w-full text-left">Pricing</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-accent text-white font-medium w-full text-left">FAQ</button>
          <button onClick={() => scrollToSection('whychooseus')} className="hover:text-accent text-white font-medium w-full text-left">Why Choose Us</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-accent text-white font-medium w-full text-left">Contact</button>
          <a href="/gallery" className="hover:text-accent text-white font-medium w-full text-left">Gallery</a>
          <a href="/blog" className="hover:text-accent text-white font-medium w-full text-left">Blog</a>
          <a href="/shop" className="hover:text-accent text-white font-medium w-full text-left">Shop</a>
          {user ? (
            <>
              <div className="w-full border-t border-accent/20 my-1" />
              <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="flex items-center gap-2 hover:text-accent text-white font-medium w-full text-left">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button onClick={() => { navigate('/orders'); setIsMenuOpen(false); }} className="flex items-center gap-2 hover:text-accent text-white font-medium w-full text-left">
                <Package className="w-4 h-4" /> Orders
              </button>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 hover:text-red-400 text-white font-medium w-full text-left">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <a href="/auth" className="hover:text-accent text-white font-medium w-full text-left">Login</a>
          )}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 hover:text-accent text-white font-medium w-full text-left"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
