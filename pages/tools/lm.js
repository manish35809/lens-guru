import { useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { Eye } from "lucide-react";

const COLUMN_COUNT = 4;
const CARD_HEIGHT = 620;
const CARD_WIDTH = 365;
const CHUNK_SIZE = 1000;

// Options for select fields
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

const frameTypeOptions = [
  { value: "acetate", label: "Acetate" },
  { value: "full-metal", label: "Full Metal" },
  { value: "half-metal", label: "Half Metal" },
  { value: "rimless", label: "Rimless" },
];

export default function LensManager() {
  const [lenses, setLenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    lensType: "",
    brand: "",
    lensMaterialCountry: "",
    poster: "",
    powerRange: {
      rpMinus: "",
      rpPlus: "",
      maxCylMinus: "",
      maxCylPlus: "",
      maxCylCross: "",
    },
    addRange: {
      start: "",
      end: "",
    },
    photochromicColors: [],
    time: "",
    thickness: {
      index: "",
      type: "",
    },
    lensCoatingWarranty: "",
    frameTypeRecommended: [],
    srp: "",
    specialPrice: "",
    // Boolean fields
    filterBlueVioletLight: false,
    photochromic: false,
    unbreakable: false,
    tintable: false,
    clear: false,
    resistScratches: false,
    reducesGlare: false,
    sunUvProtection: false,
    lowReflection: false,
    repelsWater: false,
    resistSmudges: false,
    repelsDust: false,
    allowEssentialBlueLight: false,
    drivePlus: false,
    authenticityCard: false,
    lensMaterialWarranty: false,
    isHighCyl: false,
  });

  const handleImport = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        let index = 0;
        const chunkedLoad = () => {
          setLenses((prev) => [
            ...prev,
            ...imported.slice(index, index + CHUNK_SIZE),
          ]);
          index += CHUNK_SIZE;
          if (index < imported.length) {
            setTimeout(chunkedLoad, 50);
          }
        };
        chunkedLoad();
      } catch {
        alert("Invalid JSON");
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleEdit = (lens) => {
    setEditingId(lens.id);
    setForm(lens);
    setShowForm(true);
  };

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

  const handleArrayChange = (e, fieldName) => {
    const value = e.target.value;
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setForm((prev) => ({
      ...prev,
      [fieldName]: array,
    }));
  };

  const handleSave = () => {
    if (editingId) {
      // Update existing lens
      setLenses((prev) =>
        prev.map((lens) =>
          lens.id === editingId ? { ...form, id: editingId } : lens
        )
      );
    } else {
      // Add new lens
      const newLens = {
        ...form,
        id: Date.now().toString(),
      };
      setLenses((prev) => [...prev, newLens]);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      id: "",
      name: "",
      lensType: "",
      brand: "",
      lensMaterialCountry: "",
      poster: "",
      powerRange: {
        rpMinus: "",
        rpPlus: "",
        maxCylMinus: "",
        maxCylPlus: "",
        maxCylCross: "",
      },
      addRange: {
        start: "",
        end: "",
      },
      photochromicColors: [],
      time: "",
      thickness: {
        index: "",
        type: "",
      },
      lensCoatingWarranty: "",
      frameTypeRecommended: [],
      srp: "",
      specialPrice: "",
      filterBlueVioletLight: false,
      photochromic: false,
      unbreakable: false,
      tintable: false,
      clear: false,
      resistScratches: false,
      reducesGlare: false,
      sunUvProtection: false,
      lowReflection: false,
      repelsWater: false,
      resistSmudges: false,
      repelsDust: false,
      allowEssentialBlueLight: false,
      drivePlus: false,
      authenticityCard: false,
      lensMaterialWarranty: false,
      isHighCyl: false,
    });
    setShowForm(false);
  };

  const handleDownload = () => {
    const json = JSON.stringify(lenses, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "lenses.json";
    link.click();

    URL.revokeObjectURL(url); // cleanup
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

  const LensGrid = ({ data }) => {
    const rowCount = Math.ceil(data.length / COLUMN_COUNT);

    const Cell = ({ columnIndex, rowIndex, style }) => {
  const index = rowIndex * COLUMN_COUNT + columnIndex;
  if (index >= data.length) return null;
  const lens = data[index];

  return (
    <div style={style} className="p-2">
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 overflow-hidden">
        {/* Image Section */}
        <div className="relative">
          <img
            src={lens.poster}
            alt={lens.name}
            loading="lazy"
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
            <Eye size={14} className="text-gray-600" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
              {lens.name}
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600 font-medium">
                {getLensTypeLabel(lens.lensType)}
              </span>
              <span className="text-gray-500">{lens.brand}</span>
            </div>
          </div>

          {/* Price Info */}
          <div className="mb-3 p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">SRP</span>
              <span className="text-sm line-through text-gray-400">
                ₹{lens.srp?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Special Price</span>
              <span className="text-base font-semibold text-green-600">
                ₹{lens.specialPrice?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Key Specs */}
          <div className="space-y-1 mb-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Power Range:</span>
              <span className="text-gray-700 font-medium">
                {lens.powerRange?.rpMinus} to {lens.powerRange?.rpPlus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Index:</span>
              <span className="text-gray-700 font-medium">
                {lens.thickness?.index}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Warranty:</span>
              <span className="text-gray-700 font-medium">
                {lens.lensCoatingWarranty}m
              </span>
            </div>
          </div>

          {/* Key Features - Condensed */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {lens.photochromic && (
                <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">
                  Photo
                </span>
              )}
              {lens.filterBlueVioletLight && (
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                  Blue Cut
                </span>
              )}
              {lens.reducesGlare && (
                <span className="text-xs px-2 py-1 bg-gray-50 text-gray-700 rounded">
                  Anti-Glare
                </span>
              )}
              {lens.unbreakable && (
                <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
                  Poly
                </span>
              )}
              {lens.sunUvProtection && (
                <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded">
                  UV-P
                </span>
              )}
              {/* Show only top 3-4 features to keep it clean */}
              {(lens.repelsWater || lens.resistSmudges || lens.repelsDust) && (
                <span className="text-xs px-2 py-1 bg-cyan-50 text-cyan-700 rounded">
                  Coated
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200"
            onClick={() => handleEdit(lens)}
          >
            Edit Lens
          </button>
        </div>
      </div>
    </div>
  );
};

    return (
      <Grid
        columnCount={COLUMN_COUNT}
        columnWidth={CARD_WIDTH}
        height={typeof window !== "undefined" ? window.innerHeight - 150 : 600}
        rowCount={rowCount}
        rowHeight={CARD_HEIGHT}
        width={CARD_WIDTH * COLUMN_COUNT + 100}
      >
        {Cell}
      </Grid>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Lens Manager
              </h1>
              <p className="text-slate-600">
                Manage your lens inventory with ease
              </p>
            </div>
            <div className="flex gap-4">
              <label className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImport}
                  className="hidden"
                />
                Import JSON
              </label>
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close Form" : "Add New Lens"}
              </button>
              <button
                className="bg-slate-600 text-white px-4 py-2 rounded mr-2"
                onClick={handleDownload}
              >
                Download JSON
              </button>
            </div>
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
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors duration-200"
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

            {/* Material Details */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
                Material Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  {
                    field: "filterBlueVioletLight",
                    label: "Filter Blue Violet Light",
                  },
                  { field: "photochromic", label: "Photochromic" },
                  { field: "unbreakable", label: "Unbreakable" },
                  { field: "tintable", label: "Tintable" },
                  { field: "clear", label: "Clear" },
                ].map(({ field, label }) => (
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
                    <span className="text-sm font-medium text-slate-700">
                      {label}
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
                  { field: "resistScratches", label: "Resist Scratches" },
                  { field: "reducesGlare", label: "Reduces Glare" },
                  { field: "sunUvProtection", label: "Sun UV Protection" },
                  { field: "lowReflection", label: "Low Reflection" },
                  { field: "repelsWater", label: "Repels Water" },
                  { field: "resistSmudges", label: "Resist Smudges" },
                  { field: "repelsDust", label: "Repels Dust" },
                  {
                    field: "allowEssentialBlueLight",
                    label: "Allow Essential Blue Light",
                  },
                  { field: "drivePlus", label: "Drive Plus" },
                ].map(({ field, label }) => (
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
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">
                Additional Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { field: "authenticityCard", label: "Authenticity Card" },
                  {
                    field: "lensMaterialWarranty",
                    label: "Lens Material Warranty",
                  },
                  { field: "isHighCyl", label: "High Cylinder" },
                ].map(({ field, label }) => (
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
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200 font-medium"
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
        {lenses.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Your Lenses
              </h2>
              <p className="text-slate-600">Total: {lenses.length} lenses</p>
            </div>
            <LensGrid data={lenses} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
            <div className="text-slate-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No lenses yet
            </h3>
            <p className="text-slate-500 mb-6">
              Get started by importing JSON data or adding a new lens
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add Your First Lens
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}
