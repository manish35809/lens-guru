import React, { useState, useEffect } from 'react';
import { Filter, ShieldCheck, Sun, Eye, Droplets, Sparkles, Clock, Award, Star, ChevronDown, ChevronUp, X } from 'lucide-react';

const LensSelectionPage = () => {
  // State management
  const [filteredLenses, setFilteredLenses] = useState([]);
  const [allLenses, setAllLenses] = useState([]);
  const [filters, setFilters] = useState({
    brand: [],
    thickness: [],
    features: [],
    priceRange: [0, 20000],
    deliveryTime: 15
  });
  const [sortBy, setSortBy] = useState('price');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lensData, setLensData] = useState([]);
  const [userPowerInfo, setUserPowerInfo] = useState(null);
  const [userLensType, setUserLensType] = useState(null);
  const [userFrameType, setUserFrameType] = useState(null);

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
    // Handle both single eye prescription and binocular prescription
    const checkEyePower = (eyePower) => {
      const sph = eyePower.SPH || 0;
      const cyl = eyePower.CYL || 0;
      const rp = calculateResultantPower(sph, cyl);
      // Check resultant power range
      if (rp < lensRange.rpMinus || rp > lensRange.rpPlus) {
        return false;
      }
      
      // Check cylinder limits
      if (cyl > lensRange.maxCylPlus || cyl < lensRange.maxCylMinus) {
        return false;
      }
      
      // Check cross power if applicable
      if (sph > 0 && cyl < 0 && Math.abs(sph) < Math.abs(cyl)) {
        const crossPower = calculateCrossPower(sph, cyl);
        const crossRp = calculateResultantPower(crossPower.sph, crossPower.cyl);
        if (crossRp < lensRange.rpMinus || crossRp > lensRange.maxCylCross) {
          return false;
        }
      }
      
      return true;
    };    

    // Check if userPower has RE/LE (right eye/left eye) structure
    if (userPower.RE || userPower.LE) {
      // Check both eyes - lens must be valid for both
      const reValid = userPower.RE ? checkEyePower(userPower.RE) : true;
      const leValid = userPower.LE ? checkEyePower(userPower.LE) : true;
      return reValid && leValid;
    } else {
      // Single prescription format
      return checkEyePower(userPower);
    }
  };

  // Fetch lens data
  useEffect(() => {
    const fetchLensData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/lensData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch lens data');
        }
        const data = await response.json();
        
        setLensData(data);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching lens data:', err);
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
        powerInfo = JSON.parse(localStorage.getItem("prescription")) || { sph: -2.0, cyl: -0.5 };
        lensType = localStorage.getItem("lensSelection") || "sv-far";
        frame = localStorage.getItem("frameType") || "lensOnly";
      } catch (localStorageError) {
        // Fallback data for demo
        powerInfo = { sph: -2.0, cyl: -0.5 };
        lensType = "sv-far";
        frame = "lensOnly";
        console.warn('localStorage not available, using demo data');
      }

      if (!powerInfo || !lensType) {
        setError('Missing prescription or lens type data');
        return;
      }

      setUserPowerInfo(powerInfo);
      setUserLensType(lensType.replace(/"/g, ''));
      setUserFrameType(frame || 'lensOnly');

      // Filter lenses based on user requirements
      const validLenses = lensData.filter(lens => {
        // Check lens type compatibility
        if (lens.lensType !== lensType.replace(/"/g, '')) return false;
        
        // Check power compatibility
        if (!isPowerValid(powerInfo, lens.powerRange)) return false;

        return true;
      });

      setAllLenses(validLenses);
      setFilteredLenses(validLenses.slice(0, 3));
    } catch (error) {
      console.error('Error processing user data:', error);
      setError('Error processing user data');
    }
  }, [lensData]); // Added lensData as dependency - this was the main issue!

  // Filter and sort lenses
  useEffect(() => {
    let filtered = [...allLenses];

    // Apply filters
    if (filters.brand.length > 0) {
      filtered = filtered.filter(lens => filters.brand.includes(lens.brand));
    }

    if (filters.thickness.length > 0) {
      filtered = filtered.filter(lens => filters.thickness.includes(lens.thickness.type));
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter(lens => {
        return filters.features.every(feature => {
          switch (feature) {
            case 'blueLight': return lens.filterBlueVioletLight;
            case 'antiGlare': return lens.reducesGlare;
            case 'scratch': return lens.resistScratches;
            case 'water': return lens.repelsWater;
            case 'photochromic': return lens.photochromic;
            case 'uv': return lens.sunUvProtection;
            default: return true;
          }
        });
      });
    }

    // Price range filter
    filtered = filtered.filter(lens => 
      lens.specialPrice >= filters.priceRange[0] && 
      lens.specialPrice <= filters.priceRange[1]
    );

    // Delivery time filter
    filtered = filtered.filter(lens => lens.time <= filters.deliveryTime);

    // Sort lenses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.specialPrice - b.specialPrice;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'delivery':
          return a.time - b.time;
        case 'rating':
          return 5 - 4; // Mock rating sort
        default:
          return 0;
      }
    });

    setFilteredLenses(filtered.slice(0, 3));
  }, [filters, sortBy, allLenses]);

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: [],
      thickness: [],
      features: [],
      priceRange: [0, 20000],
      deliveryTime: 15
    });
  };

  const FeatureIcon = ({ feature, active }) => {
    const iconProps = { size: 16, className: active ? "text-blue-600" : "text-gray-400" };
    
    switch (feature) {
      case 'resistScratches': return <ShieldCheck {...iconProps} />;
      case 'reducesGlare': return <Eye {...iconProps} />;
      case 'repelsWater': return <Droplets {...iconProps} />;
      case 'filterBlueVioletLight': return <Sun {...iconProps} />;
      case 'photochromic': return <Sparkles {...iconProps} />;
      default: return <ShieldCheck {...iconProps} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lens data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <X size={48} className="mx-auto mb-2" />
            <p className="text-lg font-semibold">Error loading lens data</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Perfect Lenses</h1>
          <p className="text-gray-600 mt-1">
            Showing lenses compatible with your {userLensType} prescription
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-80 bg-white rounded-lg shadow-sm p-6 h-fit`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800">
                Clear All
              </button>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
              {['Essilor', 'Zeiss', 'Hoya', 'Crizal'].map(brand => (
                <label key={brand} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => toggleFilter('brand', brand)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>

            {/* Thickness Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Thickness</h4>
              {['standard', 'thin', 'thinnest'].map(thickness => (
                <label key={thickness} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={filters.thickness.includes(thickness)}
                    onChange={() => toggleFilter('thickness', thickness)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 capitalize">{thickness}</span>
                </label>
              ))}
            </div>

            {/* Features Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Features</h4>
              {[
                { key: 'blueLight', label: 'Blue Light Protection' },
                { key: 'antiGlare', label: 'Anti-Glare' },
                { key: 'scratch', label: 'Scratch Resistant' },
                { key: 'water', label: 'Water Repellent' },
                { key: 'photochromic', label: 'Photochromic' },
                { key: 'uv', label: 'UV Protection' }
              ].map(feature => (
                <label key={feature.key} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature.key)}
                    onChange={() => toggleFilter('features', feature.key)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{feature.label}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [0, parseInt(e.target.value)]
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">₹{filters.priceRange[1]}</span>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Max Delivery Time</h4>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={filters.deliveryTime}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    deliveryTime: parseInt(e.target.value)
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">{filters.deliveryTime} days</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border"
              >
                <Filter size={20} />
                Filters
              </button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="price">Price</option>
                  <option value="brand">Brand</option>
                  <option value="delivery">Delivery Time</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Lens Cards */}
            <div className="grid gap-6">
              {filteredLenses.map((lens) => (
                <div key={lens.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/3">
                      <img
                        src={lens.poster}
                        alt={lens.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{lens.name}</h3>
                          <p className="text-gray-600">{lens.brand} • Made in {lens.lensMaterialCountry}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">₹{lens.specialPrice.toLocaleString()}</div>
                          <div className="text-sm text-gray-500 line-through">₹{lens.srp.toLocaleString()}</div>
                          <div className="text-sm text-green-600">
                            {Math.round((1 - lens.specialPrice / lens.srp) * 100)}% off
                          </div>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-600" />
                          <span className="text-sm">Delivery in {lens.time} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-yellow-500" />
                          <span className="text-sm">Index {lens.thickness.index} ({lens.thickness.type})</span>
                        </div>
                        {lens.authenticityCard && (
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-green-600" />
                            <span className="text-sm">Authenticity Card</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-orange-500" />
                          <span className="text-sm">{lens.lensCoatingWarranty} months warranty</span>
                        </div>
                      </div>

                      {/* Protection Features */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Protection Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {lens.resistScratches && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                              <FeatureIcon feature="resistScratches" active={true} />
                              Scratch Resistant
                            </span>
                          )}
                          {lens.reducesGlare && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                              <FeatureIcon feature="reducesGlare" active={true} />
                              Anti-Glare
                            </span>
                          )}
                          {lens.filterBlueVioletLight && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                              <FeatureIcon feature="filterBlueVioletLight" active={true} />
                              Blue Light Filter
                            </span>
                          )}
                          {lens.repelsWater && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs">
                              <FeatureIcon feature="repelsWater" active={true} />
                              Water Repellent
                            </span>
                          )}
                          {lens.photochromic && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                              <FeatureIcon feature="photochromic" active={true} />
                              Photochromic
                            </span>
                          )}
                          {lens.sunUvProtection && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs">
                              <Sun size={12} />
                              UV Protection
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Photochromic Colors */}
                      {lens.photochromic && lens.photochromicColors.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Colors</h4>
                          <div className="flex gap-2">
                            {lens.photochromicColors.map((color, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                        Select This Lens
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLenses.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No lenses found matching your criteria</div>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium"
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