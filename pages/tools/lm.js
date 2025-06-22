import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Download, Upload, Eye } from "lucide-react";

const initialData = [
  {
    id: 1,
    lensType: "sv-far",
    powerRange: {
      rpMinus: -8.0,
      rpPlus: 4.0,
      maxCylMinus: -4.0,
      maxCylPlus: 2.0,
      maxCylCross: -6.0,
    },
    name: "Essilor Varilux Progressive",
    poster:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=200&fit=crop",
    srp: 15000,
    specialPrice: 12000,
    authenticityCard: true,
    lensMaterialCountry: "France",
    brand: "Essilor",
    time: 7,
    thickness: {
      index: 1.67,
      type: "thin",
    },
    resistScratches: true,
    reducesGlare: true,
    resistSmudges: true,
    repelsWater: true,
    repelsDust: true,
    filterBlueVioletLight: true,
    allowEssentialBlueLight: true,
    sunUvProtection: true,
    unbreakable: false,
    clear: true,
    tintable: true,
    photochromic: true,
    lensMaterialWarranty: true,
    lowReflection: true,
    drivePlus: true,
    photochromicColors: ["Gray", "Brown"],
    lensCoatingWarranty: 24,
    addRange: {
      start: 1.0,
      end: 3.5,
    },
    frameTypeRecommended: ["full-rim", "half-rim"],
  },
];

const lensTypeOptions = [
  { value: "sv-near", label: "Single Vision - Near" },
  { value: "sv-far", label: "Single Vision - Far" },
  { value: "mf-bifocal", label: "Multifocal - Bifocal" },
  { value: "mf-progressive", label: "Multifocal - Progressive" },
];

const thicknessTypeOptions = [
  { value: "standard", label: "Standard" },
  { value: "thin", label: "Thin" },
  { value: "thinnest", label: "Thinnest" },
];

// acetate, full-metal, half-metal, rimless
const frameTypeOptions = [
  { value: "acetate", label: "Acetate" },
  { value: "full-metal", label: "Full Metal" },
  { value: "half-metal", label: "Half Metal" },
  { value: "rimless", label: "Rimless" },
];

