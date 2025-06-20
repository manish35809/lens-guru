import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Filter, Droplets, Wind, Sun, Eye as EyeIcon, Fingerprint, Zap, Eye, Car, Lightbulb } from 'lucide-react';

const LensFeatures = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      id: 'scratchresistant',
      icon: Shield,
      title: 'Scratch-Resistant Coating',
      emoji: '🛡️',
      description: 'Advanced protective layer that shields your lenses from everyday scratches and abrasions.',
      details: 'Our premium scratch-resistant coating creates an invisible barrier that protects your investment. Whether you\'re placing your glasses on rough surfaces or dealing with accidental drops, this durable coating ensures your lenses maintain crystal-clear vision for years to come.',
      image: '/features/sr.png',
      color: 'from-blue-400 to-purple-600'
    },
    {
      id: 'antiglare',
      icon: Sparkles,
      title: 'Anti-Glare Technology',
      emoji: '🌟',
      description: 'Eliminates reflections and reduces eye strain from digital screens and harsh lighting.',
      details: 'Experience superior visual comfort with our multi-layer anti-reflective coating. This technology minimizes distracting reflections from computer screens, headlights, and fluorescent lights, allowing more light to pass through your lenses for enhanced clarity and reduced eye fatigue.',
      image: '/features/ag.png',
      color: 'from-amber-400 to-orange-600'
    },
    {
      id: 'bluelight',
      icon: Filter,
      title: 'Blue-Violet Light Protection',
      emoji: '🔵',
      description: 'Selectively filters harmful blue-violet wavelengths while preserving beneficial blue light.',
      details: 'Our intelligent blue light filter technology targets specific wavelengths that can cause digital eye strain and sleep disruption. Unlike basic filters that block all blue light, our advanced coating maintains color accuracy while protecting your eyes from potentially harmful high-energy visible light.',
      image: '/features/blf.png',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'waterrepellent',
      icon: Droplets,
      title: 'Hydrophobic Coating',
      emoji: '💧',
      description: 'Water-repellent surface that keeps your vision clear in all weather conditions.',
      details: 'Rain, snow, or humidity won\'t compromise your vision with our hydrophobic coating. Water beads up and rolls off effortlessly, preventing water spots and maintaining optical clarity. Perfect for active lifestyles and unpredictable weather conditions.',
      image: '/features/wr.png',
      color: 'from-teal-400 to-blue-600'
    },
    {
      id: 'dustrepellent',
      icon: Wind,
      title: 'Anti-Static Dust Protection',
      emoji: '🌬️',
      description: 'Prevents dust and debris accumulation through advanced anti-static properties.',
      details: 'Say goodbye to constantly cleaning your lenses. Our anti-static coating reduces the electrostatic charge that attracts dust, pollen, and other airborne particles. This means cleaner lenses throughout the day and less frequent cleaning maintenance.',
      image: '/features/dr.png',
      color: 'from-gray-400 to-slate-600'
    },
    {
      id: 'uvprotection',
      icon: Sun,
      title: 'Complete UV Protection',
      emoji: '🌞',
      description: 'Blocks 100% of harmful UVA and UVB radiation for comprehensive eye protection.',
      details: 'Your eyes deserve the ultimate protection from the sun\'s harmful rays. Our UV-blocking technology provides complete coverage against both UVA and UVB radiation, helping prevent cataracts, macular degeneration, and other UV-related eye conditions.',
      image: '/features/uvp.png',
      color: 'from-yellow-400 to-red-500'
    },
    {
      id: 'photochromic',
      icon: EyeIcon,
      title: 'Photochromic Adaptation',
      emoji: '🕶️',
      description: 'Automatically adjusts tint based on lighting conditions for optimal comfort.',
      details: 'Experience seamless transitions from indoor to outdoor environments. Our photochromic lenses darken in bright sunlight and return to clear indoors, providing continuous protection and comfort without the need to switch between different pairs of glasses.',
      image: '/features/p.png',
      color: 'from-purple-400 to-pink-600'
    },
    {
      id: 'smudgeresistant',
      icon: Fingerprint,
      title: 'Oleophobic Smudge Resistance',
      emoji: '🤏',
      description: 'Repels oils and fingerprints for consistently clear vision.',
      details: 'Our oleophobic coating creates an invisible barrier against skin oils, cosmetics, and fingerprints. This means fewer smudges, easier cleaning, and consistently clear vision throughout your day. Perfect for those who frequently handle their glasses.',
      image: '/features/fr.png',
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 'impactresistant',
      icon: Zap,
      title: 'Impact-Resistant Durability',
      emoji: '🦾',
      description: 'Enhanced safety with virtually unbreakable lens construction.',
      details: 'Built for active lifestyles and demanding environments, our impact-resistant lenses meet the highest safety standards. Whether you\'re playing sports, working in challenging conditions, or simply want peace of mind, these lenses provide exceptional protection against impacts and shattering.',
      image: '/features/u.png',
      color: 'from-red-400 to-rose-600'
    },
    {
      id: 'lowreflection',
      icon: Eye,
      title: 'Low-Reflection Technology',
      emoji: '✨',
      description: 'Minimizes glare and reflections for enhanced visual clarity.',
      details: 'Advanced optical engineering reduces unwanted reflections that can cause eye strain and visual distraction. This technology is particularly beneficial for night driving, computer work, and any situation where clear, unobstructed vision is essential.',
      image: '/features/lr.png',
      color: 'from-indigo-400 to-purple-600'
    },
    {
      id: 'driveplus',
      icon: Car,
      title: 'DrivePlus Enhancement',
      emoji: '🚗',
      description: 'Specialized coating combining UV protection with superior scratch resistance for drivers.',
      details: 'Designed specifically for driving conditions, DrivePlus technology combines enhanced UV protection with premium scratch resistance. This specialized coating reduces glare from wet roads, improves contrast, and provides the durability needed for frequent handling.',
      image: '/features/d.png',
      color: 'from-slate-400 to-gray-600'
    },
    {
      id: 'essentialblue',
      icon: Lightbulb,
      title: 'Essential Blue Light Balance',
      emoji: '💡',
      description: 'Maintains natural color perception while protecting from harmful blue light wavelengths.',
      details: 'Our most advanced blue light technology preserves the beneficial aspects of blue light for healthy circadian rhythms while filtering out potentially harmful wavelengths. This ensures true color clarity and natural vision while providing comprehensive digital eye protection.',
      image: '/features/ebl.png',
      color: 'from-cyan-400 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Advanced Lens Technology
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover our cutting-edge lens coatings and technologies designed to enhance your vision, protect your eyes, and improve your daily life.
          </p>
          <div className="flex justify-center">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <div className="bg-white rounded-xl px-8 py-4">
                <p className="text-gray-700 font-medium">12 Advanced Features • Premium Protection • Enhanced Clarity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Sections */}
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        const isEven = index % 2 === 0;
        
        return (
          <section
            key={feature.id}
            id={feature.id}
            className={`py-20 px-4 sm:px-6 lg:px-8 ${
              isEven ? 'bg-white/30' : 'bg-gradient-to-r from-white/40 to-blue-50/40'
            }`}
          >
            <div className="max-w-7xl mx-auto">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                {/* Content */}
                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-4xl">{feature.emoji}</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                      {feature.title}
                    </h2>
                    
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {feature.details}
                    </p>
                  </div>
                </div>
                
                {/* Image */}
                <div className="flex-1 max-w-lg">
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-300`}></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto rounded-2xl shadow-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">Experience the Difference</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Advanced lens technology designed to enhance your vision and protect your eyes in every environment.
          </p>
          <div className="flex justify-center">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <div className="bg-slate-900 rounded-xl px-8 py-4">
                <p className="text-gray-300">© 2025 Advanced Lens Technology</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LensFeatures;