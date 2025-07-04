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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-200/30 rounded-full blur-lg animate-bounce delay-500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-pink-200/30 rounded-full blur-lg animate-bounce delay-700"></div>
      </div>
      
      {/* Main container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Login card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
          <div className="text-center space-y-6">
            {/* Welcome message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">
                Welcome Back
              </h2>
              <p className="text-slate-600">
                Sign in to access your vision dashboard
              </p>
            </div>
            
            {/* Features preview */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Prescriptions
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                <Glasses className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Lens Selection
                </span>
              </div>
            </div>
            
            {/* Login button */}
            <button
              onClick={handleLogin}
              className="group relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>Continue with Gmail</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            
            {/* Divider */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
              <span className="text-sm text-slate-500 font-medium">Secure Login</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            </div>
            
            {/* Security features */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Protected by Google OAuth</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>✓ Secure Authentication</span>
                <span>✓ Privacy Protected</span>
                <span>✓ Data Encrypted</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-10 right-10 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-500"></div>
    </div>
  );
}