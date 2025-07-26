import { useState, useRef } from "react";
import { Clock, Award, Star } from "lucide-react";
import Link from "next/link";
import WhatsAppShareButton from "./WhatsappShare";

export default function LensCard({ lens, index, userLensType, prescription }) {
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

  return (
    <div
      key={lens.id}
      className="flex-none w-96 bg-white/80 backdrop-blur-sm group transform hover:-translate-y-2 hover:scale-[1.02] rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-200/50 hover:border-blue-300/50"
      style={{
        animation: `slideInFromRight 0.6s ease-out ${index * 0.1}s both`,
        minWidth: "384px",
      }}
    >
      <div className="flex flex-col">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 h-48">
          <img
            src={lens.poster}
            alt={lens.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col justify-between mb-4 gap-3">
            <div className="flex-1 min-w-0 mb-2">
              <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight line-clamp-2 tracking-tight">
                {lens.name}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-center justify-center px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-bold rounded-lg shadow-md shadow-blue-500/25 text-center">
                  {lens.brand}
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                  <span className="font-semibold text-slate-700">
                    Made in {lens.lensMaterialCountry}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="relative group">
              {/* Subtle Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

              {/* Main Price Container */}
              <div className="relative flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/50 shadow-lg shadow-gray-900/5 transition-all duration-300 ease-out cursor-pointer hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200/50 group">
                {/* Single Decorative Accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-l-2xl opacity-60"></div>

                {/* Price Block */}
                <div className="flex flex-col relative z-10">
                  {/* SRP Label */}
                  <div className="text-gray-500 text-sm font-medium mb-1">
                    SRP
                  </div>

                  {/* Main Price */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-gray-900 text-2xl font-bold">
                      ₹{lens.srp.toLocaleString()}
                    </span>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
                  </div>
                </div>

                {/* Minimal Badge */}
                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                    Best Price
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features - Responsive Design */}
          <div className="space-y-3 sm:space-y-4 mb-6">
            {/* First Row - Index and Warranty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl border border-slate-200/60 p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-105">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -translate-y-3 translate-x-3 sm:-translate-y-4 sm:translate-x-4"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <Award
                          size={14}
                          className="text-white sm:w-[18px] sm:h-[18px]"
                        />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] sm:text-xs font-semibold text-amber-600/80 uppercase tracking-wider mb-0.5 truncate">
                        Index {lens.thickness.index}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        <span className="block sm:inline">
                          {lens.thickness.type.charAt(0).toUpperCase() +
                            lens.thickness.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl border border-slate-200/60 p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-105">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -translate-y-3 translate-x-3 sm:-translate-y-4 sm:translate-x-4"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <Star
                          size={14}
                          className="text-white sm:w-[18px] sm:h-[18px]"
                        />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] sm:text-xs font-semibold text-emerald-600/80 uppercase tracking-wider mb-0.5 truncate">
                        Warranty
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        <span className="block sm:inline">
                          {lens.lensCoatingWarranty}
                        </span>
                        <span className="block sm:inline text-xs sm:text-sm font-medium text-slate-600 mt-0.5 sm:mt-0">
                          {" "}
                          Months
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row - Delivery */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/60 p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-3 translate-x-3 sm:-translate-y-4 sm:translate-x-4"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <Clock
                          size={14}
                          className="text-white sm:w-[18px] sm:h-[18px]"
                        />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] sm:text-xs font-semibold text-blue-600/80 uppercase tracking-wider mb-0.5 truncate">
                        {lens.time === "0" ? "Available" : "Expected Delivery"}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        {lens.time === "0" ? (
                          <span className="block sm:inline text-green-600 font-bold">
                            Today
                          </span>
                        ) : (
                          <span className="block sm:inline">
                            {(() => {
                              const deliveryDate = new Date();
                              deliveryDate.setDate(
                                deliveryDate.getDate() + parseInt(lens.time)
                              );
                              return deliveryDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              });
                            })()}
                          </span>
                        )}
                        <span className="block sm:inline text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-0 font-bold">
                          {lens.time === "0"
                            ? ""
                            : ` (${
                                lens.time === "1"
                                  ? `${lens.time} Day`
                                  : `${lens.time} Days`
                              })`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          {/* Photochromic Colors */}
          {lens.photochromic && lens.photochromicColors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {lens.photochromicColors.map((color, index) => {
                  // Simple color mapping - you can expand this based on your color names
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

                  const normalizedColor = color
                    .toLowerCase()
                    .replace("grey", "gray");
                  const colorHex = colorMap[normalizedColor] || "#6b7280";

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-default"
                    >
                      <div
                        className="w-4 h-4 rounded-full ring-1 ring-gray-200"
                        style={{
                          backgroundColor: colorHex,
                        }}
                      ></div>
                      <span className="text-gray-800">{color}</span>
                    </div>
                  );
                })}
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

          <WhatsAppShareButton lens={lens} prescription={prescription} />
        </div>
      </div>
    </div>
  );
}
