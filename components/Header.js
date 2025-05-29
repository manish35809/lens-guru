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

      setPrescription(
        updatedPrescription ? JSON.parse(updatedPrescription) : null
      );
      setLensSelection(
        updatedLensSelection ? JSON.parse(updatedLensSelection) : null
      );
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
        <div className="text-center sm:text-right">
          <div className="text-xs text-gray-400">No Prescription</div>
        </div>
      );
    }

    const { RE, LE } = prescription;
    const hasValues =
      Object.values(RE || {}).some(
        (val) => val && val.toString().trim() !== ""
      ) ||
      Object.values(LE || {}).some(
        (val) => val && val.toString().trim() !== ""
      );

    if (!hasValues) {
      return (
        <div className="text-center sm:text-right">
          <div className="text-xs text-gray-400">Empty Prescription</div>
        </div>
      );
    }

    return (
      <div className="shadow-sm w-full sm:min-w-96">
        {/* Eyes Section - Responsive Design */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Right Eye */}
          {(RE?.SPH || RE?.CYL || RE?.AXIS || RE?.ADD) && (
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:border-blue-300">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    R
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Right Eye
                </span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 sm:flex-wrap">
                {RE.SPH && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="text-xs font-medium text-blue-600">
                      SPH:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-blue-200 shadow-sm">
                      {RE.SPH}
                    </span>
                  </div>
                )}
                {RE.CYL && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="text-xs font-medium text-blue-600">
                      CYL:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-blue-200 shadow-sm">
                      {RE.CYL}
                    </span>
                  </div>
                )}
                {RE.AXIS && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="text-xs font-medium text-blue-600">
                      AXIS:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-blue-200 shadow-sm">
                      {RE.AXIS}
                    </span>
                  </div>
                )}
                {RE.ADD && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="text-xs font-medium text-blue-600">
                      ADD:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-blue-200 shadow-sm">
                      {RE.ADD}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Left Eye */}
          {(LE?.SPH || LE?.CYL || LE?.AXIS || LE?.ADD) && (
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:border-purple-300">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    L
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Left Eye
                </span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 sm:flex-wrap">
                {LE.SPH && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="text-xs font-medium text-purple-600">
                      SPH:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-purple-200 shadow-sm">
                      {LE.SPH}
                    </span>
                  </div>
                )}
                {LE.CYL && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="text-xs font-medium text-purple-600">
                      CYL:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-purple-200 shadow-sm">
                      {LE.CYL}
                    </span>
                  </div>
                )}
                {LE.AXIS && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="text-xs font-medium text-purple-600">
                      AXIS:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-purple-200 shadow-sm">
                      {LE.AXIS}
                    </span>
                  </div>
                )}
                {LE.ADD && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <span className="text-xs font-medium text-purple-600">
                      ADD:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border border-purple-200 shadow-sm">
                      {LE.ADD}
                    </span>
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
      "mf-contact": "Multifocal Contact",
    };

    return (
      <div className="text-center">
        <div className="text-xs text-gray-600 mb-1 font-medium">
          Selected Lens
        </div>
        <div className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium border border-green-200">
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
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-4">
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Lens Guru Logo"
                className="h-20 w-40 object-contain rounded-lg border border-amber-100 shadow-sm"
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
    <>
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Mobile Layout - Stacked */}
          <div className="block sm:hidden">
            {/* Top Row - Logo and Lens Type */}
            <div className="flex justify-between items-center py-2">
              <div
                className="flex-shrink-0 cursor-pointer"
                onClick={handleLogoClick}
              >
                <img
                  src="/logo.png"
                  alt="Lens Guru Logo"
                  className="h-20 w-40 object-contain rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
              <div className="flex-1 flex justify-center px-2">
                {getLensTypeDisplay()}
              </div>
            </div>

            {/* Bottom Row - Prescription (if available) */}
            {prescription && (
              <div className="pb-2">{getPrescriptionDisplay()}</div>
            )}
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden sm:flex justify-between items-center py-4">
            {/* Logo - Left Corner */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={handleLogoClick}
            >
              <img
                src="/logo.png"
                alt="Lens Guru Logo"
                className="h-20 w-40 lg:h-26 lg:w-48 object-contain rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
              />
            </div>

            {/* Center - Lens Type (if available) */}
            <div className="flex-1 flex justify-center px-4">
              {getLensTypeDisplay()}
            </div>

            {/* Right Corner - Prescription Info */}
            <div className="flex-shrink-0 min-w-0 max-w-md">
              {getPrescriptionDisplay()}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// Helper function to trigger localStorage update event (use this when updating localStorage)
export const triggerStorageUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("localStorageUpdate"));
  }
};
