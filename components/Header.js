import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { LogOut, Eye, Glasses, Menu, X } from "lucide-react";
import { ALLOWED_EMAILS } from "@/config/allowedEmails";

export default function Header({ user: propUser }) {
  const [prescription, setPrescription] = useState(null);
  const [lensSelection, setLensSelection] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(propUser);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(propUser);

    // Only run on client side
    if (typeof window === "undefined") return;

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // Check if user's email is in the allowed list
        if (!ALLOWED_EMAILS.includes(currentUser.email)) {
          console.log("Unauthorized email:", currentUser.email);
          // Automatically log out unauthorized users
          signOut(auth)
            .then(() => {
              // Clear localStorage
              localStorage.removeItem("prescription");
              localStorage.removeItem("lensSelection");
              // Redirect to unauthorized page or home
              window.location.href = "/unauthorized";
            })
            .catch((error) => {
              console.error("Error signing out unauthorized user:", error);
            });
          return;
        }
      }
      setUser(currentUser);
    });

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
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdate", handleStorageChange);
    };
  }, [propUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear localStorage on logout
      localStorage.removeItem("prescription");
      localStorage.removeItem("lensSelection");
      // Redirect to login or home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const getPrescriptionDisplay = (isMobile = false) => {
    if (!mounted) return null;

    if (!prescription) {
      return (
        <div
          className={`flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-full ${
            isMobile ? "w-full justify-center" : ""
          }`}
        >
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">No Prescription</span>
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
        <div
          className={`flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-full ${
            isMobile ? "w-full justify-center" : ""
          }`}
        >
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Empty Prescription</span>
        </div>
      );
    }

    if (isMobile) {
      // Simplified mobile view
      return (
        <div className="w-full space-y-2">
          {/* Right Eye */}
          {(RE?.SPH || RE?.CYL || RE?.AXIS || RE?.ADD) && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-full border border-blue-200">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">R</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {RE.SPH && (
                  <span className="font-medium text-blue-700">{RE.SPH}</span>
                )}
                {RE.CYL && (
                  <span className="font-medium text-blue-700">{RE.CYL}</span>
                )}
                {RE.AXIS && (
                  <span className="font-medium text-blue-700">{RE.AXIS}°</span>
                )}
                {RE.ADD && (
                  <span className="font-medium text-blue-700">+{RE.ADD}</span>
                )}
              </div>
            </div>
          )}

          {/* Left Eye */}
          {(LE?.SPH || LE?.CYL || LE?.AXIS || LE?.ADD) && (
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-full border border-purple-200">
              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">L</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {LE.SPH && (
                  <span className="font-medium text-purple-700">{LE.SPH}</span>
                )}
                {LE.CYL && (
                  <span className="font-medium text-purple-700">{LE.CYL}</span>
                )}
                {LE.AXIS && (
                  <span className="font-medium text-purple-700">
                    {LE.AXIS}°
                  </span>
                )}
                {LE.ADD && (
                  <span className="font-medium text-purple-700">+{LE.ADD}</span>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Right Eye */}
        {(RE?.SPH || RE?.CYL || RE?.AXIS || RE?.ADD) && (
          <div className="flex items-center gap-2 px-2 lg:px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">R</span>
            </div>
            <div className="flex items-center gap-1 lg:gap-2">
              {RE.SPH && (
                <span className="text-xs font-medium text-blue-700">
                  {RE.SPH}
                </span>
              )}
              {RE.CYL && (
                <span className="text-xs font-medium text-blue-700">
                  {RE.CYL}
                </span>
              )}
              {RE.AXIS && (
                <span className="text-xs font-medium text-blue-700">
                  {RE.AXIS}°
                </span>
              )}
              {RE.ADD && (
                <span className="text-xs font-medium text-blue-700">
                  +{RE.ADD}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Left Eye */}
        {(LE?.SPH || LE?.CYL || LE?.AXIS || LE?.ADD) && (
          <div className="flex items-center gap-2 px-2 lg:px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">L</span>
            </div>
            <div className="flex items-center gap-1 lg:gap-2">
              {LE.SPH && (
                <span className="text-xs font-medium text-purple-700">
                  {LE.SPH}
                </span>
              )}
              {LE.CYL && (
                <span className="text-xs font-medium text-purple-700">
                  {LE.CYL}
                </span>
              )}
              {LE.AXIS && (
                <span className="text-xs font-medium text-purple-700">
                  {LE.AXIS}°
                </span>
              )}
              {LE.ADD && (
                <span className="text-xs font-medium text-purple-700">
                  +{LE.ADD}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getLensTypeDisplay = (isMobile = false) => {
    if (!mounted) return null;

    if (!lensSelection) {
      return (
        <div
          className={`flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-full ${
            isMobile ? "w-full justify-center" : ""
          }`}
        >
          <Glasses className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">No Lens Selected</span>
        </div>
      );
    }

    const lensTypeMap = {
      "sv-near": "Near Vision",
      "sv-far": "Far Vision",
      "mf-bifocal": "Bifocal",
      "mf-progressive": "Progressive",
    };

    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-full border border-emerald-200 ${
          isMobile ? "w-full justify-center" : ""
        }`}
      >
        <Glasses className="w-4 h-4 text-emerald-600" />
        <span className="text-sm font-medium text-emerald-700">
          {lensTypeMap[lensSelection] || lensSelection}
        </span>
      </div>
    );
  };

  const getUserDisplay = () => {
    if (!user) return null;

    const initials = user.displayName
      ? user.displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : user.email[0].toUpperCase();

    return (
      <div className="flex items-center gap-2 lg:gap-3">
        {/* User Info */}
        <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-indigo-50 rounded-full border border-indigo-200">
          <div className="w-7 h-7 lg:w-8 lg:h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-xs lg:text-sm font-bold text-white">
              {initials}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-red-50 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-700 hidden sm:block">
            Sign Out
          </span>
        </button>
      </div>
    );
  };

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest(".mobile-menu-container")) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileMenu]);

  // Don't render on server side to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="w-32 sm:w-40 md:w-48 h-6 sm:h-8 md:h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-20 sm:w-32 h-6 sm:h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <img
                src="/logo.png"
                alt="Lens Guru Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain transition-transform duration-300 group-hover:scale-110 rounded-xl"
              />
            </div>

            {/* Desktop Content */}
            <div className="hidden lg:flex items-center gap-4">
              {getLensTypeDisplay()}
              {getPrescriptionDisplay()}
            </div>

            {/* Mobile Menu Button and User */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Status Indicators */}
              <div className="lg:hidden flex items-center gap-1 sm:gap-2">
                {prescription && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span className="text-xs font-medium text-blue-700 hidden sm:inline">
                      Rx
                    </span>
                  </div>
                )}
                {lensSelection && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-full">
                    <Glasses className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-700 hidden sm:inline">
                      Lens
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* User Display */}
              {getUserDisplay()}
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden mobile-menu-container border-t border-gray-200 pb-4 pt-4 space-y-3">
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 px-1">
                  Lens Selection
                </div>
                {getLensTypeDisplay(true)}
              </div>
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 px-1">
                  Prescription
                </div>
                {getPrescriptionDisplay(true)}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Confirm Sign Out
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to sign out? You will need to sign in again to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper function to trigger localStorage update event (use this when updating localStorage)
export const triggerStorageUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("localStorageUpdate"));
  }
};