import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/config";
import { Mail, ArrowRight, Eye, Glasses, Sparkles } from "lucide-react";

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/"; // redirect to home
    } catch (error) {
      console.error("Login error:", error);
      // You could add error handling here
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden px-4 py-6">
      {/* Simplified animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-16 w-20 h-20 bg-blue-200/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 bg-purple-200/20 rounded-full blur-xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-emerald-200/20 rounded-full blur-lg animate-bounce delay-500"></div>
      </div>
      
      {/* Main container */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Login card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="text-center space-y-4">
            {/* Welcome message */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-600">
                Sign in to access your vision dashboard
              </p>
            </div>
            
            {/* Features preview - stacked for mobile */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Prescriptions
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 bg-purple-50 rounded-lg">
                <Glasses className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Lens Selection
                </span>
              </div>
            </div>
            
            {/* Login button */}
            <button
              onClick={handleLogin}
              className="group relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Continue with Gmail</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            
            {/* Divider */}
            <div className="flex items-center gap-3 py-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
              <span className="text-xs text-slate-500 font-medium">Secure Login</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            </div>
            
            {/* Security features */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Protected by Google OAuth</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
                <span>✓ Secure</span>
                <span>✓ Private</span>
                <span>✓ Encrypted</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Minimal decorative elements */}
      <div className="absolute top-8 right-8 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
    </div>
  );
}