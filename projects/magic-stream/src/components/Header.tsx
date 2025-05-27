
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Film, Music, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-8 py-4 backdrop-blur-lg",
        isScrolled ? "bg-media-black/80 shadow-lg" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-media-red">
            <span className="text-white font-semibold">M</span>
            <div className="absolute inset-0 rounded-full border border-media-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-subtle"></div>
          </div>
          <span className="text-media-silver font-semibold text-xl tracking-tight">MediaStream</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" icon={<Home size={18} />} label="Home" isActive={location.pathname === '/'} />
          <NavLink to="/videos" icon={<Film size={18} />} label="Videos" isActive={location.pathname === '/videos'} />
          <NavLink to="/music" icon={<Music size={18} />} label="Music" isActive={location.pathname === '/music'} />
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-media-silver hover:text-white transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden fixed inset-0 bg-media-black/95 backdrop-blur-md z-40 transition-transform duration-300 ease-in-out pt-20",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col items-center space-y-8 p-6">
          <MobileNavLink to="/" icon={<Home size={24} />} label="Home" isActive={location.pathname === '/'} />
          <MobileNavLink to="/videos" icon={<Film size={24} />} label="Videos" isActive={location.pathname === '/videos'} />
          <MobileNavLink to="/music" icon={<Music size={24} />} label="Music" isActive={location.pathname === '/music'} />
        </nav>
      </div>
    </header>
  );
};

// Desktop NavLink component
const NavLink = ({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "group flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:text-white",
      isActive ? "text-white" : "text-media-silver"
    )}
  >
    <span className={cn(
      "transition-colors duration-200 group-hover:text-media-red",
      isActive ? "text-media-red" : ""
    )}>
      {icon}
    </span>
    <span className="relative">
      {label}
      <span className={cn(
        "absolute -bottom-1 left-0 w-0 h-[2px] bg-media-red transition-all duration-300 group-hover:w-full",
        isActive ? "w-full" : ""
      )}></span>
    </span>
  </Link>
);

// Mobile NavLink component
const MobileNavLink = ({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center space-y-2 transition-all duration-200",
      isActive ? "text-white" : "text-media-silver hover:text-white"
    )}
  >
    <span className={cn(
      "p-3 rounded-full",
      isActive ? "bg-media-red text-white" : "bg-media-dark-gray hover:bg-media-red/10"
    )}>
      {icon}
    </span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default Header;
