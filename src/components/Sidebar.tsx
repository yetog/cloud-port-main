
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navLinks: NavLink[] = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Apps', href: '#apps' },
    { name: 'Contact', href: '#contact' },
  ];

  // Handle intersection observer for scroll spy
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    sections.forEach((section) => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 glass-panel"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Sidebar - desktop & tablet shown by default, mobile shown when isOpen */}
      <aside 
        className={`fixed z-40 h-screen bg-apple-black/90 backdrop-blur-lg border-r border-white/10 transition-all duration-300 
                   w-16 md:w-64 text-white ${isOpen ? 'left-0' : '-left-full md:left-0'}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="mb-8 text-center">
            <h2 className="font-bold text-lg md:text-xl tracking-tight hidden md:block">Isayah Young-Burke</h2>
            <p className="text-xs text-gray-400 mt-1 hidden md:block">Infrastructure & Cloud Consultant</p>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-center md:justify-start p-3 rounded-lg transition-colors
                              ${activeSection === link.href.substring(1) 
                                ? 'bg-white/20 text-white' 
                                : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    {link.icon && <span className="mr-3">{link.icon}</span>}
                    <span className="hidden md:block">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto text-center hidden md:block">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Isayah Young-Burke
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
