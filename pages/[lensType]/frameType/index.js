import { useRouter } from "next/router";
import { useState } from "react";

const frameOptions = [
  { 
    label: "TR/Acetate Frame", 
    value: "acetate",
    icon: "🕶️",
    description: "Lightweight, durable plastic frames",
    gradient: "from-amber-500 to-orange-600",
    hoverGradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200/60",
    hoverBorderColor: "border-amber-400/80",
    shadowColor: "shadow-amber-500/20"
  },
  { 
    label: "Full Metal Frame", 
    value: "full-metal",
    icon: "⚡",
    description: "Classic metal construction with full rim",
    gradient: "from-slate-500 to-zinc-600",
    hoverGradient: "from-slate-400 to-zinc-500",
    bgGradient: "from-slate-50 to-zinc-50",
    borderColor: "border-slate-200/60",
    hoverBorderColor: "border-slate-400/80",
    shadowColor: "shadow-slate-500/20"
  },
  { 
    label: "Half Metal Frame", 
    value: "half-metal",
    icon: "✨",
    description: "Semi-rimless design with metal accents",
    gradient: "from-blue-500 to-indigo-600",
    hoverGradient: "from-blue-400 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200/60",
    hoverBorderColor: "border-blue-400/80",
    shadowColor: "shadow-blue-500/20"
  },
  { 
    label: "Rimless Frame", 
    value: "rimless",
    icon: "💎",
    description: "Minimalist design with no visible frame",
    gradient: "from-emerald-500 to-teal-600",
    hoverGradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200/60",
    hoverBorderColor: "border-emerald-400/80",
    shadowColor: "shadow-emerald-500/20"
  },
];

export default function FrameTypePage() {
  const router = useRouter();
  const { lensType } = router.query;
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [hoveredFrame, setHoveredFrame] = useState(null);

  const handleSelect = (value) => {
    setSelectedFrame(value);
    localStorage.setItem("frameType", value);
    console.log("Selected frame:", value);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      router.push(`/${lensType}/frameType/lenses`);
    }, 300);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg shadow-blue-400/50"></div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Choose Your Frame Style
              </h1>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-400/50"></div>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Select the perfect frame style that matches your personality and lifestyle
            </p>
          </div>

          {/* Frame Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {frameOptions.map((frame, index) => (
              <div
                key={frame.value}
                className="group relative"
                onMouseEnter={() => setHoveredFrame(frame.value)}
                onMouseLeave={() => setHoveredFrame(null)}
              >
                <button
                  onClick={() => handleSelect(frame.value)}
                  className={`w-full p-6 sm:p-8 rounded-3xl backdrop-blur-lg bg-white/80 border ${frame.borderColor} hover:${frame.hoverBorderColor} shadow-xl hover:${frame.shadowColor} transform hover:scale-105 transition-all duration-500 relative overflow-hidden group`}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${frame.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  {/* Subtle moving gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${frame.gradient} opacity-0 group-hover:opacity-10 transform translate-x-full group-hover:translate-x-0 transition-all duration-700 rounded-3xl`}></div>

                  <div className="relative z-10">
                    {/* Icon and main content */}
                    <div className="text-center mb-4">
                      <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {frame.icon}
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r ${frame.gradient} bg-clip-text text-transparent group-hover:from-slate-800 group-hover:to-slate-900 transition-all duration-300`}>
                        {frame.label}
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                        {frame.description}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    <div className="flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${frame.gradient} shadow-lg ${frame.shadowColor} opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300`}></div>
                    </div>

                    {/* Hover effect arrow */}
                    <div className="absolute top-1/2 right-6 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                      <span className={`text-2xl bg-gradient-to-r ${frame.gradient} bg-clip-text text-transparent`}>→</span>
                    </div>
                  </div>

                  {/* Loading state when selected */}
                  {selectedFrame === frame.value && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <div className={`animate-spin w-6 h-6 border-2 bg-gradient-to-r ${frame.gradient} rounded-full border-t-transparent`}></div>
                        <span className="font-medium text-slate-700">Processing...</span>
                      </div>
                    </div>
                  )}
                </button>

                {/* Floating selection number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom info section */}
          <div className="mt-12 text-center">
            <div className="backdrop-blur-lg bg-white/60 border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <span className="font-semibold text-slate-700">Pro Tip</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Choose based on your lifestyle: Active users prefer lightweight TR frames, 
                professionals often choose metal frames, and minimalists love rimless designs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}