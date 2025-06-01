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
  const [highestSRP, setHighestSRP] = useState(0);

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
  };

  // Power validation functions
  const calculateResultantPower = (sph, cyl) => {
    const floatSph = parseFloat(sph).toFixed(2);
    const floatCyl = parseFloat(cyl).toFixed(2);
    return parseFloat(floatSph) + parseFloat(floatCyl);
  };

  const calculateCrossPower = (sph, cyl) => {
    const newSph = sph + cyl;
    const newCyl = -cyl;
    return { sph: newSph, cyl: newCyl };
  };

  const isPowerValid = (userPower, lensRange) => {

    const checkEyePower = (eyePower) => {
      const sph = parseFloat(eyePower.SPH) || parseFloat(eyePower.sph) || 0;
      const cyl = parseFloat(eyePower.CYL) || parseFloat(eyePower.cyl) || 0;
      const rp = calculateResultantPower(sph, cyl);

      const rpMinus = parseFloat(lensRange.rpMinus);
      const rpPlus = parseFloat(lensRange.rpPlus);
      const maxCylMinus = parseFloat(lensRange.maxCylMinus);
      const maxCylPlus = parseFloat(lensRange.maxCylPlus);
      const maxCylCross = parseFloat(lensRange.maxCylCross);

      if (rp < rpMinus || rp > rpPlus) {
        return false;
      }

      if (cyl > maxCylPlus || cyl < maxCylMinus) {
        return false;
      }

      if (sph > 0 && cyl < 0 && Math.abs(sph) < Math.abs(cyl)) {
  const crossPower = calculateCrossPower(sph, cyl);
  const crossRp = calculateResultantPower(crossPower.sph, crossPower.cyl);
  if (crossRp < rpMinus || crossRp > maxCylCross) {
    console.log("Invalid cross power");
    return false;
  }
}

      return true;
    };

    // Check if userPower has RE/LE (right eye/left eye) structure
    if (userPower.RE || userPower.LE) {
      const reValid = userPower.RE ? checkEyePower(userPower.RE) : true;
      const leValid = userPower.LE ? checkEyePower(userPower.LE) : true;
      return reValid && leValid;
    } else {
      // Single prescription format
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

  function getHighestSRP(lenses) {
    if (!Array.isArray(lenses) || lenses.length === 0) {
        return 0;
    }

    return lenses.reduce((max, lens) => {
        const srp = parseFloat(lens.srp);
        return srp > max ? srp : max;
    }, 0);
}

  // Fetch lens data
  useEffect(() => {
    const fetchLensData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/lensData.json");
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

   // Initialize user data and filter lenses when lens data is available
  useEffect(() => {
    if (lensData.length === 0) return; // Don't run if no lens data yet

    // Check localStorage data or use fallback for demo
    try {
      // For demo purposes, using fallback data since localStorage might not be available
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

      const RE_SPH = parseFloat(powerInfo.RE?.SPH) || 0;
      const LE_SPH = parseFloat(powerInfo.LE?.SPH) || 0;
      const RE_CYL = parseFloat(powerInfo.RE?.CYL) || 0;
      const LE_CYL = parseFloat(powerInfo.LE?.CYL) || 0;

      const minusTotalPower = parseFloat(lens.powerRange.rpMinus)
      const plusTotalPower = parseFloat(lens.powerRange.rpPlus)

  // Hi Cyl rejection logic
  if (/hi\s+cyl/i.test(lens.name)) {

    if (RE_SPH + RE_CYL === 0){
      return false
    }

    if (RE_SPH + RE_CYL < 0 || LE_SPH + LE_CYL < 0){
      
      if (
        (RE_CYL >= -2 || LE_CYL >= -2) &&
        (RE_CYL <= 0 && LE_CYL <= 0) 
        ) {
            if (!(RE_SPH + RE_CYL <= minusTotalPower || LE_SPH + LE_CYL <= minusTotalPower)) {
              return false 
            }  
        }
    }

    if (RE_SPH + RE_CYL > 0 || LE_SPH + LE_CYL > 0) {
      if (
        (RE_CYL <= 2 || LE_CYL <= 2) &&
        (RE_CYL >= 0 && LE_CYL >= 0)
      ) {
        if (
          !(
            RE_SPH + RE_CYL >= plusTotalPower ||
            LE_SPH + LE_CYL >= plusTotalPower
          )
        ) {
          return false;
        }
      }
    }
  }
        return true;
      });

      setAllLenses(validLenses);

      setFilteredLenses(validLenses.slice(0, 5));     
            
      const uniqueBrands = [...new Set(validLenses.map((lens) => lens.brand))];
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

    setFilteredLenses(filtered.slice(0, 10));

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

  const FeatureIcon = ({ feature, active }) => {
    const iconProps = {
      size: 20,
      className: active ? "text-blue-600" : "text-gray-400",
    };

    switch (feature) {
      case "resistScratches":
        return <ShieldCheck {...iconProps} />;
      case "reducesGlare":
        return <Eye {...iconProps} />;
      case "repelsWater":
        return <Droplets {...iconProps} />;
      case "filterBlueVioletLight":
        return <Sun {...iconProps} />;
      case "photochromic":
        return <Sparkles {...iconProps} />;
      case "resistSmudges":
        return <ShieldCheck {...iconProps} />;
      case "repelsDust":
        return <ShieldCheck {...iconProps} />;
      case "sunUvProtection":
        return <Sun {...iconProps} />;
      case "unbreakable":
        return <ShieldCheck {...iconProps} />;
      default:
        return <ShieldCheck {...iconProps} />;
    }
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
              <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Features Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Features
              </h4>
              {[
                { key: "antiGlare", label: "Anti-Glare" },
                { key: "uv", label: "Sun UV Protection" },
                { key: "blueLight", label: "Blue Light UV420 Protection" },
                { key: "water", label: "Water Repellent" },
                { key: "smudge", label: "Smudge Resistant" },
                { key: "dust", label: "Dust Repellent" },
                { key: "essentialBlueLight", label: "Essential Blue Light" },
                { key: "photochromic", label: "Photochromic" },
                { key: "unbreakable", label: "Unbreakable" },
                { key: "tintable", label: "Tintable" },
                { key: "authenticityCard", label: "Authenticity Card" },
                { key: "lensMaterialWarranty", label: "Material Warranty" },
              ].map((feature) => (
                <label key={feature.key} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature.key)}
                    onChange={() => toggleFilter("features", feature.key)}
                    className="mr-3 text-blue-600 w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium">
                    {feature.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Thickness Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Thickness
              </h4>
              {["standard", "thin", "thinnest"].map((thickness) => (
                <label key={thickness} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={filters.thickness.includes(thickness)}
                    onChange={() => toggleFilter("thickness", thickness)}
                    className="mr-3 text-blue-600 w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium capitalize">
                    {thickness}
                  </span>
                </label>
              ))}
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
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg border border-slate-200 font-semibold hover:shadow-xl transition-shadow"
              >
                <Filter size={24} />
                Filters
              </button>

              <div className="flex items-center gap-6">
                <span className="text-lg text-gray-700 font-medium">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-lg"
                >
                  <option value="price">Price</option>
                  <option value="delivery">Delivery Time</option>
                </select>
              </div>
            </div>

            {/* Lens Cards */}
            <div className="grid gap-8">
              {filteredLenses.map((lens) => (
                <div
                  key={lens.id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-200"
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/3 relative overflow-hidden">
                      <img
                        src={lens.poster}
                        alt={lens.name}
                        className="w-full h-64 md:h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                          {Math.round((1 - lens.specialPrice / lens.srp) * 100)}
                          % OFF
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {lens.name}
                          </h3>
                          <p className="text-lg text-gray-600 font-medium">
                            {lens.brand} • Made in {lens.lensMaterialCountry}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            ₹{lens.specialPrice.toLocaleString()}
                          </div>
                          <div className="text-lg text-gray-500 line-through mb-1">
                            ₹{lens.srp.toLocaleString()}
                          </div>
                          <div className="text-lg text-green-600 font-semibold">
                            Save ₹
                            {(lens.srp - lens.specialPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <Clock size={20} className="text-blue-600" />
                          <span className="text-lg font-medium">
                            Delivery in {lens.time} days
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award size={20} className="text-yellow-500" />
                          <span className="text-lg font-medium">
                            Index {lens.thickness.index} ({lens.thickness.type})
                          </span>
                        </div>
                        {lens.authenticityCard && (
                          <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className="text-green-600" />
                            <span className="text-lg font-medium">
                              Authenticity Card
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <Star size={20} className="text-orange-500" />
                          <span className="text-lg font-medium">
                            {lens.lensCoatingWarranty} Months Coating Warranty
                          </span>
                        </div>
                      </div>

                      {/* Protection Features - Enhanced */}
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">
                          Protection Features
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            {
                              key: "resistScratches",
                              label: "Scratch Resistant",
                              color: "blue",
                            },
                            {
                              key: "reducesGlare",
                              label: "Anti-Glare",
                              color: "purple",
                            },
                            {
                              key: "filterBlueVioletLight",
                              label: "Blue Light Filter",
                              color: "indigo",
                            },
                            {
                              key: "repelsWater",
                              label: "Water Repellent",
                              color: "cyan",
                            },
                            {
                              key: "photochromic",
                              label: "Photochromic",
                              color: "amber",
                            },
                            {
                              key: "sunUvProtection",
                              label: "UV Protection",
                              color: "orange",
                            },
                            {
                              key: "resistSmudges",
                              label: "Smudge Resistant",
                              color: "green",
                            },
                            {
                              key: "repelsDust",
                              label: "Dust Repellent",
                              color: "pink",
                            },
                            {
                              key: "unbreakable",
                              label: "Unbreakable",
                              color: "red",
                            },
                          ].map((feature) => {
                            if (!lens[feature.key]) return null;

                            return (
                              <div
                                key={feature.key}
                                className={`relative inline-flex items-center gap-2 px-4 py-3 bg-${feature.color}-50 text-${feature.color}-700 rounded-xl text-sm font-semibold border border-${feature.color}-200 hover:bg-${feature.color}-100 transition-colors cursor-help`}
                                onMouseEnter={() =>
                                  setHoveredFeature(feature.key)
                                }
                                onMouseLeave={() => setHoveredFeature(null)}
                              >
                                <FeatureIcon
                                  feature={feature.key}
                                  active={true}
                                />
                                {feature.label}

                                {/* Tooltip */}
                                {hoveredFeature === feature.key && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 w-64">
                                    <div className="text-center">
                                      {featureDescriptions[feature.key]}
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
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
                          <div className="mb-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-4">
                              Available Colors
                            </h4>
                            <div className="flex gap-3">
                              {lens.photochromicColors.map((color, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl text-sm font-semibold border border-gray-300"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Action Button */}
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Select This Lens
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLenses.length === 0 && !loading && (
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
