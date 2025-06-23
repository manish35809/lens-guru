import React, { useState, useEffect } from "react";
import {
  Eye,
  Shield,
  Palette,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

const LensTypesPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const lensTypes = [
    {
      id: 1,
      emoji: "🌟",
      icon: Eye,
      heading: "Standard Clear Vision",
      title: "Clear Lenses",
      description:
        "Clear lenses are ideal for indoor and low-glare environments, offering natural, distortion-free vision. They do not include any tints or coatings to filter light, making them the most economical and basic lens option.",
      gradient: "from-slate-400 via-gray-300 to-zinc-400",
      glowColor: "from-white/20 to-gray-300/20",
      bgGlow: "from-gray-400/10 to-slate-500/10",
    },
    {
      id: 2,
      emoji: "👁️",
      icon: Shield,
      heading: "Protective Blue Light Filtering",
      title: "Blue Cut Lenses",
      description:
        "Blue Cut lenses reduce eye strain by filtering out harmful blue-violet light emitted from screens, LED lights, and digital devices. Perfect for students, office workers, and anyone with heavy screen exposure.",
      gradient: "from-blue-400 via-cyan-500 to-indigo-500",
      glowColor: "from-blue-400/20 to-cyan-500/20",
      bgGlow: "from-blue-500/10 to-indigo-500/10",
    },
    {
      id: 3,
      emoji: "🎨",
      icon: Zap,
      heading: "Light-Adaptive for All Environments",
      title: "Photochromic Lenses",
      description:
        "These lenses automatically darken in sunlight and return to clear indoors. Photochromic lenses provide seamless protection against UV rays while offering the convenience of glasses and sunglasses in one.",
      gradient: "from-purple-400 via-violet-500 to-fuchsia-500",
      glowColor: "from-purple-400/20 to-fuchsia-500/20",
      bgGlow: "from-purple-500/10 to-fuchsia-500/10",
    },
    {
      id: 4,
      emoji: "🛡️",
      icon: Shield,
      heading: "Impact-Resistant Safety Lenses",
      title: "Unbreakable Lenses",
      description:
        "Made from toughened polycarbonate or advanced plastic, unbreakable lenses are highly durable and shatterproof. They're ideal for kids, sports users, and individuals with active lifestyles.",
      gradient: "from-emerald-400 via-teal-500 to-green-500",
      glowColor: "from-emerald-400/20 to-teal-500/20",
      bgGlow: "from-emerald-500/10 to-green-500/10",
    },
    {
      id: 5,
      emoji: "🖌️",
      icon: Palette,
      heading: "Custom-Tint Your Look",
      title: "Tintable Lenses",
      description:
        "Tintable lenses can be permanently dyed in a variety of colors to suit your style or medical needs (e.g., for light sensitivity). Often used in fashion, driving, or occupational lenses where a fixed tint is desired.",
      gradient: "from-rose-400 via-pink-500 to-orange-500",
      glowColor: "from-rose-400/20 to-orange-500/20",
      bgGlow: "from-pink-500/10 to-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/5 to-pink-500/8 animate-pulse" />

        {/* Dynamic floating orbs */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${20 + Math.sin(Date.now() / 3000) * 10}%`,
            top: `${10 + Math.cos(Date.now() / 4000) * 15}%`,
          }}
        />
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: `${15 + Math.cos(Date.now() / 5000) * 12}%`,
            top: `${30 + Math.sin(Date.now() / 6000) * 20}%`,
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/12 to-indigo-500/12 rounded-full blur-2xl animate-pulse delay-2000"
          style={{
            left: `${60 + Math.sin(Date.now() / 7000) * 8}%`,
            bottom: `${20 + Math.cos(Date.now() / 8000) * 10}%`,
          }}
        />
      </div>

      {/* Mouse follower effect */}
      <div
        className="absolute w-64 h-64 bg-gradient-radial from-gray-400/8 to-transparent rounded-full blur-2xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              </div>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Premium Vision Solutions
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Discover Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Lens Solution
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Explore our advanced lens technologies designed for modern
              lifestyles. From crystal-clear vision to adaptive protection, find
              the perfect match for your needs.
            </p>
          </div>

          {/* Lens Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {lensTypes.map((lens, index) => {
              const IconComponent = lens.icon;
              return (
                <div
                  key={lens.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredCard(lens.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Card Container */}
                  <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 hover:border-gray-300/60 transition-all duration-500 hover:bg-white/90 group-hover:scale-[1.02] group-hover:shadow-2xl">
                    {/* Floating gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${lens.bgGlow} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-700`}
                    />

                    {/* Glow effect on hover */}
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${lens.glowColor} opacity-0 group-hover:opacity-50 rounded-3xl blur-xl transition-opacity duration-500`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          {/* Emoji */}
                          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                            {lens.emoji}
                          </div>

                          {/* Icon Container */}
                          <div className="relative">
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${lens.gradient} rounded-xl blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                            />
                            <div className="relative bg-gray-100/80 p-3 rounded-xl backdrop-blur-sm border border-gray-200/60 group-hover:border-gray-300/70 transition-all duration-300">
                              <IconComponent
                                size={20}
                                className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Premium badge */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        </div>
                      </div>

                      {/* Title Section */}
                      <div className="mb-6">
                        <h3
                          className={`text-xl font-bold bg-gradient-to-r ${lens.gradient} bg-clip-text text-transparent mb-2`}
                        >
                          {lens.title}
                        </h3>
                        <h4 className="text-lg font-semibold text-gray-800 leading-tight">
                          {lens.heading}
                        </h4>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed mb-8 group-hover:text-gray-700 transition-colors duration-300">
                        {lens.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16 sm:mt-20">
            <div className="relative inline-block">
              <Link
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                href="/lens-features"
              >
                <span className="relative z-10">Explore All Lens Features</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              {/* Button glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LensTypesPage;
