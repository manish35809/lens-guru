import { useState, useEffect, useRef } from "react";
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
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


const LensSelectionPage = () => {
  // State management
  const [filteredLenses, setFilteredLenses] = useState([]);
  const [activeFilterTab, setActiveFilterTab] = useState("materials");
  const [brands, setBrands] = useState([]);
  const [allLenses, setAllLenses] = useState([]);
  const [filters, setFilters] = useState({
    brand: [],
    thickness: [],
    features: [],
    priceRange: [0, 0],
    deliveryTime: 30,
  });
  const scrollContainerRef = useRef(null);
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

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 520; // card width + gap
      const scrollAmount = cardWidth * 1; // scroll by 1 card

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

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

        if (
          frame !== "rimless" && frame !== "lensOnly"
        ) {
          return !lens.name.includes("Poly");
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
          if (reResultant >= 0 || leResultant >= 0) {
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
      setFilteredLenses(deduplicatedLenses);

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
            case "clear":
              return lens.clear;
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

    setFilteredLenses(filtered);
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

      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Filters Sidebar - keeping original structure */}
          {/* Floating Filter Bar - Add this at the bottom of your existing component */}
          <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Backdrop when expanded */}
            {showFilters && (
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
              />
            )}

            {/* Main Filter Bar */}
            <div
              className={`relative bg-white border-t border-gray-200 shadow-2xl transition-all duration-300 ${
                showFilters ? "rounded-t-3xl" : "rounded-t-2xl"
              }`}
            >
              {/* Expanded Content */}
              {showFilters && (
                <div className="px-6 pt-6 pb-6 max-h-[70vh] overflow-y-auto">
                  {/* Tab Navigation */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                      className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeFilterTab === "materials"
                          ? "bg-blue-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => setActiveFilterTab("materials")}
                    >
                      Materials
                      {filters.features.filter((f) =>
                        [
                          "clear",
                          "blueLight",
                          "photochromic",
                          "unbreakable",
                          "tintable",
                        ].includes(f)
                      ).length > 0 && (
                        <span
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                            activeFilterTab === "materials"
                              ? "bg-white text-blue-500"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {
                            filters.features.filter((f) =>
                              [
                                "clear",
                                "blueLight",
                                "photochromic",
                                "unbreakable",
                                "tintable",
                              ].includes(f)
                            ).length
                          }
                        </span>
                      )}
                    </button>

                    <button
                      className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeFilterTab === "coatings"
                          ? "bg-blue-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => setActiveFilterTab("coatings")}
                    >
                      Coatings
                      {filters.features.filter((f) =>
                        [
                          "resistScratches",
                          "antiGlare",
                          "uv",
                          "water",
                          "smudge",
                          "lowReflection",
                          "drivePlus",
                          "dust",
                          "essentialBlueLight",
                        ].includes(f)
                      ).length > 0 && (
                        <span
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                            activeFilterTab === "coatings"
                              ? "bg-white text-blue-500"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {
                            filters.features.filter((f) =>
                              [
                                "resistScratches",
                                "antiGlare",
                                "uv",
                                "water",
                                "smudge",
                                "lowReflection",
                                "drivePlus",
                                "dust",
                                "essentialBlueLight",
                              ].includes(f)
                            ).length
                          }
                        </span>
                      )}
                    </button>

                    <button
                      className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeFilterTab === "extras"
                          ? "bg-blue-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => setActiveFilterTab("extras")}
                    >
                      Extras
                      {filters.features.filter((f) =>
                        ["authenticityCard", "lensMaterialWarranty"].includes(f)
                      ).length > 0 && (
                        <span
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                            activeFilterTab === "extras"
                              ? "bg-white text-blue-500"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {
                            filters.features.filter((f) =>
                              [
                                "authenticityCard",
                                "lensMaterialWarranty",
                              ].includes(f)
                            ).length
                          }
                        </span>
                      )}
                    </button>

                    <button
                      className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeFilterTab === "thickness"
                          ? "bg-blue-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => setActiveFilterTab("thickness")}
                    >
                      Thickness
                      {filters.thickness.length > 0 && (
                        <span
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                            activeFilterTab === "thickness"
                              ? "bg-white text-blue-500"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {filters.thickness.length}
                        </span>
                      )}
                    </button>

                    <button
                      className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeFilterTab === "brands"
                          ? "bg-blue-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => setActiveFilterTab("brands")}
                    >
                      Brands
                      {filters.brand.length > 0 && (
                        <span
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                            activeFilterTab === "brands"
                              ? "bg-white text-blue-500"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {filters.brand.length}
                        </span>
                      )}
                    </button>

                    <button
                      className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeFilterTab === "delivery"
                          ? "bg-blue-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => setActiveFilterTab("delivery")}
                    >
                      Delivery
                    </button>
                  </div>

                  {/* Filter Content */}
                  <div className="space-y-4">
                    {/* Materials Tab */}
                    {activeFilterTab === "materials" && (
                      <div className="flex flex-wrap gap-3">
                        {[
                          // data for Clear
                          {
                            key: "clear",
                            label: "Clear",
                            icon: "🌟",
                          },
                          { key: "blueLight", label: "Blue Cut", icon: "👁️" },
                          {
                            key: "photochromic",
                            label: "Photochromic",
                            icon: "🎨",
                          },
                          {
                            key: "unbreakable",
                            label: "Unbreakable",
                            icon: "🛡️",
                          },
                          { key: "tintable", label: "Tintable", icon: "🖌️" },
                        ].map((feature) => (
                          <button
                            key={feature.key}
                            onClick={() =>
                              toggleFilter("features", feature.key)
                            }
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                              filters.features.includes(feature.key)
                                ? "bg-blue-500 text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            <span className="text-base">{feature.icon}</span>
                            <span>{feature.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Coatings Tab */}
                    {activeFilterTab === "coatings" && (
                      <div className="flex flex-wrap gap-3">
                        {[
                          {
                            key: "resistScratches",
                            label: "Resist Scratches",
                            icon: "⚡",
                          },
                          { key: "antiGlare", label: "Anti-Glare", icon: "🛡️" },
                          { key: "uv", label: "Sun UV Protection", icon: "☀️" },
                          {
                            key: "water",
                            label: "Water Repellent",
                            icon: "💧",
                          },
                          {
                            key: "smudge",
                            label: "Smudge Resistant",
                            icon: "👆",
                          },
                          {
                            key: "lowReflection",
                            label: "Low Reflection",
                            icon: "👓",
                          },
                          { key: "drivePlus", label: "Drive Plus", icon: "🚗" },
                          { key: "dust", label: "Dust Repellent", icon: "💨" },
                          {
                            key: "essentialBlueLight",
                            label: "Essential Blue Light",
                            icon: "⚡",
                          },
                        ].map((feature) => (
                          <button
                            key={feature.key}
                            onClick={() =>
                              toggleFilter("features", feature.key)
                            }
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                              filters.features.includes(feature.key)
                                ? "bg-blue-500 text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            <span className="text-base">{feature.icon}</span>
                            <span>{feature.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Extras Tab */}
                    {activeFilterTab === "extras" && (
                      <div className="flex flex-wrap gap-3">
                        {[
                          {
                            key: "authenticityCard",
                            label: "Authenticity Card",
                            icon: "🏆",
                          },
                          {
                            key: "lensMaterialWarranty",
                            label: "Material Warranty",
                            icon: "✅",
                          },
                        ].map((feature) => (
                          <button
                            key={feature.key}
                            onClick={() =>
                              toggleFilter("features", feature.key)
                            }
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                              filters.features.includes(feature.key)
                                ? "bg-blue-500 text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            <span className="text-base">{feature.icon}</span>
                            <span>{feature.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Thickness Tab */}
                    {activeFilterTab === "thickness" && (
                      <div className="flex flex-wrap gap-3">
                        {[
                          { key: "standard", label: "Standard", icon: "📚" },
                          { key: "thin", label: "Thin", icon: "📖" },
                          { key: "thinnest", label: "Thinnest", icon: "📄" },
                        ].map((thickness) => (
                          <button
                            key={thickness.key}
                            onClick={() =>
                              toggleFilter("thickness", thickness.key)
                            }
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                              filters.thickness.includes(thickness.key)
                                ? "bg-blue-500 text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            <span className="text-base">{thickness.icon}</span>
                            <span>{thickness.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Brands Tab */}
                    {activeFilterTab === "brands" && (
                      <div className="flex flex-wrap gap-3">
                        {brands.map((brand) => (
                          <button
                            key={brand}
                            onClick={() => toggleFilter("brand", brand)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                              filters.brand.includes(brand)
                                ? "bg-blue-500 text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Delivery Tab */}
                    {activeFilterTab === "delivery" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700 min-w-fit">
                            Max Delivery Time:
                          </span>
                          <div className="flex-1 px-4">
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
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                                  (filters.deliveryTime / 30) * 100
                                }%, #e5e7eb ${
                                  (filters.deliveryTime / 30) * 100
                                }%, #e5e7eb 100%)`,
                              }}
                            />
                          </div>
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold min-w-fit">
                            {filters.deliveryTime} days
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Collapsed Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-3 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-colors"
                  >
                    <Filter size={32} />
                    <span>Filters</span>
                    {filters.features.length +
                      filters.thickness.length +
                      filters.brand.length >
                      0 && (
                      <span className="bg-white text-blue-500 px-2 py-0.5 rounded-full text-sm font-bold">
                        {filters.features.length +
                          filters.thickness.length +
                          filters.brand.length}
                      </span>
                    )}
                    {showFilters ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </button>

                  {!showFilters &&
                    filters.features.length +
                      filters.thickness.length +
                      filters.brand.length >
                      0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">
                          {filters.features.length +
                            filters.thickness.length +
                            filters.brand.length}{" "}
                          active filters
                        </span>
                      </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                  {filters.features.length +
                    filters.thickness.length +
                    filters.brand.length >
                    0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4l16 16m0 0l-16-16"
                        />
                      </svg>
                      <span className="hidden sm:inline">Clear All</span>
                    </button>
                  )}

                  {showFilters && (
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Add this state to your existing component */}
          {/* const [activeFilterTab, setActiveFilterTab] = useState('materials'); */}
          {/* Main Content */}
          <div className="flex-1">
            {/* Lens Cards Carousel */}
            <div className="relative max-w-7xl mx-auto px-4">
              {/* Navigation Buttons */}
              <button
                onClick={() => scroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 border border-gray-200 hover:border-blue-300"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              <button
                onClick={() => scroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 border border-gray-200 hover:border-blue-300"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Carousel Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-8 py-10"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {filteredLenses.map((lens, index) => (
                  <div
                    key={lens.id}
                    className="flex-none w-96 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-200/50 hover:border-blue-300/50 group transform hover:-translate-y-2 hover:scale-[1.02]"
                    style={{
                      animation: `slideInFromRight 0.6s ease-out ${
                        index * 0.1
                      }s both`,
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
                        {/* Discount Badge */}
                        <div className="absolute top-3 left-3">
                          <div className="relative">
                            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-3 py-1.5 rounded-2xl text-sm font-bold shadow-2xl backdrop-blur-sm border border-white/20">
                              <span className="text-xs font-medium opacity-90">
                                SAVE
                              </span>
                              <div className="text-lg font-black leading-none">
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
                      <div className="p-6">
                        {/* Header Section */}
                        <div className="flex flex-col justify-between mb-4 gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                              {lens.name}
                            </h3>
                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                              <span className="font-semibold text-blue-600">
                                {lens.brand}
                              </span>
                              <span className="font-medium">
                                Made in {lens.lensMaterialCountry}
                              </span>
                            </div>
                          </div>

                          {/* Price Section */}
                          <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-2xl border border-green-200/50">
                            <div className="flex flex-col">
                              <div className="text-2xl font-black text-green-600">
                                ₹{lens.specialPrice.toLocaleString()}
                              </div>
                              <div className="text-lg text-gray-500 line-through">
                                ₹{lens.srp.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-xl text-green-700 font-bold bg-green-100 px-2 py-1 rounded-lg">
                              Save ₹
                              {(lens.srp - lens.specialPrice).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Key Features */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 p-2 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="p-1.5 bg-blue-500 rounded-lg">
                              <Clock size={14} className="text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                                Delivery
                              </div>
                              <div className="text-sm font-bold text-gray-900">
                                {lens.time} days
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-2 bg-amber-50/50 rounded-xl border border-amber-100">
                            <div className="p-1.5 bg-amber-500 rounded-lg">
                              <Award size={14} className="text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                                Index
                              </div>
                              <div className="text-sm font-bold text-gray-900">
                                {lens.thickness.index}
                              </div>
                            </div>
                          </div>

                          {lens.authenticityCard && (
                            <div className="flex items-center gap-2 p-2 bg-green-50/50 rounded-xl border border-green-100">
                              <div className="p-1.5 bg-green-500 rounded-lg">
                                <ShieldCheck size={14} className="text-white" />
                              </div>
                              <div>
                                <div className="text-xs font-medium text-green-600 uppercase tracking-wide">
                                  Authentic
                                </div>
                                <div className="text-sm font-bold text-gray-900">
                                  Verified
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 p-2 bg-orange-50/50 rounded-xl border border-orange-100">
                            <div className="p-1.5 bg-orange-500 rounded-lg">
                              <Star size={14} className="text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                                Warranty
                              </div>
                              <div className="text-sm font-bold text-gray-900">
                                {lens.lensCoatingWarranty}M
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
                              {
                                key: "allowEssentialBlueLight",
                                label: "Essential Blue Light",
                                color: "indigo",
                                icon: "filter",
                                gradient: "from-indigo-500 to-indigo-600",
                              }
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
                                    {
                                      feature.icon === "filter" && (
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
                                      )
                                    }
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

                        {/* Photochromic Colors */}
                        {lens.photochromic &&
                          lens.photochromicColors.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                Colors
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {lens.photochromicColors
                                  .map((color, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200 transition-all duration-200 cursor-default"
                                    >
                                      {color}
                                    </span>
                                  ))}
                                {lens.photochromicColors.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                                    +{lens.photochromicColors.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        {/* Action Button */}
                        <button className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group">
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

              <style jsx>{`
                @keyframes slideInFromRight {
                  from {
                    opacity: 0;
                    transform: translateX(50px);
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }

                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }

                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }

                .line-clamp-2 {
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                }
              `}</style>
            </div>

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
