import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import LensCard from "@/components/LensCard";

const LensSelectionPage = () => {
  const router = useRouter();
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
  if (!container) return;

  const screenWidth = window.innerWidth;

  // Scroll by half of the screen width (adjustable with a fixed margin)
  const offset = 15; // adjust this as needed
  const scrollAmount = (screenWidth / 2) - offset;

  container.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};


  useEffect(() => {
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      console.log("Detected screen width:", screenWidth);

      if (screenWidth <= 480) {
        console.log("Redirecting to /sv/frameType/lenses/old");
        router.replace("/sv/frameType/lenses/old");
      }
    }
  }, []);

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
        if (frame !== "rimless" && lens.name.includes("Poly")) {
          return false;
        }

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

      // Convert map back to array and sort by price
      const deduplicatedLenses = Array.from(lensMap.values()).sort(
        (a, b) => parseFloat(a.srp) - parseFloat(b.srp)
      );

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
            case "extendedDurability":
              return lens.extendedDurability;
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
        <div className="mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Perfect Lenses
          </h1>
          <p className="text-lg text-gray-600">
            Showing lenses compatible with your {userLensType} prescription
          </p>
        </div>
      </div>

      <div className="mx-auto">
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
                      Features
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
                          "extendedDurability",
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
                                "extendedDurability",
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
                            key: "extendedDurability",
                            label: "Extended Durability",
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
          <div className="flex-1">
            {/* Lens Cards Carousel */}
            <div className="relative max-w-screen px-4">
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
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8 py-10"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {filteredLenses.map((lens, index) => (
                  <LensCard
                    key={lens.id}
                    lens={lens}
                    index={index}
                    userLensType={userLensType}
                    prescription={userPowerInfo}
                  />
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