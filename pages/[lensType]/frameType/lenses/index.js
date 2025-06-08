import React, { useState, useEffect } from "react";
import {
  Filter,
  ShieldCheck,
  Sun,
  Eye,
  Droplets,
  Sparkles,
  Clock,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  X,
  Info,
} from "lucide-react";

import {
  Shield,
  Fingerprint,
  Wind,
  Zap,
  Palette,
  Paintbrush,
  FileCheck,
} from "lucide-react";

const LensSelectionPage = () => {
  // State management
  const [filteredLenses, setFilteredLenses] = useState([]);
  const [brands, setBrands] = useState([]);
  const [allLenses, setAllLenses] = useState([]);
  const [filters, setFilters] = useState({
    brand: [],
    thickness: [],
    features: [],
    priceRange: [0, 0],
    deliveryTime: 30,
  });
  const [sortBy, setSortBy] = useState("price");
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lensData, setLensData] = useState([]);
  const [userPowerInfo, setUserPowerInfo] = useState(null);
  const [userLensType, setUserLensType] = useState(null);
  const [userFrameType, setUserFrameType] = useState(null);
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

  // Power validation functions
  const calculateResultantPower = (sph, cyl) => {
    const floatSph = parseFloat(sph);
    const floatCyl = parseFloat(cyl);
    return parseFloat((floatSph + floatCyl).toFixed(2));
  };
  const isPowerValid = (userPower, lensRange) => {
    const checkEyePower = (eyePower) => {
      let sph = parseFloat(eyePower.SPH ?? eyePower.sph ?? 0);
      let cyl = parseFloat(eyePower.CYL ?? eyePower.cyl ?? 0);

      const rpMinus = parseFloat(lensRange.rpMinus);
      const rpPlus = parseFloat(lensRange.rpPlus);
      const maxCylMinus = parseFloat(lensRange.maxCylMinus);
      const maxCylPlus = parseFloat(lensRange.maxCylPlus);
      const maxCylCross = parseFloat(lensRange.maxCylCross);

      // First check if SPH alone is within range (basic validation)
      if (sph < rpMinus || sph > rpPlus) {
        return false;
      }

      // Check for cross-cylinder case
      const isCrossCylinder =
        (sph > 0 && cyl < 0 && Math.abs(sph) < Math.abs(cyl)) ||
        (sph < 0 && cyl > 0 && Math.abs(sph) < Math.abs(cyl));

      if (isCrossCylinder) {
        // Handle cross-cylinder case
        let transposedSph = sph;
        let transposedCyl = cyl;

        if (sph < 0 && cyl > 0) {
          // Transpose the prescription
          transposedSph = sph + cyl;
          transposedCyl = -cyl;
        }

        // Check if transposed SPH is within range
        if (transposedSph < rpMinus || transposedSph > rpPlus) {
          return false;
        }

        // Check transposed cylinder against maxCylCross
        if (Math.abs(transposedCyl) > Math.abs(maxCylCross)) {
          return false;
        }

        // Check cylinder range
        if (transposedCyl > maxCylPlus || transposedCyl < maxCylMinus) {
          return false;
        }

        return true;
      }

      // Handle regular power validation
      let finalSph = sph;
      let finalCyl = cyl;

      const isCrossPower = sph * cyl < 0;
      if (isCrossPower) {
        // Transpose cross power
        finalSph = sph + cyl;
        finalCyl = -cyl;

        // Check if transposed SPH is within range
        if (finalSph < rpMinus || finalSph > rpPlus) {
          return false;
        }
      }

      // Calculate resultant power
      const rp = calculateResultantPower(finalSph, finalCyl);

      // Check resultant power range
      if (rp < rpMinus || rp > rpPlus) {
        return false;
      }

      // Check cylinder range
      if (finalCyl > maxCylPlus || finalCyl < maxCylMinus) {
        return false;
      }

      return true;
    };

    // Handle RE/LE or single eye input
    if (userPower.RE || userPower.LE) {
      let reValid = true;
      let leValid = true;

      if (userPower.RE) {
        reValid = checkEyePower(userPower.RE);
      }

      if (userPower.LE) {
        leValid = checkEyePower(userPower.LE);
      }

      return reValid && leValid; // Both eyes must be valid
    } else {
      return checkEyePower(userPower);
    }
  };

  function isAdditionValid(powerInfo, addRange) {
    const rightAdd = parseFloat(powerInfo.RE?.ADD || 0);
    const leftAdd = parseFloat(powerInfo.LE?.ADD || 0);

    const isRightValid = rightAdd >= addRange.start && rightAdd <= addRange.end;
    const isLeftValid = leftAdd >= addRange.start && leftAdd <= addRange.end;

    return isRightValid && isLeftValid;
  }

  // Fetch lens data
  useEffect(() => {
    const fetchLensData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/shivaOpticiansLensData.json");
        if (!response.ok) {
          throw new Error("Failed to fetch lens data");
        }
        const data = await response.json();

        setLensData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching lens data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLensData();
  }, []);

  useEffect(() => {
    if (lensData.length === 0) return; // Don't run if no lens data yet

    try {
      let powerInfo, lensType, frame;

      try {
        powerInfo = JSON.parse(localStorage.getItem("prescription")) || {
          sph: -2.0,
          cyl: -0.5,
        };
        lensType = localStorage.getItem("lensSelection") || "sv-far";
        frame = localStorage.getItem("frameType") || "lensOnly";
      } catch (localStorageError) {
        // Fallback data for demo
        powerInfo = { sph: -2.0, cyl: -0.5 };
        lensType = "sv-far";
        frame = "lensOnly";
        console.warn("localStorage not available, using demo data");
      }

      if (!powerInfo || !lensType) {
        setError("Missing prescription or lens type data");
        return;
      }

      setUserPowerInfo(powerInfo);
      setUserLensType(lensType.replace(/"/g, ""));
      setUserFrameType(frame || "lensOnly");

      // Filter lenses based on user requirements
      const validLenses = lensData.filter((lens) => {
        const lensTypeClean = (lens.lensType || "").trim().toLowerCase();
        const selectedLensType = (lensType || "")
          .trim()
          .replace(/"/g, "")
          .toLowerCase();

        // Match lensType exactly
        if (lensTypeClean !== selectedLensType) return false;

        // For multifocal types, check addition range validity
        if (
          selectedLensType === "mf-bifocal" ||
          selectedLensType === "mf-progressive"
        ) {
          if (!isAdditionValid(powerInfo, lens.addRange)) return false;
        }

        // Check power compatibility
        if (!isPowerValid(powerInfo, lens.powerRange)) return false;

        // Get power values
        const RE_SPH = parseFloat(powerInfo.RE?.SPH) || 0;
        const LE_SPH = parseFloat(powerInfo.LE?.SPH) || 0;
        const RE_CYL = parseFloat(powerInfo.RE?.CYL) || 0;
        const LE_CYL = parseFloat(powerInfo.LE?.CYL) || 0;

        const minusTotalPower = parseFloat(lens.powerRange.rpMinus);
        const plusTotalPower = parseFloat(lens.powerRange.rpPlus);
        const maxCylCross = parseFloat(lens.powerRange.maxCylCross);

        // Check if this is a cross-cylinder case
        const isRECross =
          (RE_SPH > 0 && RE_CYL < 0 && Math.abs(RE_SPH) < Math.abs(RE_CYL)) ||
          (RE_SPH < 0 && RE_CYL > 0 && Math.abs(RE_SPH) < Math.abs(RE_CYL));
        const isLECross =
          (LE_SPH > 0 && LE_CYL < 0 && Math.abs(LE_SPH) < Math.abs(LE_CYL)) ||
          (LE_SPH < 0 && LE_CYL > 0 && Math.abs(LE_SPH) < Math.abs(LE_CYL));

        if (isRECross || isLECross) {
          // Handle cross-cylinder cases
          if (maxCylCross === 0) {
            return false; // Lens cannot handle cross-cylinder
          }

          // Check if the cylinder values are within the lens's cross-cylinder range
          // Both high-cyl and regular lenses can handle cross-cylinder powers

          return (
            Math.abs(RE_CYL) <= Math.abs(maxCylCross) &&
            Math.abs(LE_CYL) <= Math.abs(maxCylCross)
          );
        }

        // Handle high cylinder cases (|CYL| > 2)
        if (Math.abs(RE_CYL) > 2 || Math.abs(LE_CYL) > 2) {
          if (!lens.isHighCyl) {
            return false; // Regular lens cannot handle high cylinder
          }
          // High cylinder lens can handle it - continue with further checks
        }

        // High cylinder lens specific validation
        if (lens.isHighCyl) {
          
          // Check negative resultant power range
          const reResultant = RE_SPH + RE_CYL;
          const leResultant = LE_SPH + LE_CYL;

          if (reResultant < 0 || leResultant < 0) {
            if (
              (RE_CYL >= -2 && RE_CYL <= 0) ||
              (LE_CYL >= -2 && LE_CYL <= 0)
            ) {
              if (
                reResultant < minusTotalPower ||
                leResultant < minusTotalPower
              ) {
                return false;
              }
            }
          }

          // Check positive resultant power range
          if (reResultant > 0 || leResultant > 0) {
            if ((RE_CYL <= 2 && RE_CYL >= 0) || (LE_CYL <= 2 && LE_CYL >= 0)) {
              if (
                reResultant > plusTotalPower ||
                leResultant > plusTotalPower
              ) {
                return false;
              }
            }
          }
        }

        return true;
      });

      // Remove duplicates by name, keeping only the lowest price
      const lensMap = new Map();

      validLenses.forEach((lens) => {
        const lensName = lens.name; // Assuming the lens object has a 'name' property
        const lensPrice = parseFloat(lens.specialPrice) || 0; // Assuming the lens object has a 'price' property

        if (
          !lensMap.has(lensName) ||
          lensPrice < parseFloat(lensMap.get(lensName).specialPrice)
        ) {
          lensMap.set(lensName, lens);
        }
      });

      // Convert map back to array
      const deduplicatedLenses = Array.from(lensMap.values());

      setAllLenses(deduplicatedLenses);
      setFilteredLenses(deduplicatedLenses.slice(0, 5));

      const uniqueBrands = [
        ...new Set(deduplicatedLenses.map((lens) => lens.brand)),
      ];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Error processing user data:", error);
      setError("Error processing user data");
    }
  }, [lensData]); // Added lensData as dependency - this was the main issue!

  // Filter and sort lenses
  useEffect(() => {
    let filtered = [...allLenses];

    // Apply filters
    if (filters.brand.length > 0) {
      filtered = filtered.filter((lens) => filters.brand.includes(lens.brand));
    }

    if (filters.thickness.length > 0) {
      filtered = filtered.filter((lens) =>
        filters.thickness.includes(lens.thickness.type)
      );
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter((lens) => {
        return filters.features.every((feature) => {
          switch (feature) {
            case "blueLight":
              return lens.filterBlueVioletLight;
            case "essentialBlueLight":
              return lens.allowEssentialBlueLight;
            case "antiGlare":
              return lens.reducesGlare;
            case "scratch":
              return lens.resistScratches;
            case "smudge":
              return lens.resistSmudges;
            case "water":
              return lens.repelsWater;
            case "dust":
              return lens.repelsDust;
            case "photochromic":
              return lens.photochromic;
            case "tintable":
              return lens.tintable;
            case "uv":
              return lens.sunUvProtection;
            case "unbreakable":
              return lens.unbreakable;
            case "authenticityCard":
              return lens.authenticityCard;
            case "lensMaterialWarranty":
              return lens.lensMaterialWarranty;
            case "lowReflection":
              return lens.lowReflection;
            case "drivePlus":
              return lens.drivePlus;
            default:
              return true;
          }
        });
      });
    }

    // Delivery time filter
    filtered = filtered.filter((lens) => lens.time <= filters.deliveryTime);

    // Sort lenses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.specialPrice - b.specialPrice;
        case "delivery":
          return a.time - b.time;
        default:
          return 0;
      }
    });

    setFilteredLenses(filtered.slice(0, 5));
  }, [filters, sortBy, allLenses]);

  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: [],
      thickness: [],
      features: [],
      deliveryTime: 30,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-medium">
            Loading lens data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-6">
            <X size={64} className="mx-auto mb-4" />
            <p className="text-2xl font-bold">Error loading lens data</p>
            <p className="text-lg">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Perfect Lenses
          </h1>
          <p className="text-lg text-gray-600">
            Showing lenses compatible with your {userLensType} prescription
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          
          {/* Filters Sidebar - keeping original structure */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-80 bg-white rounded-2xl shadow-xl p-8 h-fit border border-slate-200`}
          >
            <div className="flex items-center justify-between mb-6">
              {showFilters && (
                <h3 className="text-xl font-bold text-gray-900">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white rounded-xl shadow-lg border border-slate-200 font-semibold hover:shadow-xl transition-shadow text-sm sm:text-base"
                  >
                    <Filter size={18} className="sm:w-6 sm:h-6" />
                    Close
                  </button>
                </h3>
              )}
              {!showFilters && (
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              )}

              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Material Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Lens Material Types
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    key: "blueLight",
                    label: "Blue Cut",
                    icon: "Eye",
                  },

                  {
                    key: "photochromic",
                    label: "Photochromic",
                    icon: "Palette",
                  },
                  {
                    key: "unbreakable",
                    label: "Unbreakable",
                    icon: "ShieldCheck",
                  },
                  { key: "tintable", label: "Tintable", icon: "Paintbrush" },
                ].map((feature) => {
                  const isActive = filters.features.includes(feature.key);

                  return (
                    <label
                      key={feature.key}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md min-h-[120px] ${
                        isActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature.key)}
                        onChange={() => toggleFilter("features", feature.key)}
                        className="sr-only"
                      />
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-lg mb-3 transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {feature.icon === "Eye" && (
                          <svg
                            className="w-5 h-5"
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

                        {feature.icon === "Palette" && (
                          <svg
                            className="w-5 h-5"
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
                        {feature.icon === "ShieldCheck" && (
                          <svg
                            className="w-5 h-5"
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
                        {feature.icon === "Paintbrush" && (
                          <svg
                            className="w-5 h-5"
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
                      </div>
                      <span
                        className={`font-medium text-center text-sm leading-tight transition-colors duration-200 ${
                          isActive ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {feature.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Coating Features Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Coating Features
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  //resistScratches
                  {
                    key: "resistScratches",
                    label: "Resist Scratches",
                    icon: "scratchProof",
                  },
                  { key: "antiGlare", label: "Anti-Glare", icon: "Shield" },
                  { key: "uv", label: "Sun UV Protection", icon: "Sun" },
                  { key: "water", label: "Water Repellent", icon: "Droplets" },
                  {
                    key: "smudge",
                    label: "Smudge Resistant",
                    icon: "Fingerprint",
                  },
                  {
                    key: "lowReflection",
                    label: "Low Reflection",
                    icon: "ClearSpecs",
                  },
                  {
                    key: "drivePlus",
                    label: "Drive Plus",
                    icon: "NightVision",
                  },
                  { key: "dust", label: "Dust Repellent", icon: "Wind" },
                  {
                    key: "essentialBlueLight",
                    label: "Essential Blue Light",
                    icon: "Zap",
                  },
                ].map((feature) => {
                  const isActive = filters.features.includes(feature.key);

                  return (
                    <label
                      key={feature.key}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md min-h-[120px] ${
                        isActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature.key)}
                        onChange={() => toggleFilter("features", feature.key)}
                        className="sr-only"
                      />
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-lg mb-3 transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {feature.icon === "scratchProof" && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        )}
                        {feature.icon === "Shield" && (
                          <svg
                            className="w-5 h-5"
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
                        {feature.icon === "NightVision" && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 12H5m14 0a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v3"
                            />
                            <circle cx="7" cy="16" r="1" strokeWidth={2} />
                            <circle cx="17" cy="16" r="1" strokeWidth={2} />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M6 12l2-2m10 2l-2-2"
                              opacity="0.7"
                            />
                          </svg>
                        )}

                        {feature.icon === "ClearSpecs" && (
                          <svg
                            className="w-5 h-5"
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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M8 8l8 8m-8 0l8-8"
                              opacity="0.3"
                            />
                          </svg>
                        )}

                        {feature.icon === "Sun" && (
                          <svg
                            className="w-5 h-5"
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

                        {feature.icon === "Droplets" && (
                          <svg
                            className="w-5 h-5"
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
                        {feature.icon === "Fingerprint" && (
                          <svg
                            className="w-5 h-5"
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
                        {feature.icon === "Wind" && (
                          <svg
                            className="w-5 h-5"
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
                        {feature.icon === "Zap" && (
                          <svg
                            className="w-5 h-5"
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
                      <span
                        className={`font-medium text-center text-sm leading-tight transition-colors duration-200 ${
                          isActive ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {feature.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Other Details Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Extra's
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    key: "authenticityCard",
                    label: "Authenticity Card",
                    icon: "Award",
                  },
                  {
                    key: "lensMaterialWarranty",
                    label: "Material Warranty",
                    icon: "FileCheck",
                  },
                ].map((feature) => {
                  const isActive = filters.features.includes(feature.key);

                  return (
                    <label
                      key={feature.key}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md min-h-[120px] ${
                        isActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature.key)}
                        onChange={() => toggleFilter("features", feature.key)}
                        className="sr-only"
                      />
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-lg mb-3 transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {feature.icon === "Award" && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        )}
                        {feature.icon === "FileCheck" && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`font-medium text-center text-sm leading-tight transition-colors duration-200 ${
                          isActive ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {feature.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Thickness Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Thickness
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: "standard", label: "Standard", icon: "layers-3" },
                  { key: "thin", label: "Thin", icon: "layers-2" },
                  { key: "thinnest", label: "Thinnest", icon: "layer" },
                ].map((thickness) => {
                  const isActive = filters.thickness.includes(thickness.key);

                  return (
                    <label
                      key={thickness.key}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md min-h-[120px] ${
                        isActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.thickness.includes(thickness.key)}
                        onChange={() =>
                          toggleFilter("thickness", thickness.key)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-lg mb-3 transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {thickness.key === "standard" && (
                          <div className="flex flex-col items-center space-y-0.5">
                            <div className="w-6 h-1.5 bg-current rounded"></div>
                            <div className="w-6 h-1.5 bg-current rounded"></div>
                            <div className="w-6 h-1.5 bg-current rounded"></div>
                          </div>
                        )}
                        {thickness.key === "thin" && (
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-6 h-1 bg-current rounded"></div>
                            <div className="w-6 h-1 bg-current rounded"></div>
                          </div>
                        )}
                        {thickness.key === "thinnest" && (
                          <div className="w-6 h-0.5 bg-current rounded"></div>
                        )}
                      </div>
                      <span
                        className={`font-medium text-center text-sm leading-tight transition-colors duration-200 capitalize ${
                          isActive ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {thickness.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            {/* Brand Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Brand
              </h4>
              {brands.map((brand) => (
                <label key={brand} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand)}
                    onChange={() => toggleFilter("brand", brand)}
                    className="mr-3 text-blue-600 w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium">{brand}</span>
                </label>
              ))}
            </div>

            {/* Delivery Time */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Max Delivery Time
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={filters.deliveryTime}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      deliveryTime: parseInt(e.target.value),
                    }))
                  }
                  className="flex-1"
                />
                <span className="text-gray-700 font-semibold min-w-[80px]">
                  {filters.deliveryTime} days
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
              {!showFilters && (
                <>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white rounded-xl shadow-lg border border-slate-200 font-semibold hover:shadow-xl transition-shadow text-sm sm:text-base"
                  >
                    <Filter size={18} className="sm:w-6 sm:h-6" />
                    Filters
                  </button>

                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
                    <span className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium whitespace-nowrap">
                      Sort by:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full xs:w-auto min-w-[140px] sm:min-w-[160px] px-3 sm:px-4 py-2 sm:py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-sm sm:text-base lg:text-lg"
                    >
                      <option value="price">Price</option>
                      <option value="delivery">Delivery Time</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Lens Cards */}
            {!showFilters && (
              <div className="grid gap-6 lg:gap-8">
                {filteredLenses.map((lens) => (
                  <div
                    key={lens.id}
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
                        {/* Discount Badge - Redesigned */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                          <div className="relative">
                            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-sm sm:text-base font-bold shadow-2xl backdrop-blur-sm border border-white/20">
                              <span className="text-xs sm:text-sm font-medium opacity-90">
                                SAVE
                              </span>
                              <div className="text-lg sm:text-xl font-black leading-none">
                                {Math.round(
                                  (1 - lens.specialPrice / lens.srp) * 100
                                )}
                                %
                              </div>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                          </div>
                        </div>
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
                                {lens.brand}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="font-medium">
                                Made in {lens.lensMaterialCountry}
                              </span>
                            </div>
                          </div>

                          {/* Price Section - Redesigned */}
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-2xl border border-green-200/50">
                            <div className="flex items-center gap-2 sm:gap-0 sm:flex-col sm:items-end">
                              <div className="text-2xl sm:text-3xl font-black text-green-600">
                                ₹{lens.specialPrice.toLocaleString()}
                              </div>
                              <div className="text-sm sm:text-base text-gray-500 line-through">
                                ₹{lens.srp.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm text-green-700 font-bold bg-green-100 px-2 py-1 rounded-lg">
                              Save ₹
                              {(lens.srp - lens.specialPrice).toLocaleString()}
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
                        <div className="mb-6">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            Protection Features
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                            {[
                              {
                                key: "resistScratches",
                                label: "Scratch Resistant",
                                color: "blue",
                                icon: "shield",
                                gradient: "from-blue-500 to-blue-600",
                              },
                              {
                                key: "reducesGlare",
                                label: "Anti-Glare",
                                color: "purple",
                                icon: "sun",
                                gradient: "from-purple-500 to-purple-600",
                              },
                              {
                                key: "filterBlueVioletLight",
                                label: "Blue Light Filter",
                                color: "indigo",
                                icon: "eye",
                                gradient: "from-indigo-500 to-indigo-600",
                              },
                              {
                                key: "repelsWater",
                                label: "Water Repellent",
                                color: "cyan",
                                icon: "droplets",
                                gradient: "from-cyan-500 to-cyan-600",
                              },
                              {
                                key: "photochromic",
                                label: "Photochromic",
                                color: "amber",
                                icon: "palette",
                                gradient: "from-amber-500 to-amber-600",
                              },
                              {
                                key: "sunUvProtection",
                                label: "UV Protection",
                                color: "orange",
                                icon: "sun-dim",
                                gradient: "from-orange-500 to-orange-600",
                              },
                              {
                                key: "resistSmudges",
                                label: "Smudge Resistant",
                                color: "green",
                                icon: "fingerprint",
                                gradient: "from-green-500 to-green-600",
                              },
                              {
                                key: "repelsDust",
                                label: "Dust Repellent",
                                color: "pink",
                                icon: "wind",
                                gradient: "from-pink-500 to-pink-600",
                              },
                              {
                                  key: "lowReflection",
                                  label: "Low Reflection",
                                  color: "blue",
                                  icon: "lowReflex",
                                  gradient: "from-blue-500 to-blue-600",
                                },
                                {
                                  key: "drivePlus",
                                  label: "Drive+",
                                  color: "purple",
                                  icon: "drive",
                                  gradient: "from-purple-500 to-purple-600",
                                },
                              {
                                key: "unbreakable",
                                label: "Unbreakable",
                                color: "red",
                                icon: "shield-check",
                                gradient: "from-red-500 to-red-600",
                              },
                            ].map((feature) => {
                              if (!lens[feature.key]) return null;

                              return (
                                <div
                                  key={feature.key}
                                  className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-help hover:shadow-lg hover:scale-105 min-h-[100px] sm:min-h-[120px]"
                                  onMouseEnter={() =>
                                    setHoveredFeature(feature.key)
                                  }
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
                              );
                            })}
                          </div>
                        </div>

                        {/* Photochromic Colors - Enhanced */}
                        {lens.photochromic &&
                          lens.photochromicColors.length > 0 && (
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

                        {/* Action Button - Enhanced */}
                        <button className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl transition-all duration-300 text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group">
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Select This Lens
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
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div />

            {!showFilters && filteredLenses.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-xl text-gray-500 mb-6 font-medium">
                  No lenses found matching your criteria
                </div>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 font-bold text-lg px-6 py-3 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Clear filters and try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LensSelectionPage;
