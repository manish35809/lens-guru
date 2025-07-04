import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { LogOut, User, Eye, Glasses } from "lucide-react";

export default function Header() {
  const [prescription, setPrescription] = useState(null);
  const [lensSelection, setLensSelection] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Only run on client side
    if (typeof window === "undefined") return;

    // Define allowed emails
    const ALLOWED_EMAILS = [
      "shivaopticians2022@gmail.com",
      "saruparam12346@gmail.com",
      "shivalenshousejdp@gmail.com",
      "manishchoudhary35809@gmail.com",
    ];

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
  }, []);

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

  const getPrescriptionDisplay = () => {
    if (!mounted) return null;

    if (!prescription) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
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
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Empty Prescription</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {/* Right Eye */}
        {(RE?.SPH || RE?.CYL || RE?.AXIS || RE?.ADD) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">R</span>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">L</span>
            </div>
            <div className="flex items-center gap-2">
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

  const getLensTypeDisplay = () => {
    if (!mounted) return null;

    if (!lensSelection) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
          <Glasses className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">No Lens Selected</span>
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
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200">
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
      ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
      : user.email[0].toUpperCase();

    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
          <span className="text-sm font-medium text-indigo-700 hidden sm:block">
            {user.displayName || user.email.split('@')[0]}
          </span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
            <div className="p-4 bg-indigo-50 border-b border-indigo-100">
              <div className="text-sm font-semibold text-indigo-900">
                {user.displayName || "User"}
              </div>
              <div className="text-xs text-indigo-600 mt-1">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".relative")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  // Don't render on server side to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Lens Guru Logo"
                className="h-12 w-32 object-contain"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <img
              src="/logo.png"
              alt="Lens Guru Logo"
              className="h-12 w-32 lg:h-14 lg:w-36 object-contain transition-transform group-hover:scale-105"
            />
          </div>

          {/* Center Content - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {getLensTypeDisplay()}
            {getPrescriptionDisplay()}
          </div>

          {/* Right Side - User */}
          <div className="flex items-center gap-4">
            {/* Mobile Content */}
            <div className="md:hidden flex items-center gap-2">
              {prescription && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium text-blue-700">Rx</span>
                </div>
              )}
              {lensSelection && (
                <div className="flex items-center gap-1">
                  <Glasses className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-700">Lens</span>
                </div>
              )}
            </div>
            
            {getUserDisplay()}
          </div>
        </div>

        {/* Mobile Content Expanded */}
        <div className="md:hidden pb-4 space-y-3">
          {getLensTypeDisplay()}
          {getPrescriptionDisplay()}
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