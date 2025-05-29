import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { triggerStorageUpdate } from "@/components/Header";

export default function LensTypePage() {
  const router = useRouter();
  const { lensType } = router.query;
  const [visionChoice, setVisionChoice] = useState(null);
  const [comboType, setComboType] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("lensSelection");
    if (stored) {
      setVisionChoice(JSON.parse(stored));
    }
  }, []);

  const handleSelect = (type) => setVisionChoice(type);
  const handleCombo = (type) => setComboType(type);

  const saveAndRedirect = (selection) => {
    localStorage.setItem("lensSelection", JSON.stringify(selection));
    triggerStorageUpdate();

    if (selection === "sv-far-contact" || selection === "mf-contact") {
      router.push(`/${lensType}/contact-lenses`);
    } else {
      router.push(`/${lensType}/frameType`);
    }
  };

  const renderInfo = () => {
    switch (visionChoice) {
      case "near":
        return (
          <div className="backdrop-blur-lg bg-white/80 border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl mt-6 text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"></div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                  Near Vision Lenses
                </h2>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-4 shadow-xl">
                <Image
                  src="https://www.verywellhealth.com/thmb/0owMzY0zAzM2RiZTg2ZjY3ZDA5OTY4OGYzMDQwZGY3ZDZhNTA4Mzk4Mw==/near-vision-56a134da5f9b58b7d0bc709f.jpg"
                  alt="Near Vision Example"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <p className="mb-6 text-slate-600 leading-relaxed">
                Near vision lenses help you see objects that are close, like books
                or mobile screens with crystal clarity.
              </p>
              <button
                onClick={() => saveAndRedirect("sv-near")}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 font-semibold border border-cyan-400/20"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Select Near Vision Lens</span>
                  <span className="text-cyan-200">→</span>
                </span>
              </button>
            </div>
          </div>
        );
      case "far":
        return (
          <div className="backdrop-blur-lg bg-white/80 border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl mt-6 text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-violet-400/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-400/50"></div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
                  Far Vision Lenses
                </h2>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-4 shadow-xl">
                <Image
                  src="https://cdn.allaboutvision.com/images/illustration-distance-vision-720x532.jpg"
                  alt="Far Vision Example"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <p className="mb-6 text-slate-600 leading-relaxed">
                Far vision lenses improve clarity for distant objects like road
                signs and television screens with perfect precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => saveAndRedirect("sv-far")}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 font-semibold border border-purple-400/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Select Far Vision Lens</span>
                    <span className="text-purple-200">→</span>
                  </span>
                </button>
                <button
                  onClick={() => saveAndRedirect("sv-far-contact")}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300 font-semibold border border-indigo-400/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Select Contact Lens</span>
                    <span className="text-indigo-200">→</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      case "combined":
        return (
          <div className="backdrop-blur-lg bg-white/80 border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl mt-6 text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-teal-400/10 to-cyan-400/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg shadow-emerald-400/50"></div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  Combined Vision Lenses
                </h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Combined lenses offer both near and far vision in a single lens.
                Choose your preferred style:
              </p>
              <div className="grid gap-4 mb-6">
                <button
                  onClick={() => handleCombo("bifocal")}
                  className={`p-4 rounded-2xl transition-all duration-300 border ${
                    comboType === "bifocal"
                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/40 shadow-lg shadow-blue-500/20"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/40 hover:border-blue-400/60 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔍</span>
                    <span className="font-semibold text-slate-700">Bifocal Lenses</span>
                  </div>
                </button>
                <button
                  onClick={() => handleCombo("progressive")}
                  className={`p-4 rounded-2xl transition-all duration-300 border ${
                    comboType === "progressive"
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/40 shadow-lg shadow-emerald-500/20"
                      : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/40 hover:border-emerald-400/60 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌈</span>
                    <span className="font-semibold text-slate-700">Progressive Lenses</span>
                  </div>
                </button>
              </div>

              {comboType === "bifocal" && (
                <div className="border-t border-gradient-to-r from-blue-200/50 to-indigo-200/50 pt-6">
                  <h3 className="font-bold text-blue-700 mb-4 text-lg">
                    Bifocal Lenses
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden mb-4 shadow-xl">
                    <Image
                      src="https://i0.wp.com/images.ctfassets.net/6jpeaipefazr/3mKqY44fpJH0a5Ce8kpFGO/b88a20cf5c42c9d861bd96eaa4d3a3e8/Bifocal.jpg"
                      alt="Bifocal Lenses"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Bifocal lenses have two distinct optical zones for distance
                    and reading. You can visibly see the division line.
                  </p>
                  <button
                    onClick={() => saveAndRedirect("mf-bifocal")}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 font-semibold border border-blue-400/20"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Select Bifocal Lens</span>
                      <span className="text-blue-200">→</span>
                    </span>
                  </button>
                </div>
              )}

              {comboType === "progressive" && (
                <div className="border-t border-gradient-to-r from-emerald-200/50 to-teal-200/50 pt-6">
                  <h3 className="font-bold text-emerald-700 mb-4 text-lg">
                    Progressive Lenses
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden mb-4 shadow-xl">
                    <Image
                      src="https://cdn.allaboutvision.com/images/illustration-progressive-lens-720x532.jpg"
                      alt="Progressive Lenses"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Progressive lenses offer a smooth, gradual change in
                    prescription strength for near, intermediate, and far
                    distances — no visible lines.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => saveAndRedirect("mf-progressive")}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 font-semibold border border-emerald-400/20"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>Select Progressive Lens</span>
                        <span className="text-emerald-200">→</span>
                      </span>
                    </button>
                    <button
                      onClick={() => saveAndRedirect("mf-contact")}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-300 font-semibold border border-teal-400/20"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>Multifocal Contact Lens</span>
                        <span className="text-teal-200">→</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg shadow-blue-400/50"></div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Choose Your Vision Type
              </h1>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-400/50"></div>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Select the perfect lens solution tailored to your vision needs
            </p>
          </div>

          {/* Vision Type Selection */}
          {lensType === "sv" || lensType === "mf" ? (
            <div className="grid gap-4 sm:gap-6 mb-8 max-w-2xl mx-auto">
              <button
                onClick={() => handleSelect("far")}
                className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/40 hover:border-purple-400/60 backdrop-blur-sm shadow-lg hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-4">
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">🔭</span>
                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mb-1">Far Vision</h3>
                    <p className="text-slate-600 text-sm sm:text-base">Perfect for distance clarity</p>
                  </div>
                  <span className="text-purple-400 group-hover:translate-x-1 transition-transform duration-300 ml-auto">→</span>
                </div>
              </button>

              <button
                    onClick={() => handleSelect("near")}
                    className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-200/40 hover:border-cyan-400/60 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">👓</span>
                      <div className="text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-cyan-700 mb-1">Near Vision</h3>
                        <p className="text-slate-600 text-sm sm:text-base">Ideal for reading and close work</p>
                      </div>
                      <span className="text-cyan-400 group-hover:translate-x-1 transition-transform duration-300 ml-auto">→</span>
                    </div>
                  </button>

              {lensType === "mf" && (
                <>
                  <button
                    onClick={() => handleSelect("combined")}
                    className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/40 hover:border-emerald-400/60 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/20 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">🔁</span>
                      <div className="text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-1">Combined Vision</h3>
                        <p className="text-slate-600 text-sm sm:text-base">Near + Far in one lens</p>
                      </div>
                      <span className="text-emerald-400 group-hover:translate-x-1 transition-transform duration-300 ml-auto">→</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl">
                <div className="animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"></div>
                <span className="text-slate-600 font-medium">Loading lens options...</span>
              </div>
            </div>
          )}

          {/* Vision Info Display */}
          <div className="max-w-3xl mx-auto">
            {renderInfo()}
          </div>
        </div>
      </div>
    </main>
  );
}