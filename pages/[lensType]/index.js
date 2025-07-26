import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { triggerStorageUpdate } from "@/components/Header";

export default function LensTypePage() {
  const router = useRouter();
  const [prescription, setPrescription] = useState(null);
  const { lensType } = router.query;
  const [visionChoice, setVisionChoice] = useState(null);
  const [comboType, setComboType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisionType, setSelectedVisionType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lensSelection");
    if (stored) {
      setVisionChoice(JSON.parse(stored));
    }
  }, []);

  const handleSelect = (type) => {
    setVisionChoice(type);
    setSelectedVisionType(type);
    setShowModal(true);
  };

  const handleCombo = (type) => setComboType(type);

  const closeModal = () => {
    setShowModal(false);
    setSelectedVisionType(null);
    setComboType(null);
  };

  const saveAndRedirect = async (selection) => {
    setIsProcessing(true);
    
    const savedPrescription = localStorage.getItem("prescription");
    let parsedPrescription = null;

    if (savedPrescription) {
      parsedPrescription = JSON.parse(savedPrescription);
      setPrescription(parsedPrescription);
    }

    localStorage.setItem("lensSelection", JSON.stringify(selection));
    triggerStorageUpdate();

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    if (selection === "sv-far-contact" || selection === "mf-contact") {
      router.push(`/${lensType}/contact-lenses`);
    } else {
      if (selection === "sv-near") {
        let nearVisionPower = {
          RE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
          LE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
        };

        const reverseAxis = (axis) => {
          const parsed = parseInt(axis, 10);
          if (isNaN(parsed)) return "";
          return parsed > 90 ? parsed - 90 : parsed + 90;
        };

        const reverseCyl = (cyl) => {
          const value = parseFloat(cyl);
          return isNaN(value) ? "" : (-value)
        };

        const calcNearSPH = (sph, add) => {
          const sphVal = parseFloat(sph);
          const addVal = parseFloat(add);
          return isNaN(sphVal) || isNaN(addVal)
            ? ""
            : (sphVal + addVal)
        };

        if (parsedPrescription?.RE) {
          nearVisionPower.RE.SPH = calcNearSPH(
            parsedPrescription.RE.SPH,
            parsedPrescription.RE.ADD
          );
          nearVisionPower.RE.CYL = reverseCyl(parsedPrescription.RE.CYL);
          nearVisionPower.RE.AXIS = reverseAxis(parsedPrescription.RE.AXIS);
          nearVisionPower.RE.ADD = "";
        }

        if (parsedPrescription?.LE) {
          nearVisionPower.LE.SPH = calcNearSPH(
            parsedPrescription.LE.SPH,
            parsedPrescription.LE.ADD
          );
          nearVisionPower.LE.CYL = reverseCyl(parsedPrescription.LE.CYL);
          nearVisionPower.LE.AXIS = reverseAxis(parsedPrescription.LE.AXIS);
          nearVisionPower.LE.ADD = "";
        }

        console.log("✅ Final near vision prescription:", nearVisionPower);

        localStorage.setItem("prescription", JSON.stringify(nearVisionPower));
        localStorage.setItem("lensSelection", JSON.stringify("sv-far"));
        triggerStorageUpdate();

        router.push(`/${lensType}/frameType`);
      } else {
        router.push(`/${lensType}/frameType`);
      }
    }
    
    setIsProcessing(false);
    setShowModal(false);
  };

  const visionTypes = [
    {
      id: 'far',
      title: 'Distance Vision',
      subtitle: 'Perfect for far objects',
      icon: '🔭',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      description: 'Improve clarity for distant objects like road signs and television screens with perfect precision.',
      image: 'https://images.pexels.com/photos/5996746/pexels-photo-5996746.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'near',
      title: 'Reading Vision',
      subtitle: 'Ideal for close work',
      icon: '👓',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      description: 'Help you see objects that are close, like books or mobile screens with crystal clarity.',
      image: 'https://images.pexels.com/photos/15275560/pexels-photo-15275560/free-photo-of-reading-a-book.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'combined',
      title: 'All-Distance Vision',
      subtitle: 'Near + Far in one lens',
      icon: '🔁',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      description: 'Combined lenses offer both near and far vision in a single lens for ultimate convenience.',
      image: 'https://www.carfia.com/cdn/shop/articles/1_fa36a779-980d-4177-ab81-552641e434ea-396401.jpg?v=1636381435'
    }
  ];

  const renderModalContent = () => {
    const visionType = visionTypes.find(v => v.id === selectedVisionType);
    if (!visionType) return null;

    switch (selectedVisionType) {
      case 'near':
        return (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src={visionType.image}
                alt="Near Vision"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-lg leading-relaxed">
                {visionType.description}
              </p>
              
              <button
                onClick={() => saveAndRedirect("sv-near")}
                disabled={isProcessing}
                className={`w-full py-4 px-6 bg-gradient-to-r ${visionType.gradient} text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Select Reading Glasses
                    <span className="text-white/80">→</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        );

      case 'far':
        return (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src={visionType.image}
                alt="Far Vision"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 text-lg leading-relaxed text-center">
                {visionType.description}
              </p>
              
              <div className="grid gap-3">
                <button
                  onClick={() => saveAndRedirect("sv-far")}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 bg-gradient-to-r ${visionType.gradient} text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Select Distance Glasses
                      <span className="text-white/80">→</span>
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => saveAndRedirect("sv-far-contact")}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Select Contact Lenses
                      <span className="text-indigo-200">→</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case 'combined':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 text-lg leading-relaxed">
                {visionType.description}
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleCombo("progressive")}
                className={`w-full p-4 rounded-2xl transition-all duration-300 border-2 ${
                  comboType === "progressive"
                    ? "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 shadow-lg shadow-purple-200/50"
                    : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:border-purple-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🌈</span>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">Progressive Lenses</h3>
                    <p className="text-gray-600 text-sm">Smooth transition, no visible lines</p>
                  </div>
                  {comboType === "progressive" && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => handleCombo("bifocal")}
                className={`w-full p-4 rounded-2xl transition-all duration-300 border-2 ${
                  comboType === "bifocal"
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 shadow-lg shadow-blue-200/50"
                    : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🔍</span>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">Bifocal Lenses</h3>
                    <p className="text-gray-600 text-sm">Two distinct zones with visible line</p>
                  </div>
                  {comboType === "bifocal" && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {comboType && (
              <div className="border-t-2 border-gray-100 pt-6 space-y-4">
                {comboType === "progressive" && (
                  <>
                    <div className="relative rounded-2xl overflow-hidden">
                      <Image
                        src="https://www.carfia.com/cdn/shop/articles/1_fa36a779-980d-4177-ab81-552641e434ea-396401.jpg?v=1636381435"
                        alt="Progressive Lenses"
                        width={500}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                    
                    <p className="text-gray-600 text-center">
                      Progressive lenses offer a smooth, gradual change in prescription strength for near, intermediate, and far distances — no visible lines.
                    </p>
                    
                    <div className="grid gap-3">
                      <button
                        onClick={() => saveAndRedirect("mf-progressive")}
                        disabled={isProcessing}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            Select Progressive Glasses
                            <span className="text-purple-200">→</span>
                          </div>
                        )}
                      </button>
                      
                      <button
                        onClick={() => saveAndRedirect("mf-contact")}
                        disabled={isProcessing}
                        className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            Multifocal Contact Lenses
                            <span className="text-teal-200">→</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {comboType === "bifocal" && (
                  <>
                    <div className="relative rounded-2xl overflow-hidden">
                      <Image
                        src="https://vzun.in/wp-content/uploads/2021/06/bifocal-lenses.png"
                        alt="Bifocal Lenses"
                        width={500}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                    
                    <p className="text-gray-600 text-center">
                      Bifocal lenses have two distinct optical zones for distance and reading. You can visibly see the division line.
                    </p>
                    
                    <button
                      onClick={() => saveAndRedirect("mf-bifocal")}
                      disabled={isProcessing}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          Select Bifocal Glasses
                          <span className="text-blue-200">→</span>
                        </div>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"></div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Choose Your Vision Type
              </h1>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg"></div>
            </div>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Select the perfect lens solution tailored to your vision needs
            </p>
          </div>

          {/* Vision Type Selection */}
          {lensType === "sv" || lensType === "mf" ? (
            <div className="grid gap-6 max-w-3xl mx-auto">
              {visionTypes.map((vision) => {
                // Filter based on lens type
                if (lensType === "sv" && vision.id === "combined") return null;
                
                return (
                  <button
                    key={vision.id}
                    onClick={() => handleSelect(vision.id)}
                    className={`group relative p-8 rounded-3xl bg-gradient-to-r ${vision.bgGradient} border-2 border-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden`}
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${vision.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10 flex items-center gap-6">
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {vision.icon}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                          {vision.title}
                        </h3>
                        <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors">
                          {vision.subtitle}
                        </p>
                      </div>
                      
                      <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all duration-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg">
                <div className="animate-spin w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full"></div>
                <span className="text-slate-700 font-medium text-lg">
                  Loading lens options...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {visionTypes.find(v => v.id === selectedVisionType)?.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {visionTypes.find(v => v.id === selectedVisionType)?.title}
                    </h2>
                    <p className="text-gray-600">
                      {visionTypes.find(v => v.id === selectedVisionType)?.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}