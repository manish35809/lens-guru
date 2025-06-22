import React, { useState, useEffect } from 'react';
import { Eye, Zap, Layers, CheckCircle, ArrowRight, Sparkles, Target, Settings, Star, Info } from 'lucide-react';

const ProgressiveLensComparison = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const StarRating = ({ rating, label, color = "text-yellow-400" }) => (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? color + ' fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );

  const toggleDetails = (designId, category) => {
    setShowDetails(prev => ({
      ...prev,
      [`${designId}-${category}`]: !prev[`${designId}-${category}`]
    }));
  };

  const lensDesigns = [
    {
      id: 'conventional',
      title: 'Conventional Design',
      image: '/design/cd.png',
      icon: <Eye className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      borderColor: 'border-blue-200',
      description: 'Traditional progressive lens technology with proven reliability',
      ratings: {
        cost: { rating: 5, color: 'text-green-500' },
        clarity: { rating: 3, color: 'text-yellow-400' },
        adaptation: { rating: 4, color: 'text-blue-500' },
        customization: { rating: 2, color: 'text-red-400' },
        durability: { rating: 4, color: 'text-blue-500' }
      },
      features: [
        'Standard progressive corridor design',
        'Wider intermediate zone for general use',
        'Basic aberration control',
        'Cost-effective solution',
        'Suitable for first-time progressive users'
      ],
      details: {
        technology: 'Conventional progressive lenses use traditional geometric calculations to create the power progression from distance to near vision. The design follows standard mathematical curves that provide a gradual transition between different viewing zones.',
        advantages: 'These lenses offer a reliable and affordable entry point into progressive vision correction. They provide adequate vision correction for most daily activities and are particularly suitable for users who primarily need distance and reading correction.',
        limitations: 'Limited customization options and wider distortion areas on the periphery. The fixed design may not accommodate individual visual preferences or specific lifestyle needs.'
      }
    },
    {
      id: 'digital',
      title: 'Digital Design',
      image: '/design/dd.png',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      description: 'Advanced digital surfacing technology for enhanced precision',
      ratings: {
        cost: { rating: 3, color: 'text-yellow-400' },
        clarity: { rating: 4, color: 'text-blue-500' },
        adaptation: { rating: 4, color: 'text-blue-500' },
        customization: { rating: 3, color: 'text-yellow-400' },
        durability: { rating: 5, color: 'text-green-500' }
      },
      features: [
        'Computer-optimized lens design',
        'Reduced peripheral distortion',
        'Wider clear vision zones',
        'Enhanced intermediate vision',
        'Better adaptation for digital device use'
      ],
      details: {
        technology: 'Digital progressive lenses are manufactured using advanced computer-controlled surfacing equipment. This allows for more precise power calculations and smoother transitions between vision zones, resulting in a more customized lens surface.',
        advantages: 'Significantly reduced swim effect and peripheral distortion. Wider clear vision areas make these lenses ideal for computer work and digital device usage. The precision manufacturing process ensures consistent quality and performance.',
        limitations: 'Higher cost compared to conventional designs. While offering improvements, they may still have some adaptation period for new progressive lens wearers.'
      }
    },
    {
      id: 'freeform',
      title: 'Freeform Design',
      image: '/design/fd.png',
      icon: <Layers className="w-8 h-8" />,
      color: 'from-rose-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-rose-50 to-orange-50',
      borderColor: 'border-rose-200',
      description: 'Premium individualized lens design with maximum customization',
      ratings: {
        cost: { rating: 2, color: 'text-red-400' },
        clarity: { rating: 5, color: 'text-green-500' },
        adaptation: { rating: 5, color: 'text-green-500' },
        customization: { rating: 5, color: 'text-green-500' },
        durability: { rating: 5, color: 'text-green-500' }
      },
      features: [
        'Fully customized lens geometry',
        'Individual wearing position optimization',
        'Minimal peripheral aberrations',
        'Personalized visual experience',
        'Advanced biometric measurements integration'
      ],
      details: {
        technology: 'Freeform progressive lenses represent the pinnacle of lens design technology. Each lens is individually calculated and manufactured based on the wearer\'s unique biometric measurements, including eye rotation centers, vertex distance, and pantoscopic tilt.',
        advantages: 'Maximum visual performance with minimal distortion. These lenses provide the widest possible clear vision zones and can be optimized for specific activities or professions. The personalized approach ensures optimal comfort and visual acuity.',
        limitations: 'Premium pricing due to individual manufacturing process. Requires precise measurements and longer manufacturing time. May be over-engineered for users with simple vision correction needs.'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .shimmer {
          background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .pulse-dot {
          animation: pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.95); }
          70% { transform: scale(1); }
          100% { transform: scale(0.95); }
        }
      `}</style>

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-95"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl mb-6">
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Progressive Lens Designs
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Compare three distinct progressive lens technologies with easy-to-understand ratings
            </p>
          </div>
        </div>
      </div>

      {/* Main Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {lensDesigns.map((design, index) => (
            <div
              key={design.id}
              className={`relative group transform transition-all duration-500 hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Card */}
              <div className={`${design.bgColor} ${design.borderColor} border-2 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300`}>
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${design.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full transform -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">{design.title}</h3>
                    <p className="text-white text-opacity-90 text-sm">{design.description}</p>
                  </div>
                </div>

                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="w-full h-full bg-white rounded-2xl shadow-inner flex items-center justify-center overflow-hidden">
                      <img 
                        src={design.image} 
                        alt={design.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center">
                        {design.icon}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Star Ratings */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Performance Ratings
                  </h4>
                  <div className="space-y-2 mb-6">
                    <StarRating rating={design.ratings.cost.rating} label="Cost-Effectiveness" color={design.ratings.cost.color} />
                    <StarRating rating={design.ratings.clarity.rating} label="Visual Clarity" color={design.ratings.clarity.color} />
                    <StarRating rating={design.ratings.adaptation.rating} label="Easy Adaptation" color={design.ratings.adaptation.color} />
                    <StarRating rating={design.ratings.customization.rating} label="Customization" color={design.ratings.customization.color} />
                    <StarRating rating={design.ratings.durability.rating} label="Durability" color={design.ratings.durability.color} />
                  </div>

                  {/* Quick Features */}
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="font-medium text-gray-800 mb-3 text-sm">Key Benefits:</h5>
                    <div className="flex flex-wrap gap-2">
                      {design.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded-full text-gray-700">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* More Info Button */}
                  <button
                    onClick={() => setActiveCard(activeCard === design.id ? null : design.id)}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-white bg-opacity-60 hover:bg-opacity-80 transition-all duration-200 py-2 px-4 rounded-lg text-sm font-medium text-gray-700"
                  >
                    <Info className="w-4 h-4" />
                    {activeCard === design.id ? 'Hide Details' : 'More Information'}
                  </button>
                </div>

                {/* Expandable Details */}
                <div className={`overflow-hidden transition-all duration-500 ${activeCard === design.id ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="pt-6 space-y-4">
                      {/* All Features */}
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          All Features
                        </h5>
                        <ul className="space-y-2">
                          {design.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Detailed Information */}
                      <div className="space-y-3">
                        <div>
                          <button
                            onClick={() => toggleDetails(design.id, 'technology')}
                            className="flex items-center justify-between w-full text-left"
                          >
                            <h5 className="font-semibold text-gray-800 flex items-center">
                              <Settings className="w-4 h-4 mr-2" />
                              Technology
                            </h5>
                            <ArrowRight className={`w-4 h-4 transition-transform ${showDetails[`${design.id}-technology`] ? 'rotate-90' : ''}`} />
                          </button>
                          {showDetails[`${design.id}-technology`] && (
                            <p className="text-sm text-gray-600 leading-relaxed mt-2 pl-6">{design.details.technology}</p>
                          )}
                        </div>

                        <div>
                          <button
                            onClick={() => toggleDetails(design.id, 'advantages')}
                            className="flex items-center justify-between w-full text-left"
                          >
                            <h5 className="font-semibold text-green-700">Advantages</h5>
                            <ArrowRight className={`w-4 h-4 transition-transform ${showDetails[`${design.id}-advantages`] ? 'rotate-90' : ''}`} />
                          </button>
                          {showDetails[`${design.id}-advantages`] && (
                            <p className="text-sm text-gray-600 leading-relaxed mt-2">{design.details.advantages}</p>
                          )}
                        </div>

                        <div>
                          <button
                            onClick={() => toggleDetails(design.id, 'limitations')}
                            className="flex items-center justify-between w-full text-left"
                          >
                            <h5 className="font-semibold text-red-700">Limitations</h5>
                            <ArrowRight className={`w-4 h-4 transition-transform ${showDetails[`${design.id}-limitations`] ? 'rotate-90' : ''}`} />
                          </button>
                          {showDetails[`${design.id}-limitations`] && (
                            <p className="text-sm text-gray-600 leading-relaxed mt-2">{design.details.limitations}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Legend */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Rating Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="flex justify-center mb-2">
                <Star className="w-5 h-5 text-green-500 fill-current" />
                <Star className="w-5 h-5 text-green-500 fill-current" />
                <Star className="w-5 h-5 text-green-500 fill-current" />
                <Star className="w-5 h-5 text-green-500 fill-current" />
                <Star className="w-5 h-5 text-green-500 fill-current" />
              </div>
              <p className="text-sm font-medium text-green-700">Excellent</p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Star className="w-5 h-5 text-blue-500 fill-current" />
                <Star className="w-5 h-5 text-blue-500 fill-current" />
                <Star className="w-5 h-5 text-blue-500 fill-current" />
                <Star className="w-5 h-5 text-blue-500 fill-current" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-blue-700">Very Good</p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-gray-300" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-yellow-600">Good</p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Star className="w-5 h-5 text-orange-400 fill-current" />
                <Star className="w-5 h-5 text-orange-400 fill-current" />
                <Star className="w-5 h-5 text-gray-300" />
                <Star className="w-5 h-5 text-gray-300" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-orange-600">Fair</p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Star className="w-5 h-5 text-red-400 fill-current" />
                <Star className="w-5 h-5 text-gray-300" />
                <Star className="w-5 h-5 text-gray-300" />
                <Star className="w-5 h-5 text-gray-300" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-red-600">Limited</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Find Your Perfect Vision Solution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lensDesigns.map((design, index) => (
              <div key={design.id} className="text-center group">
                <div className={`w-12 h-12 bg-gradient-to-r ${design.color} bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {design.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{design.title}</h3>
                <p className="text-blue-200 text-sm">{design.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveLensComparison;