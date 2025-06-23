import React, { useState, useEffect } from 'react';
import { Settings, Calculator, Eye, Smartphone, Monitor, Layers, Zap, Palette, Lightbulb, Sparkles } from 'lucide-react';

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

  const linkGroups = [
    {
      title: 'Explore Lenses',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      glowColor: 'emerald',
      links: [
        {
          title: 'Coating Features',
          shortTitle: 'Coating',
          href: '/lens-features',
          icon: Layers
        },
        {
          title: 'Progressive Design',
          shortTitle: 'Progressive',
          href: '/pro-design',
          icon: Zap
        },
        {
          title: 'Materials',
          shortTitle: 'Materials',
          href: '/lens-materials',
          icon: Lightbulb
        },
        {
          title: 'Tint Chart',
          shortTitle: 'Tints',
          href: '/lens-tint-chart',
          icon: Palette
        }
      ]
    },
    {
      title: 'View Options',
      gradient: 'from-blue-400 via-indigo-500 to-purple-500',
      glowColor: 'blue',
      links: [
        {
          title: 'Mobile View',
          shortTitle: 'Mobile',
          href: '/sv/frameType/lenses/old',
          icon: Smartphone
        },
        {
          title: 'Table / PC',
          shortTitle: 'Desktop',
          href: '/sv/frameType/lenses',
          icon: Monitor
        }
      ]
    },
    {
      title: 'Useful Tools',
      gradient: 'from-purple-400 via-pink-500 to-rose-500',
      glowColor: 'purple',
      links: [
        {
          title: 'Lens Management',
          shortTitle: 'LM',
          href: '/tools/lm',
          icon: Settings
        },
        {
          title: 'Lens Price Calculator',
          shortTitle: 'LPC',
          href: '/tools/lpc',
          icon: Calculator
        }
      ]
    }
  ];

  if (!isVisible) return null;

  return (
    <footer className="relative bottom-0 left-0 right-0 z-50 overflow-hidden">
      {/* Advanced background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/98 to-black/95 backdrop-blur-3xl" />
      
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 animate-pulse" />
      
      {/* Floating orbs effect */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
      
      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Brand Section with enhanced styling */}
          <div className="flex items-center justify-center sm:justify-start mb-8 sm:mb-10">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Sparkles className="w-7 h-7 text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Lens Guru
                </h2>
                <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                  Vision Technology
                </p>
              </div>
            </div>
          </div>
          
          {/* Link Groups with enhanced modern styling */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {linkGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="relative group/section">
                {/* Group container with glass effect */}
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/[0.08]">
                  {/* Floating gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${group.gradient} opacity-0 group-hover/section:opacity-5 rounded-2xl transition-opacity duration-700`} />
                  
                  {/* Group Title with enhanced styling */}
                  <div className="relative mb-6">
                    <h3 className={`text-base font-bold bg-gradient-to-r ${group.gradient} bg-clip-text text-transparent uppercase tracking-wide mb-1`}>
                      {group.title}
                    </h3>
                    <div className={`h-0.5 w-12 bg-gradient-to-r ${group.gradient} rounded-full opacity-70`} />
                  </div>
                  
                  {/* Links with modern styling */}
                  <div className="relative space-y-1">
                    {group.links.map((link, linkIndex) => {
                      const IconComponent = link.icon;
                      return (
                        <a
                          key={linkIndex}
                          href={link.href}
                          className="group/link relative flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg"
                        >
                          {/* Link glow effect */}
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${group.gradient} opacity-0 group-hover/link:opacity-10 transition-opacity duration-300`} />
                          
                          {/* Icon container with modern styling */}
                          <div className="relative">
                            <div className={`absolute inset-0 bg-gradient-to-r ${group.gradient} rounded-lg blur-sm opacity-0 group-hover/link:opacity-30 transition-opacity duration-300`} />
                            <div className="relative bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20 group-hover/link:border-white/30 transition-colors duration-300">
                              <IconComponent 
                                size={16} 
                                className="text-gray-300 group-hover/link:text-white transition-colors duration-300"
                              />
                            </div>
                          </div>
                          
                          {/* Link text with enhanced typography */}
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-gray-300 group-hover/link:text-white transition-colors duration-300 block">
                              <span className="hidden sm:inline">{link.title}</span>
                              <span className="sm:hidden">{link.shortTitle}</span>
                            </span>
                          </div>
                          
                          {/* Arrow indicator */}
                          <div className="opacity-0 group-hover/link:opacity-100 transform translate-x-2 group-hover/link:translate-x-0 transition-all duration-300">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Copyright Section with modern styling */}
          <div className="relative mt-12 pt-8 border-t border-white/10">
            <div className="text-center space-y-3">
              <div className="text-sm text-gray-400 font-medium">
                © {new Date().getFullYear()} Lens Guru. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent with animated gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
    </footer>
  );
};

export default LensGuruFooter;