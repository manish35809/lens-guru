import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { triggerStorageUpdate } from "@/components/Header";

export default function FramesPage() {
  const [prescription, setPrescription] = useState({
    RE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
    LE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
  });
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("lensSelection");
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
    triggerStorageUpdate(); // Add this line to update header
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
    triggerStorageUpdate(); // Add this line to update header
  };

  const goToLensType = () => {
    if (hasAddition()) {
      router.push("/mf");
    } else {
      router.push("/sv");
    }
  };

  return (
    <main className=" flex flex-col justify-between items-center bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-800 p-6">
    {/* Prescription Form */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-4 my-4 border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-2">PRESCRIPTION POWER</h2>
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
        <div className="mt-2">
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