export default function Home() {
  const [lenses, setLenses] = useState([]);
  const [form, setForm] = useState({
    id: null,
    lensType: "mf-progressive",
    powerRange: {
      rpMinus: "",
      rpPlus: "",
      maxCylMinus: "",
      maxCylPlus: "",
      maxCylCross: "",
    },
    name: "",
    poster: "",
    srp: "",
    specialPrice: "",
    authenticityCard: false,
    lensMaterialCountry: "",
    brand: "",
    time: "",
    thickness: {
      index: "",
      type: "",
    },
    resistScratches: false,
    reducesGlare: false,
    resistSmudges: false,
    repelsWater: false,
    repelsDust: false,
    allowEssentialBlueLight: false,
    sunUvProtection: false,
    clear: false,
    filterBlueVioletLight: false,
    photochromic: false,
    unbreakable: false,
    tintable: false,
    lensMaterialWarranty: false,
    isHighCyl: false,
    photochromicColors: [],
    lensCoatingWarranty: "",
    addRange: {
      start: "",
      end: "",
    },
    frameTypeRecommended: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLenses(initialData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value.split(",").map((item) => item.trim()),
    }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      lensType: "mf-progressive",
      powerRange: {
        rpMinus: "",
        rpPlus: "",
        maxCylMinus: "",
        maxCylPlus: "",
        maxCylCross: "",
      },
      name: "",
      poster: "",
      srp: "",
      specialPrice: "",
      authenticityCard: false,
      lensMaterialCountry: "",
      brand: "",
      time: "",
      thickness: {
        index: "",
        type: "",
      },
      resistScratches: false,
      reducesGlare: false,
      resistSmudges: false,
      repelsWater: false,
      repelsDust: false,
      filterBlueVioletLight: false,
      allowEssentialBlueLight: false,
      sunUvProtection: false,
      clear: false,
      unbreakable: false,
      tintable: false,
      photochromic: false,
      lensMaterialWarranty: false,
      lowReflection: false,
      drivePlus: false,
      photochromicColors: [],
      lensCoatingWarranty: "",
      addRange: {
        start: "",
        end: "",
      },
      frameTypeRecommended: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    const newLens = { ...form, id: editingId || Date.now() };
    if (editingId) {
      setLenses((prev) =>
        prev.map((lens) => (lens.id === editingId ? newLens : lens))
      );
    } else {
      setLenses((prev) => [...prev, newLens]);
    }
    resetForm();
  };

  const handleEdit = (lens) => {
    setForm(lens);
    setEditingId(lens.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setLenses((prev) => prev.filter((lens) => lens.id !== id));
  };

  const handleImport = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);

        setLenses(imported);
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(lenses, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lensData.json";
    a.click();
  };

  const getLensTypeLabel = (value) => {
    return (
      lensTypeOptions.find((option) => option.value === value)?.label || value
    );
  };

  const getThicknessTypeLabel = (value) => {
    return (
      thicknessTypeOptions.find((option) => option.value === value)?.label ||
      value
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Lens Manager
            </h1>
            <p className="text-slate-600">
              Manage your optical lens collection with ease
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add Lens
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Upload size={20} />
              Export
            </button>
            <label className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer">
              <Download size={20} />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Edit Lens" : "Add New Lens"}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lens Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter lens name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lens Type
                  </label>
                  <select
                    name="lensType"
                    value={form.lensType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select lens type</option>
                    {lensTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Brand
                  </label>
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Material Country
                  </label>
                  <input
                    name="lensMaterialCountry"
                    value={form.lensMaterialCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Country of origin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Poster URL
                  </label>
                  <input
                    name="poster"
                    value={form.poster}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Image URL"
                  />
                </div>
              </div>

              {/* Power Range & Additional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  Power Range
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      RP Minus
                    </label>
                    <input
                      name="powerRange.rpMinus"
                      type="number"
                      step="0.25"
                      value={form.powerRange.rpMinus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="-8.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      RP Plus
                    </label>
                    <input
                      name="powerRange.rpPlus"
                      type="number"
                      step="0.25"
                      value={form.powerRange.rpPlus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+4.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Max Cyl Minus
                    </label>
                    <input
                      name="powerRange.maxCylMinus"
                      type="number"
                      step="0.25"
                      value={form.powerRange.maxCylMinus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="-4.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Max Cyl Plus
                    </label>
                    <input
                      name="powerRange.maxCylPlus"
                      type="number"
                      step="0.25"
                      value={form.powerRange.maxCylPlus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+2.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Cyl Cross
                  </label>
                  <input
                    name="powerRange.maxCylCross"
                    type="number"
                    step="0.25"
                    value={form.powerRange.maxCylCross}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="-6.00"
                  />
                </div>

                {form.addRange !== null && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Add Range Start
                      </label>
                      <input
                        name="addRange.start"
                        type="number"
                        step="0.25"
                        value={form.addRange.start}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="1.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Add Range End
                      </label>
                      <input
                        name="addRange.end"
                        type="number"
                        step="0.25"
                        value={form.addRange.end}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="3.50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Photochromic Colors
                  </label>
                  <input
                    value={form.photochromicColors.join(", ")}
                    onChange={(e) => handleArrayChange(e, "photochromicColors")}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Gray, Brown (comma separated)"
                  />
                </div>
              </div>

              {/* Pricing & Technical */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">
                  Pricing & Technical
                </h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Processing Time (days)
                  </label>
                  <input
                    name="time"
                    type="number"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Thickness Index
                    </label>
                    <input
                      name="thickness.index"
                      type="number"
                      step="0.01"
                      value={form.thickness.index}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="1.50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Thickness Type
                    </label>
                    <select
                      name="thickness.type"
                      value={form.thickness.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select type</option>
                      {thicknessTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Coating Warranty (months)
                  </label>
                  <input
                    name="lensCoatingWarranty"
                    type="number"
                    value={form.lensCoatingWarranty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Frame Types
                  </label>
                  <select
                    multiple
                    value={form.frameTypeRecommended}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value
                      );
                      setForm((prev) => ({
                        ...prev,
                        frameTypeRecommended: selected,
                      }));
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {frameTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      SRP (₹)
                    </label>
                    <input
                      name="srp"
                      type="number"
                      value={form.srp}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Special Price (₹)
                    </label>
                    <input
                      name="specialPrice"
                      type="number"
                      value={form.specialPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Material */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
                Material Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "filterBlueVioletLight",
                  "photochromic",
                  "unbreakable",
                  "tintable",
                  "clear",
                ].map((field) => (
                  <label
                    key={field}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      name={field}
                      checked={form[field]}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coating Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
                Coating Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "resistScratches",
                  "reducesGlare",
                  "sunUvProtection",
                  "lowReflection",
                  "repelsWater",
                  "resistSmudges",
                  "repelsDust",
                  "allowEssentialBlueLight",
                  "drivePlus",
                ].map((field) => (
                  <label
                    key={field}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      name={field}
                      checked={form[field]}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other Info */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
                More Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {["authenticityCard", "lensMaterialWarranty", "isHighCyl"].map(
                  (field) => (
                    <label
                      key={field}
                      className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        name={field}
                        checked={form[field]}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {editingId ? "Update Lens" : "Add Lens"}
              </button>
            </div>
          </div>
        )}

        {/* Lens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lenses.map((lens) => (
            <div
              key={lens.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={lens.poster}
                  alt={lens.name}
                  loading="lazy"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Eye size={16} className="text-slate-600" />
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {lens.name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {getLensTypeLabel(lens.lensType)}
                    </span>
                    <span className="text-sm text-slate-600">{lens.brand}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">SRP:</span>
                    <span className="font-semibold text-slate-800">
                      ₹{lens.srp?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Special Price:
                    </span>
                    <span className="font-semibold text-emerald-600">
                      ₹{lens.specialPrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Power Range:</span>
                    <span className="text-sm font-medium text-slate-800">
                      {lens.powerRange?.rpMinus} to {lens.powerRange?.rpPlus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Thickness:</span>
                    <span className="text-sm font-medium text-slate-800">
                      {lens.thickness?.index} (
                      {getThicknessTypeLabel(lens.thickness?.type)})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Warranty:</span>
                    <span className="text-sm font-medium text-slate-800">
                      {lens.lensCoatingWarranty} months
                    </span>
                  </div>
                </div>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {lens.photochromic && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Photochromic
                    </span>
                  )}
                  {lens.sunUvProtection && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      UV Protection
                    </span>
                  )}
                  {lens.filterBlueVioletLight && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Blue Light Filter
                    </span>
                  )}
                  {lens.allowEssentialBlueLight && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      Essential Blue Light
                    </span>
                  )}
                  {lens.resistScratches && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Scratch Resistant
                    </span>
                  )}
                  {lens.resistSmudges && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      Smudge Resistant
                    </span>
                  )}
                  {lens.repelsWater && (
                    <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                      Water Repellent
                    </span>
                  )}
                  {lens.repelsDust && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      Dust Repellent
                    </span>
                  )}
                  {lens.reducesGlare && (
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                      Anti-Glare
                    </span>
                  )}
                  {lens.unbreakable && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Unbreakable
                    </span>
                  )}
                  {lens.tintable && (
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      Tintable
                    </span>
                  )}
                  {lens.clear && (
                    <span className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded-full">
                      Clear
                    </span>
                  )}
                  {lens.lensMaterialWarranty && (
                    <span className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded-full">
                      Material Warranty
                    </span>
                  )}
                  {lens.isHighCyl && (
                    <span className="text-xs bg-teal-100 text-yellow-700 px-2 py-1 rounded-full">
                      High Cylindrical
                    </span>
                  )}
                  {lens.lowReflection && (
                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">
                      Low Reflection
                    </span>
                  )}
                  {lens.drivePlus && (
                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">
                      Drive Plus
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(lens)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover "
                  >
                    <Edit size={16} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-600">
                      Edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(lens)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100"
                  >
                    <Trash2 size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
