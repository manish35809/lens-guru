import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function FramesPage() {
  const [prescription, setPrescription] = useState({
    RE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
    LE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
  });
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
    alert("Prescription saved!");
  };

  const clearPrescription = () => {
    const empty = {
      RE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
      LE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
    };
    setPrescription(empty);
    localStorage.removeItem("prescription");
    setIsSaved(false);
  };

  const goToLensType = () => {
    if (hasAddition()) {
      router.push("/mf");
    } else {
      router.push("/sv");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-800 p-6">
      {/* Logo and Heading */}
      <div className="text-center mt-12">
        <img
          src="/logo.png"
          alt="Lens Guru Logo"
          className="mx-auto w-72 h-36 mb-4 rounded-3xl border-2 border-amber-100 shadow-2xl"
        />
      </div>

      {/* Prescription Form */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">PRESCRIPTION POWER</h2>
        {["RE", "LE"].map((eye) => (
          <div key={eye} className="mb-4">
            <h3 className="font-bold text-lg text-gray-700 mb-2">{eye}:</h3>
            <div className="grid grid-cols-4 gap-4">
              {["SPH", "CYL", "AXIS", "ADD"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={prescription[eye][field]}
                  onChange={(e) => handleChange(eye, field, e.target.value)}
                  className="p-2 border border-gray-300 rounded-xl shadow-sm text-center"
                />
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-6">
          <button
            onClick={savePrescription}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 shadow-md"
          >
            Save
          </button>
          <button
            onClick={clearPrescription}
            className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-md"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Next Button */}
      {isSaved && (
        <div className="mt-6">
          <button
            onClick={goToLensType}
            className="px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 shadow-md"
          >
            Next ➡
          </button>
        </div>
      )}

    </main>
  );
}
