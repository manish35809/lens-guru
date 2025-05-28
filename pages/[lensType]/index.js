import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";

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
    router.push("/frames");
  };

  const renderInfo = () => {
    switch (visionChoice) {
      case "near":
        return (
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-4 text-left">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Near Vision Lenses</h2>
            <Image
              src="https://images.myopiaprofile.com/tr:w-1200,h-675,fo-auto/api/KnowledgeArticle/4864cf87-7fbd-4666-6992-08db1612fe23/download/HeroImage/a1b95f30-fbc3-4a73-a939-08db1612fd32"
              alt="Near Vision Example"
              width={400}
              height={200}
              className="rounded-xl mb-3"
            />
            <p className="mb-4 text-gray-600">
              Near vision lenses help you see objects that are close, like books or mobile screens.
            </p>
            <button
              onClick={() => saveAndRedirect("sv-near")}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
            >
              Select Near Vision Lens
            </button>
          </div>
        );
      case "far":
        return (
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-4 text-left">
            <h2 className="text-xl font-bold text-purple-700 mb-2">Far Vision Lenses</h2>
            <Image
              src="https://cdn.allaboutvision.com/images/illustration-distance-vision-720x532.jpg"
              alt="Far Vision Example"
              width={400}
              height={200}
              className="rounded-xl mb-3"
            />
            <p className="mb-4 text-gray-600">
              Far vision lenses improve clarity for distant objects like road signs or television screens.
            </p>
            <button
              onClick={() => saveAndRedirect("sv-far")}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600"
            >
              Select Far Vision Lens
            </button>
          </div>
        );
      case "combined":
        return (
          <div className="text-left bg-white p-6 rounded-2xl shadow-lg mt-4">
            <h2 className="text-xl font-bold text-pink-700 mb-2">Combined Vision Lenses</h2>
            <p className="text-gray-600 mb-4">
              Combined lenses offer both near and far vision in a single lens. Choose from:
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleCombo("bifocal")}
                className="px-5 py-3 bg-blue-100 hover:bg-blue-200 rounded-xl shadow text-blue-700 w-full"
              >
                🔍 Bifocal Lenses
              </button>
              <button
                onClick={() => handleCombo("progressive")}
                className="px-5 py-3 bg-green-100 hover:bg-green-200 rounded-xl shadow text-green-700 w-full"
              >
                🌈 Progressive Lenses
              </button>

              {comboType === "bifocal" && (
                <div className="mt-4">
                  <h3 className="font-bold text-blue-700 mb-2">Bifocal Lenses</h3>
                  <Image
                    src="https://i0.wp.com/images.ctfassets.net/6jpeaipefazr/3mKqY44fpJH0a5Ce8kpFGO/b88a20cf5c42c9d861bd96eaa4d3a3e8/Bifocal.jpg"
                    alt="Bifocal Lenses"
                    width={400}
                    height={200}
                    className="rounded-xl mb-3"
                  />
                  <p className="text-gray-600 mb-4">
                    Bifocal lenses have two distinct optical zones for distance and reading. You can visibly see the division.
                  </p>
                  <button
                    onClick={() => saveAndRedirect("mf-bifocal")}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
                  >
                    Select Bifocal Lens
                  </button>
                </div>
              )}

              {comboType === "progressive" && (
                <div className="mt-4">
                  <h3 className="font-bold text-green-700 mb-2">Progressive Lenses</h3>
                  <Image
                    src="https://cdn.allaboutvision.com/images/illustration-progressive-lens-720x532.jpg"
                    alt="Progressive Lenses"
                    width={400}
                    height={200}
                    className="rounded-xl mb-3"
                  />
                  <p className="text-gray-600 mb-4">
                    Progressive lenses offer a smooth, gradual change in prescription strength for near, intermediate, and far distances — no visible lines.
                  </p>
                  <button
                    onClick={() => saveAndRedirect("mf-progressive")}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600"
                  >
                    Select Progressive Lens
                  </button>
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
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-800">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Choose Your Vision Type</h1>
        {lensType === "sv" || lensType === "mf" ? (
          <div className="flex flex-col gap-4 mb-6">
            <button
              onClick={() => handleSelect("near")}
              className="px-6 py-4 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-700 shadow"
            >
              👓 Near Vision
            </button>
            <button
              onClick={() => handleSelect("far")}
              className="px-6 py-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 shadow"
            >
              🔭 Far Vision
            </button>
            {lensType === "mf" && (
              <button
                onClick={() => handleSelect("combined")}
                className="px-6 py-4 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 shadow"
              >
                🔁 Combined (Near + Far)
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Loading lens type...</p>
        )}

        <div className="mt-6">{renderInfo()}</div>
      </div>
    </main>
  );
}
