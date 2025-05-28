import { useRouter } from "next/router";
import { useState } from "react";

const frameOptions = [
  { label: "TR/Acetate Frame", value: "acetate" },
  { label: "Full Metal Frame", value: "full-metal" },
  { label: "Half Metal Frame", value: "half-metal" },
  { label: "Rimless Frame", value: "rimless" },
];

export default function FrameTypePage() {
  const router = useRouter();
  const { lensType } = router.query;
  const [selectedFrame, setSelectedFrame] = useState(null);

  const handleSelect = (value) => {
    setSelectedFrame(value);
    localStorage.setItem("frameType", value);
    router.push(`/${lensType}/frameType/lenses`);
  };

  return (
    <main className="bg-gradient-to-br from-white to-blue-50 p-8 text-gray-800">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Choose Frame Type</h1>
        <div className="grid gap-6">
          {frameOptions.map((frame) => (
            <button
              key={frame.value}
              onClick={() => handleSelect(frame.value)}
              className="px-6 py-4 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl shadow hover:shadow-lg transition"
            >
              {frame.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
