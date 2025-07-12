import { useState } from "react";
import { ShieldCheck, Clock, Award, Star } from "lucide-react";
import Link from "next/link";

export default function LensCardOld({ lens, index, userLensType }) {
  const [priceVisible, setPriceVisible] = useState(false);

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
    allowEssentialBlueLight: "Allows essential blue light to pass through",
  };

  return (
    <div
      key={lens.id}
      onClick={() => setPriceVisible(!priceVisible)}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-200/50 hover:border-blue-300/50 group"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section - Enhanced */}
        <div className="lg:w-1/3 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <img
            src={lens.poster}
            alt={lens.name}
            className="w-full h-56 sm:h-64 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Discount Badge - Touch & Desktop Friendly */}
{priceVisible && (
  <div className="absolute top-3 left-3 transition-opacity duration-500 ease-in-out opacity-100 z-10">
    <div className="relative">
      <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-3 py-1.5 rounded-2xl text-sm font-bold shadow-2xl border border-white/20">
        <span className="text-xs font-medium">SAVE</span>
        <div className="text-lg font-black leading-none">
          {Math.round((1 - lens.specialPrice / lens.srp) * 100)}%
        </div>
      </div>
    </div>
  </div>
)}


          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Content Section */}
        <div className="lg:w-2/3 p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {lens.name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-600">
                <span className="font-semibold text-blue-600">
                  {lens.brand} (Made in {lens.lensMaterialCountry})
                </span>
                <span className="hidden sm:inline">•</span>
              </div>
            </div>

            {/* Price Section - Responsive width */}
            <div className="relative group flex flex-col bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200/50 transition-all duration-300 ease-in-out text-center shadow-lg">
              {/* Price Block */}
              <div className="flex flex-col space-y-2">
                {/* SRP with strong emphasis */}
                <div className="text-gray-700 text-3xl font-bold">
                  SRP:&nbsp;
                  <span
                    className={`text-purple-600 font-bold ${
                      priceVisible ? "line-through" : ""
                    }`}
                  >
                    ₹{lens.srp.toLocaleString()}
                  </span>
                </div>

                {/* Special Price - hidden by default, appears on hover */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    priceVisible ? "h-auto opacity-100 mt-1" : "h-0 opacity-0"
                  }`}
                >
                  <div className="text-5xl font-black text-green-600">
                    ₹{lens.specialPrice.toLocaleString()}
                  </div>
                </div>

                {/* Save Amount - appears on hover */}
                <div
                  className={`transition-opacity duration-500 ease-in-out ${
                    priceVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="text-lg text-green-700 font-bold bg-green-100 px-3 py-1 rounded-lg inline-block">
                    Save ₹{(lens.srp - lens.specialPrice).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features - Improved Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Delivery
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900">
                  {lens.time} days
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
              <div className="p-2 bg-amber-500 rounded-xl">
                <Award size={18} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                  Index
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900">
                  {lens.thickness.index} ({lens.thickness.type})
                </div>
              </div>
            </div>

            {lens.authenticityCard && (
              <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100">
                <div className="p-2 bg-green-500 rounded-xl">
                  <ShieldCheck size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xs font-medium text-green-600 uppercase tracking-wide">
                    Authentic
                  </div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">
                    Verified
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Star size={18} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                  Warranty
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900">
                  {lens.lensCoatingWarranty} Months
                </div>
              </div>
            </div>
          </div>

          {/* Protection Features - Completely Redesigned */}
          {/* Protection Features */}
          <div className="mb-4">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Protection Features
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  key: "resistScratches",
                  id: "scratchresistant",
                  label: "Scratch Resistant",
                  color: "blue",
                  icon: "shield",
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
                  key: "allowEssentialBlueLight",
                  id: "essentialblue",
                  label: "Essential Blue Light",
                  color: "indigo",
                  icon: "filter",
                  gradient: "from-indigo-500 to-indigo-600",
                },
              ].map((feature) => {
                if (!lens[feature.key]) return null;

                return (
                  <Link
                    key={feature.key}
                    href={`/lens-features#${feature.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      key={feature.key}
                      className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-help hover:shadow-lg hover:scale-105 min-h-[100px] sm:min-h-[120px]"
                      onMouseEnter={() => setHoveredFeature(feature.key)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      {/* Icon Container - Redesigned */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl mb-2 transition-all duration-300 group-hover:scale-110 bg-gradient-to-r ${feature.gradient} shadow-lg`}
                      >
                        {/* Icon SVGs - Same as before but with adjusted size */}
                        {feature.icon === "shield" && (
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.68 2.68M10 11a1 1 0 100-2M14 11a1 1 0 100-2h3a1 1 0 100 2h-3z"
                            />
                          </svg>
                        )}
                        {feature.icon === "drive" && (
                          <svg
                            className="w-4 h-4 text-white"
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
                            className="w-4 h-4 text-white"
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
                        {feature.icon === "sun" && (
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                      </div>

                      {/* Feature Label */}
                      <span className="text-xs sm:text-sm font-bold text-center leading-tight text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        {feature.label}
                      </span>

                      {/* Enhanced Tooltip - Mobile Optimized */}
                      {hoveredFeature === feature.key && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-2xl z-20 w-48 sm:w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="text-center font-medium">
                            {featureDescriptions[feature.key]}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Photochromic Colors - Enhanced */}
          {lens.photochromic && lens.photochromicColors.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Available Colors
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {lens.photochromicColors.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-800 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 transition-all duration-200 cursor-default"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {userLensType === "mf-progressive" && lens.name.includes("Pro") && (
            <Link
              href="/pro-design"
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Compare Lens Design
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
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
        </div>
      </div>
    </div>
  );
}
