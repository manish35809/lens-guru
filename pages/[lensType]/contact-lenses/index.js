'use client';

import { useState, useEffect } from 'react';
import { Eye, Mail, Bell, Sparkles, Clock, Star } from 'lucide-react';

export default function ContactLensesComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-300 via-transparent to-yellow-300 opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-green-300 via-transparent to-orange-300 opacity-40"></div>
      </div>

      {/* Floating Blur Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce animation-delay-2000"></div>
      <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-bounce animation-delay-4000"></div>
      <div className="absolute bottom-40 right-40 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Mouse Follower Glow */}
      <div 
        className="fixed pointer-events-none w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-300 ease-out z-10"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Glass Card Container */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 group hover:bg-white/15">
            
            {/* Icon with Glow Effect */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/30 group-hover:scale-110 transition-transform duration-500">
                <Eye className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
              Contact Lenses
            </h1>
            
            {/* Subtitle */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <h2 className="text-xl md:text-2xl text-white/90 font-medium">
                Premium Vision Solutions
              </h2>
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-full font-semibold mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Clock className="w-5 h-5" />
              <span>Coming Soon</span>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Revolutionary contact lens technology designed for ultimate comfort, crystal-clear vision, and all-day wear. Experience the future of eye care.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Star, title: "Premium Materials", desc: "Advanced hydrogel technology" },
                { icon: Eye, title: "Crystal Clear", desc: "Ultra-high definition vision" },
                { icon: Sparkles, title: "All-Day Comfort", desc: "Moisture-lock technology" }
              ].map((feature, index) => (
                <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group/card">
                  <feature.icon className="w-8 h-8 text-blue-300 mb-3 mx-auto group-hover/card:scale-110 transition-transform duration-300" />
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Email Subscription */}
            <div className="max-w-md mx-auto">
              <p className="text-white/80 mb-4">Be the first to know when we launch</p>
              
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 group/btn"
                  >
                    <Bell className="w-4 h-4 group-hover/btn:animate-pulse" />
                    Notify Me
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 py-3 px-6 bg-green-500/20 border border-green-400/30 rounded-xl text-green-300">
                  <Star className="w-5 h-5 animate-spin" />
                  <span>Thank you! We'll notify you soon.</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Floating Elements */}
          <div className="mt-16 flex justify-center gap-8 opacity-60">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Styling for Animations */}
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}