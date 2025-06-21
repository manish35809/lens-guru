import React, { useState, useEffect } from 'react';
import { Settings, Calculator, Eye } from 'lucide-react';

const LensGuruFooter = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Simulate localStorage check - replace this with actual localStorage in your Next.js app
  useEffect(() => {
    // For demo purposes, showing the footer
    setIsVisible(true);
    
    // In your actual Next.js app, use this instead:
    /*
    const checkLocalStorage = () => {
      const lensSelection = localStorage.getItem('lensSelection');
      const prescription = localStorage.getItem('prescription');
      setIsVisible(lensSelection && prescription);
    };
    
    checkLocalStorage();
    
    // Optional: Listen for storage changes
    window.addEventListener('storage', checkLocalStorage);
    return () => window.removeEventListener('storage', checkLocalStorage);
    */
  }, []);

  const footerLinks = [
    {
      title: 'Lens Management',
      shortTitle: 'LM',
      href: '/tools/lm',
      icon: Settings,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Lens Price Calculator',
      shortTitle: 'LPC',
      href: '/tools/lpc',
      icon: Calculator,
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Mobile View',
      shortTitle: 'Mobile',
      href: '/sv/frameType/lenses/old',
      icon: Eye,
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Desktop View',
      shortTitle: 'Desktop',
      href: '/sv/frameType/lenses',
      icon: Eye,
      gradient: 'from-blue-500 to-blue-600'
    }
  ];

  if (!isVisible) return null;

  return (
    <footer className="bottom-0 left-0 right-0 z-50 backdrop-blur-2xl bg-gray-950/90 border-t border-gray-800/50">
      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-gray-900/10 to-violet-900/20 pointer-events-none" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gray-700/5 to-transparent pointer-events-none" />
      
      <div className="relative px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center max-w-7xl mx-auto gap-3 sm:gap-0">
          {/* Brand text - Top on mobile, Left on desktop */}
          <div className="flex-shrink-0 text-center sm:text-left">
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Lens Guru
            </span>
          </div>
          
          {/* Navigation Links - Bottom on mobile, Right on desktop */}
          <div className="flex items-center justify-center sm:justify-end">
            {/* Mobile: Grid layout for very small screens */}
            <div className="grid grid-cols-2 gap-2 sm:hidden w-full max-w-xs">
              {footerLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    className="group relative flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 hover:scale-105"
                  >
                    {/* Subtle glow effect */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <IconComponent 
                      size={16} 
                      className={`text-gray-400 group-hover:text-white transition-all duration-300 group-hover:drop-shadow-lg`}
                    />
                    
                    {/* Short label for mobile */}
                    <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors duration-300 text-center leading-tight">
                      {link.shortTitle}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Tablet and Desktop: Horizontal layout */}
            <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
              {footerLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    className="group relative flex items-center space-x-2 px-2 md:px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 hover:scale-105"
                  >
                    {/* Subtle glow effect */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <IconComponent 
                      size={18} 
                      className={`text-gray-400 group-hover:text-white transition-all duration-300 group-hover:drop-shadow-lg`}
                    />
                    
                    {/* Full label for tablet/desktop, hide on smaller tablets */}
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-nowrap hidden md:inline">
                      {link.title}
                    </span>
                    
                    {/* Short label for small tablets */}
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-nowrap md:hidden">
                      {link.shortTitle}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
    </footer>
  );
};

export default LensGuruFooter;
