import React, { useState, useEffect } from 'react';
import {
  Settings,
  Calculator,
  Smartphone,
  Monitor,
  Layers,
  Zap,
  Palette,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const LensGuruFooter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsVisible(true);

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const linkGroups = [
    {
      title: 'Explore Lenses',
      links: [
        { title: 'Coating Features', shortTitle: 'Coating', href: '/lens-features', icon: Layers },
        { title: 'Progressive Design', shortTitle: 'Progressive', href: '/pro-design', icon: Zap },
        { title: 'Materials', shortTitle: 'Materials', href: '/lens-materials', icon: Lightbulb },
        { title: 'Tint Chart', shortTitle: 'Tints', href: '/lens-tint-chart', icon: Palette },
      ],
    },
    {
      title: 'View Options',
      links: [
        { title: 'Mobile View', shortTitle: 'Mobile', href: '/sv/frameType/lenses/old', icon: Smartphone },
        { title: 'Table / PC', shortTitle: 'Desktop', href: '/sv/frameType/lenses', icon: Monitor },
      ],
    },
    {
      title: 'Useful Tools',
      links: [
        { title: 'Lens Management', shortTitle: 'LM', href: '/tools/lm', icon: Settings },
        { title: 'Lens Price Calculator', shortTitle: 'LPC', href: '/tools/lpc', icon: Calculator },
      ],
    },
  ];

  if (!isVisible) return null;

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 py-10 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {linkGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link, i) => {
                  const Icon = link.icon;
                  const isDisabled = !user;

                  return (
                    <li key={i}>
                      <a
                        href={isDisabled ? undefined : link.href}
                        onClick={(e) => {
                          if (isDisabled) e.preventDefault();
                        }}
                        className={`flex items-center space-x-3 transition-colors ${
                          isDisabled
                            ? 'cursor-not-allowed text-gray-500'
                            : 'hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">
                          <span className="hidden sm:inline">{link.title}</span>
                          <span className="sm:hidden">{link.shortTitle}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Lens Guru. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default LensGuruFooter;
