import { useState } from "react";
import { Clock, Award, Star } from "lucide-react";
import Link from "next/link";
import WhatsAppShareButton from "./WhatsappShare";

export default function LensCard({ lens, index, userLensType, prescription, compact = false }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Feature descriptions for tooltips
  const featureDescriptions = {
    resistScratches:
      "Advanced scratch-resistant coating protects your lenses from daily wear and tear",
    reducesGlare:
      "Anti-reflective coating reduces glare from screens and bright lights",
    filterBlueVioletLight:
      "Filters harmful blue-violet light while allowing beneficial blue light",
    repelsWater: "Hydrophobic coating makes water bead up and roll off easily",
    repelsDust: "Anti-static properties reduce dust and dirt accumulation",
    sunUvProtection: "Blocks 100% of harmful UV rays to protect your eyes",
    photochromic: "Automatically darkens in sunlight and clears indoors",
    resistSmudges: "Oleophobic coating resists fingerprints and smudges",
    unbreakable: "Impact-resistant material for enhanced safety and durability",
    lowReflection: "Minimizes glare and reduces eye strain",
    drivePlus: "Enhanced UV protection and scratch resistance",
    extendedDurability:
      "Built to withstand the test of time with enhanced materials that resist wear and tear from daily use.",
  };

  const features = [
    {
      key: "resistScratches",
      id: "scratchresistant",
      label: "Scratch Resistant",
      color: "blue",
      icon: "filter",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      key: "reducesGlare",
      id: "antiglare",
      label: "Anti-Glare",
      color: "purple",
      icon: "sun",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      key: "filterBlueVioletLight",
      id: "bluelight",
      label: "Blue Light Filter",
      color: "indigo",
      icon: "eye",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      key: "repelsWater",
      id: "waterrepellent",
      label: "Water Repellent",
      color: "cyan",
      icon: "droplets",
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      key: "photochromic",
      id: "photochromic",
      label: "Photochromic",
      color: "amber",
      icon: "palette",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      key: "sunUvProtection",
      id: "uvprotection",
      label: "UV Protection",
      color: "orange",
      icon: "sun-dim",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      key: "resistSmudges",
      id: "smudgeresistant",
      label: "Smudge Resistant",
      color: "green",
      icon: "fingerprint",
      gradient: "from-green-500 to-green-600",
    },
    {
      key: "repelsDust",
      id: "dustrepellent",
      label: "Dust Repellent",
      color: "pink",
      icon: "wind",
      gradient: "from-pink-500 to-pink-600",
    },
    {
      key: "lowReflection",
      id: "lowreflection",
      label: "Low Reflection",
      color: "blue",
      icon: "lowReflex",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      key: "drivePlus",
      id: "driveplus",
      label: "Drive+",
      color: "purple",
      icon: "drive",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      key: "unbreakable",
      id: "impactresistant",
      label: "Unbreakable",
      color: "red",
      icon: "shield-check",
      gradient: "from-red-500 to-red-600",
    },
    {
      key: "extendedDurability",
      id: "extendedDurability",
      label: "Extended Durability",
      color: "indigo",
      icon: "shield",
      gradient: "from-indigo-500 to-indigo-600",
    },
  ];

  const availableFeatures = features.filter(feature => lens[feature.key]);

  return (
    <div
      className="bg-white/90 backdrop-blur-sm group transform hover:-translate-y-1 hover:scale-[1.02] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-200/50 hover:border-blue-300/50 h-fit"
      style={{
        animation: `slideInFromBottom 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="flex flex-col h-full">

        {/* Content Section */}
        <div className={`p-4 flex-1 flex flex-col ${compact ? 'space-y-3' : 'space-y-4'}`}>
          {/* Header Section */}
          <div className="space-y-3">
            <div>
  <div className="flex items-start justify-between gap-4">
    <h3
      className={`
        font-black leading-tight tracking-tight 
        flex-1 animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
        bg-clip-text text-transparent
        ${compact ? 'text-base sm:text-lg md:text-xl' : 'text-lg sm:text-xl md:text-2xl'}
      `}
    >
      {lens.name}
    </h3>
    <div className="flex-shrink-0 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs font-bold rounded-lg shadow-md text-center">
      {lens.brand}
    </div>
  </div>
</div>

            {/* Price Section */}
{/* Price Section */}
<div className="relative group">
  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
  <div className="relative flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200/50 shadow-md transition-all duration-300 hover:shadow-lg hover:border-emerald-200/50">
    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-l-xl opacity-60"></div>

    {/* Left Side - SRP */}
    <div className="flex flex-col relative z-10">
      <div className="text-gray-500 text-xs font-medium mb-1">SRP</div>
      <div className="flex items-baseline space-x-2">
        <span className={`text-gray-900 font-bold ${compact ? 'text-lg' : 'text-xl'}`}>
          ₹{lens.srp.toLocaleString()}
        </span>
        <div className="w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
      </div>
    </div>

    {/* Right Side - Best Price & Country */}
    <div className="flex flex-col items-center relative z-10">
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm mb-2">
        Best Price
      </div>
      <div className="flex items-center gap-1 text-xs text-center">
        <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
        <span className="font-semibold text-slate-700 truncate">
          Made in {lens.lensMaterialCountry}
        </span>
      </div>
    </div>
  </div>
</div>


          </div>

          {/* Key Info Grid */}
          <div className={`grid grid-cols-3 gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {/* Index */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/60 p-2 text-center">
              <div className="flex items-center justify-center mb-1">
                <Award size={compact ? 12 : 14} className="text-amber-600" />
              </div>
              <div className="text-amber-600 font-semibold text-xs">Index</div>
              <div className="font-bold text-slate-900">{lens.thickness.index}</div>
            </div>

            {/* Warranty */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/60 p-2 text-center">
              <div className="flex items-center justify-center mb-1">
                <Star size={compact ? 12 : 14} className="text-emerald-600" />
              </div>
              <div className="text-emerald-600 font-semibold text-xs">Warranty</div>
              <div className="font-bold text-slate-900">{lens.lensCoatingWarranty}M</div>
            </div>

            {/* Delivery */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60 p-2 text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock size={compact ? 12 : 14} className="text-blue-600" />
              </div>
              <div className="text-blue-600 font-semibold text-xs">
                {lens.time === "0" ? "Available" : "Days"}
              </div>
              <div className="font-bold text-slate-900">
                {lens.time === "0" ? "Today" : lens.time}
              </div>
            </div>
          </div>

          {/* Protection Features */}
          {availableFeatures.length > 0 && (
            <div className="space-y-2">
              <h4 className={`font-bold text-gray-900 flex items-center gap-2 ${compact ? 'text-sm' : 'text-base'}`}>
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Features
              </h4>

              <div className={`grid gap-2 ${
                compact 
                  ? availableFeatures.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
                  : availableFeatures.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'
              }`}>
                {availableFeatures.map((feature) => (
                  <Link
                    key={feature.key}
                    href={`/lens-features#${feature.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      className={`group relative flex flex-col items-center justify-center rounded-xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-help hover:shadow-md hover:scale-105 ${
                        compact ? 'p-2 min-h-[70px]' : 'p-3 min-h-[80px]'
                      }`}
                      onMouseEnter={() => setHoveredFeature(feature.key)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      {/* Icon Container */}
                      <div
                        className={`flex items-center justify-center rounded-xl mb-1 transition-all duration-300 group-hover:scale-110 bg-gradient-to-r ${feature.gradient} shadow-md ${
                          compact ? 'w-6 h-6' : 'w-8 h-8'
                        }`}
                      >
                        {/* Icon SVGs */}
                        {feature.icon === "shield" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        )}
                        {feature.icon === "filter" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                          </svg>
                        )}
                        {feature.icon === "sun" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        )}
                        {feature.icon === "eye" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                        {feature.icon === "droplets" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7.5 3.375c0 8.485 6.709 15.359 14.994 15.359 0-8.485-6.709-15.359-14.994-15.359z"
                            />
                          </svg>
                        )}
                        {feature.icon === "palette" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z"
                            />
                          </svg>
                        )}
                        {feature.icon === "sun-dim" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                          </svg>
                        )}
                        {feature.icon === "fingerprint" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                            />
                          </svg>
                        )}
                        {feature.icon === "wind" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 010 6h-1m8-6h1a3 3 0 010 6h-1m-9-6h1a3 3 0 010 6h-1"
                            />
                          </svg>
                        )}
                        {feature.icon === "shield-check" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        )}
                        {feature.icon === "drive" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        )}
                        {feature.icon === "lowReflex" && (
                          <svg
                            className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Feature Label */}
                      <span className={`font-bold text-center leading-tight text-gray-700 group-hover:text-gray-900 transition-colors duration-300 ${
                        compact ? 'text-xs' : 'text-xs'
                      }`}>
                        {feature.label}
                      </span>

                      {/* Enhanced Tooltip */}
                      {hoveredFeature === feature.key && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-2xl z-30 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="text-center font-medium">
                            {featureDescriptions[feature.key]}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                
              </div>
            </div>
          )}

          {/* Photochromic Colors */}
          {lens.photochromic && lens.photochromicColors && lens.photochromicColors.length > 0 && (
            <div className="space-y-2">
              <h4 className={`font-bold text-gray-900 flex items-center gap-2 ${compact ? 'text-sm' : 'text-base'}`}>
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Colors
              </h4>
              <div className="flex flex-wrap gap-1">
                {lens.photochromicColors.map((color, colorIndex) => {
                  const colorMap = {
                    blue: "#3b82f6",
                    green: "#10b981",
                    brown: "#92400e",
                    gray: "#6b7280",
                    grey: "#6b7280",
                    black: "#374151",
                    purple: "#8b5cf6",
                    pink: "#ec4899",
                    red: "#ef4444",
                    orange: "#f97316",
                    yellow: "#eab308",
                  };

                  const normalizedColor = color.toLowerCase().replace("grey", "gray");
                  const colorHex = colorMap[normalizedColor] || "#6b7280";

                  return (
                    <div
                      key={colorIndex}
                      className={`flex items-center gap-1 px-2 py-1 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-default ${
                        compact ? 'text-xs' : 'text-sm'
                      }`}
                    >
                      <div
                        className={`rounded-full ring-1 ring-gray-200 ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
                        style={{ backgroundColor: colorHex }}
                      ></div>
                      <span className="text-gray-800 truncate">{color}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto space-y-2">
            {userLensType === "mf-progressive" && lens.name.includes("Pro") && (
              <Link
                href="/pro-design"
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 relative overflow-hidden group block text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                  Compare Lens Design
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
            )}

            <WhatsAppShareButton lens={lens} prescription={prescription} compact={compact} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}