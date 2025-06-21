import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { triggerStorageUpdate } from "@/components/Header";

export default function FramesPage() {
  const [prescription, setPrescription] = useState({
    RE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
    LE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
  });
  const [isSaved, setIsSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("lensSelection");
    const saved = localStorage.getItem("prescription");
    if (saved) {
      setPrescription(JSON.parse(saved));
      setIsSaved(true);
    }
  }, []);

  const handleChange = (eye, field, value) => {
    setPrescription((prev) => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value },
    }));
    setIsSaved(false);
  };

  const isValidPrescription = () => {
    const { RE, LE } = prescription;
    const fields = ["SPH", "CYL", "AXIS", "ADD"];
    return fields.some((field) => RE[field] || LE[field]);
  };

  const hasAddition = () => {
    const addRE = prescription.RE.ADD?.trim();
    const addLE = prescription.LE.ADD?.trim();
    return addRE !== "" || addLE !== "";
  };

  const savePrescription = () => {
    if (!isValidPrescription()) {
      alert("Invalid prescription. Please enter at least one value.");
      return;
    }
    localStorage.setItem("prescription", JSON.stringify(prescription));
    setIsSaved(true);
    setShowSuccess(true);
    triggerStorageUpdate();
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const clearPrescription = () => {
    const empty = {
      RE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
      LE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
    };
    setPrescription(empty);
    localStorage.removeItem("prescription");
    localStorage.removeItem("lensSelection");
    localStorage.removeItem("frameType");

    setIsSaved(false);
    setShowSuccess(false);
    triggerStorageUpdate();
  };

  const goToLensType = () => {
    if (hasAddition()) {
      router.push("/mf");
    } else {
      router.push("/sv");
    }
  };

  const fieldLabels = {
    SPH: "Sphere",
    CYL: "Cylinder", 
    AXIS: "Axis",
    ADD: "Addition"
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg shadow-blue-400/50"></div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Prescription Power
              </h1>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-400/50"></div>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Enter your prescription details for personalized lens recommendations
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="fixed top-4 right-4 z-50 backdrop-blur-lg bg-emerald-500/90 border border-emerald-400/40 text-white px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transform animate-bounce">
              <div className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                <span className="font-medium">Prescription saved successfully!</span>
              </div>
            </div>
          )}

          {/* Prescription Form */}
          <div className="backdrop-blur-lg bg-white/80 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-cyan-400/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-lg shadow-blue-400/50"></div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent text-center">
                  Enter Your Prescription
                </h2>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-400/50"></div>
              </div>

              {/* Eye Selection Cards */}
              <div className="space-y-8">
                {["RE", "LE"].map((eye, eyeIndex) => (
                  <div key={eye} className="backdrop-blur-sm bg-white/60 border border-white/30 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-4 h-4 rounded-full shadow-lg ${
                        eye === "RE" 
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-emerald-400/50" 
                          : "bg-gradient-to-r from-purple-400 to-pink-500 shadow-purple-400/50"
                      }`}></div>
                      <h3 className={`text-xl sm:text-2xl font-bold ${
                        eye === "RE" 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent" 
                          : "bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent"
                      }`}>
                        {eye === "RE" ? "Right Eye (OD)" : "Left Eye (OS)"}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {["SPH", "CYL", "AXIS", "ADD"].map((field, fieldIndex) => (
                        <div key={field} className="group">
                          <label className="block text-sm font-medium text-slate-600 mb-2">
                            {fieldLabels[field]}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder={`Enter ${field}`}
                              value={prescription[eye][field]}
                              onChange={(e) => handleChange(eye, field, e.target.value)}
                              className="w-full p-4 bg-white/80 border border-slate-200/60 rounded-xl shadow-sm text-center font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/60 focus:shadow-lg focus:shadow-blue-400/20 transition-all duration-300 backdrop-blur-sm group-hover:border-slate-300/80"
                            />
                            {prescription[eye][field] && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg shadow-emerald-400/50"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                <button
                  onClick={savePrescription}
                  disabled={!isValidPrescription()}
                  className={`group px-8 py-4 rounded-2xl font-semibold shadow-lg transform transition-all duration-300 ${
                    isValidPrescription()
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-blue-500/25 hover:scale-105 border border-blue-400/20"
                      : "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>💾</span>
                    <span>Save Prescription</span>
                    {isValidPrescription() && (
                      <span className="text-blue-200 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    )}
                  </span>
                </button>

                <button
                  onClick={clearPrescription}
                  className="group px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 font-semibold border border-red-400/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🗑️</span>
                    <span>Clear All</span>
                    <span className="text-red-200 group-hover:translate-x-1 transition-transform duration-300">×</span>
                  </span>
                </button>
              </div>

              {/* Validation Info */}
              {!isValidPrescription() && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-700">
                    <span className="text-lg">💡</span>
                    <span className="text-sm font-medium">Please enter at least one prescription value to continue</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Button */}
          {isSaved && (
            <div className="text-center">
              <button
                onClick={goToLensType}
                className="group px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-105 transition-all duration-300 font-bold text-lg border border-emerald-400/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <span>🚀</span>
                  <span>Continue to Lens Selection</span>
                  <span className="text-emerald-200 group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
              </button>
              
              {/* Info about next step */}
              <div className="mt-4 text-center">
                <p className="text-slate-600 text-sm">
                  {hasAddition() 
                    ? "📖 Detected reading addition - Multifocal lenses recommended" 
                    : "👁️ Single vision lenses will be recommended"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
