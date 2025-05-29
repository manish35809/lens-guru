// pages/[lensType]/frameType/lenses/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import lensData from "@/data/lensData.json";

export default function LensesPage() {
  const router = useRouter();
  const [filteredLenses, setFilteredLenses] = useState([]);
  const [power, setPower] = useState(null);
  const [lensType, setLensType] = useState(null);
  const [frameType, setFrameType] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const powerInfo = JSON.parse(localStorage.getItem("power"));
    const lensType = localStorage.getItem("lensSelection");
    const frame = localStorage.getItem("frameType");

    if (!powerInfo || !lensType) {
      router.push("/");
      return;
    }

    setPower(powerInfo);
    setLensType(lensType);
    setFrameType(frame);

    const matchedLenses = lensData.filter((lens) => {
      if (lens.lensType !== lensType) return false;

      const rp = (parseFloat(powerInfo.right.sph || 0) + parseFloat(powerInfo.right.cyl || 0)) || 0;
      const cyl = parseFloat(powerInfo.right.cyl || 0);

      const isCrossPower =
        parseFloat(powerInfo.right.sph) > 0 &&
        parseFloat(powerInfo.right.cyl) < 0 &&
        Math.abs(parseFloat(powerInfo.right.sph)) < Math.abs(cyl);

      const rpCheck = rp <= lens.rpMinus || rp <= lens.rpPlus;
      const cylCheck = Math.abs(cyl) <= lens.maxCylMinus || Math.abs(cyl) <= lens.maxCylPlus;
      const crossCheck = isCrossPower ? (lens.maxCylCross >= Math.abs(cyl)) : true;

      return rpCheck && cylCheck && crossCheck;
    });

    setFilteredLenses(matchedLenses);
  }, []);

  const applyFilters = () => {
    const filtered = lensData.filter((lens) => {
      return Object.entries(filters).every(([key, value]) => {
        return lens[key] === value;
      });
    });
    setFilteredLenses(filtered);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Select Your Lens</h1>
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className="w-1/4 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Filter Features</h2>
          {/* Add checkboxes or toggles for filters */}
          {/* Example: */}
          <label className="block mb-2">
            <input type="checkbox" onChange={(e) => setFilters(prev => ({ ...prev, resistScratches: e.target.checked }))} /> Resist Scratches
          </label>
          <button onClick={applyFilters} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Apply Filters</button>
        </aside>

        {/* Lens Display */}
        <section className="w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredLenses.map((lens, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <img src={lens.poster} alt={lens.name} className="rounded mb-2 w-full h-40 object-cover" />
              <h3 className="text-lg font-bold text-blue-700 mb-1">{lens.name}</h3>
              <p className="text-sm text-gray-600">Brand: {lens.brand}</p>
              <p className="text-sm text-gray-600">Material: {lens.lensMaterialCountry}</p>
              <p className="text-sm text-gray-600">Price: <s>₹{lens.srp}</s> <span className="text-green-600">₹{lens.specialPrice}</span></p>
              <ul className="text-xs text-gray-500 mt-2 list-disc pl-4">
                {lens.resistScratches && <li>Resist Scratches</li>}
                {lens.reducesGlare && <li>Reduces Glare</li>}
                {lens.photochromic && <li>Photochromic</li>}
              </ul>
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full">Select</button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
