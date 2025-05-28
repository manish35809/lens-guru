import { useState, useEffect } from "react";

export default function Header() {
  const [prescription, setPrescription] = useState(null);
  const [lensSelection, setLensSelection] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only run on client side
    if (typeof window === "undefined") return;

    // Load prescription from localStorage
    const savedPrescription = localStorage.getItem("prescription");
    console.log("Saved prescription:", savedPrescription); // Debug log
    if (savedPrescription) {
      setPrescription(JSON.parse(savedPrescription));
    }

    // Load lens selection from localStorage
    const savedLensSelection = localStorage.getItem("lensSelection");
    console.log("Saved lens selection:", savedLensSelection); // Debug log
    if (savedLensSelection) {
      setLensSelection(JSON.parse(savedLensSelection));
    }

    // Listen for storage changes to update header in real-time
    const handleStorageChange = () => {
      const updatedPrescription = localStorage.getItem("prescription");
      const updatedLensSelection = localStorage.getItem("lensSelection");
      
      console.log("Storage updated - prescription:", updatedPrescription); // Debug log
      console.log("Storage updated - lens selection:", updatedLensSelection); // Debug log
      
      setPrescription(updatedPrescription ? JSON.parse(updatedPrescription) : null);
      setLensSelection(updatedLensSelection ? JSON.parse(updatedLensSelection) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom events when localStorage is updated from the same tab
    window.addEventListener("localStorageUpdate", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdate", handleStorageChange);
    };
  }, []);

  const getPrescriptionDisplay = () => {
    // Debug: Always show something if mounted for testing
    if (!mounted) return null;
    
    // If no prescription data, show a placeholder for testing
    if (!prescription) {
      return (
        <div className="text-right">
          <div className="text-xs text-gray-400">No Prescription</div>
        </div>
      );
    }

    const { RE, LE } = prescription;
    const hasValues = Object.values(RE || {}).some(val => val && val.toString().trim() !== '') || 
                     Object.values(LE || {}).some(val => val && val.toString().trim() !== '');
    
    if (!hasValues) {
      return (
        <div className="text-right">
          <div className="text-xs text-gray-400">Empty Prescription</div>
        </div>
      );
    }

    return (
     <div className="bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-2 rounded-lg border border-emerald-200 shadow-sm backdrop-blur-sm min-w-96">
  {/* Header */}
  <div className="flex items-center gap-2 mb-2">
    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <span className="text-xs font-semibold text-emerald-700 tracking-wide">PRESCRIPTION SAVED</span>
  </div>

  {/* Both Eyes in One Row */}
  <div className="flex gap-4">
    {/* Right Eye */}
    {(RE?.SPH || RE?.CYL || RE?.AXIS || RE?.ADD) && (
      <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-md p-2 border border-white/40">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">R</span>
          </div>
          <span className="text-xs font-bold text-slate-700">Right Eye</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {RE.SPH && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">SPH:</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{RE.SPH}</span>
            </div>
          )}
          {RE.CYL && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">CYL:</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{RE.CYL}</span>
            </div>
          )}
          {RE.AXIS && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">AXIS:</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{RE.AXIS}</span>
            </div>
          )}
          {RE.ADD && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">ADD:</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{RE.ADD}</span>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Left Eye */}
    {(LE?.SPH || LE?.CYL || LE?.AXIS || LE?.ADD) && (
      <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-md p-2 border border-white/40">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">L</span>
          </div>
          <span className="text-xs font-bold text-slate-700">Left Eye</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {LE.SPH && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">SPH:</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{LE.SPH}</span>
            </div>
          )}
          {LE.CYL && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">CYL:</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{LE.CYL}</span>
            </div>
          )}
          {LE.AXIS && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">AXIS:</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{LE.AXIS}</span>
            </div>
          )}
          {LE.ADD && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">ADD:</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{LE.ADD}</span>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>
    );
  };

  const getLensTypeDisplay = () => {
    if (!mounted) return null;
    
    // Show placeholder if no lens selection for testing
    if (!lensSelection) {
      return (
        <div className="text-center">
          <div className="text-xs text-gray-400">No Lens Selected</div>
        </div>
      );
    }

    const lensTypeMap = {
      "sv-near": "Near Vision",
      "sv-far": "Far Vision", 
      "sv-far-contact": "Far Vision Contact",
      "mf-bifocal": "Bifocal",
      "mf-progressive": "Progressive",
      "mf-contact": "Multifocal Contact"
    };

    return (
      <div className="text-center">
        <div className="text-xs text-gray-600 mb-1 font-medium">Selected Lens</div>
        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
          {lensTypeMap[lensSelection] || lensSelection}
        </div>
      </div>
    );
  };

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // Don't render on server side to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Lens Guru Logo"
                className="h-12 w-24 object-contain rounded-lg border border-amber-100 shadow-sm"
              />
            </div>
            <div className="flex-1 flex justify-center"></div>
            <div className="flex-shrink-0 min-w-0"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Left Corner */}
          <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
            <img
              src="/logo.png"
              alt="Lens Guru Logo"
              className="h-25 w-50 object-contain rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* Center - Lens Type (if available) */}
          <div className="flex-1 flex justify-center">
            {getLensTypeDisplay()}
          </div>

          {/* Right Corner - Prescription Info */}
          <div className="flex-shrink-0 min-w-0">
            {getPrescriptionDisplay()}
          </div>
        </div>
      </div>
    </header>
  );
}

// Helper function to trigger localStorage update event (use this when updating localStorage)
export const triggerStorageUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("localStorageUpdate"));
  }
};