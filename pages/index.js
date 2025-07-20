import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/router";
import { triggerStorageUpdate } from "@/components/Header";

// Sensitivity configuration
const DRAG_SENSITIVITY = {
  MOUSE: 20,
  TOUCH: 20
};

// Memoized AxisInput component
const AxisInput = memo(({ value, onChange, eye }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = useCallback((e) => {
    const val = e.target.value;
    setInputValue(val);

    const numVal = parseInt(val);
    if (val === "" || (numVal >= 1 && numVal <= 180)) {
      setIsValid(true);
      onChange(val);
    } else {
      setIsValid(false);
    }
  }, [onChange]);

  const handleBlur = useCallback(() => {
    const numVal = parseInt(inputValue);
    if (inputValue && (isNaN(numVal) || numVal < 1 || numVal > 180)) {
      setInputValue("");
      onChange("");
      setIsValid(true);
    }
  }, [inputValue, onChange]);

  const inputClassName = useMemo(() => 
    `w-full h-20 text-center text-lg font-bold bg-white/90 border-2 rounded-lg shadow-sm transition-all duration-200 ${
      !isValid
        ? "border-red-400 text-red-600"
        : inputValue
        ? "border-emerald-400/70 text-emerald-600"
        : "border-slate-200/70 text-slate-700 hover:border-slate-300"
    }`, [isValid, inputValue]);

  return (
    <div className="group">
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        Axis
      </label>
      <div className="relative">
        <input
          type="number"
          min="1"
          max="180"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="1-180"
          className={inputClassName}
        />
        
        {inputValue && (
          <>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
              °
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full"></div>
          </>
        )}

        {!isValid && (
          <div className="mt-1 text-xs text-red-500 text-center">
            1-180°
          </div>
        )}
      </div>
    </div>
  );
});

// Compact ScrollSelector component with enhanced preview
const ScrollSelector = memo(({ field, value, onChange, eye }) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dragStartY = useRef(0);
  const lastDragY = useRef(0);
  const accumulatedDelta = useRef(0);
  const rafId = useRef(null);

  // Memoized field configurations
  const fieldConfig = useMemo(() => {
    const fieldConfigs = {
      SPH: { min: -24.0, max: 20.0, step: 0.25, unit: "" },
      CYL: { min: -10.0, max: 6.0, step: 0.25, unit: "" },
      AXIS: { min: 1, max: 180, step: 1, unit: "°" },
      ADD: { min: 0.75, max: 4.0, step: 0.25, unit: "" },
    };
    return fieldConfigs[field];
  }, [field]);

  // Memoized values array
  const values = useMemo(() => {
    const vals = [];
    for (let i = fieldConfig.min; i <= fieldConfig.max; i += fieldConfig.step) {
      vals.push(parseFloat(i.toFixed(2)));
    }
    return vals;
  }, [fieldConfig]);

  // Memoized current index calculation
  const validIndex = useMemo(() => {
    const currentValue = parseFloat(value) || 0;
    const currentIndex = values.findIndex(
      (v) => Math.abs(v - currentValue) < 0.001
    );
    return currentIndex >= 0 ? currentIndex : values.findIndex((v) => v === 0);
  }, [value, values]);

  // Memoized display values
  const displayValues = useMemo(() => ({
    prev: validIndex > 0 ? values[validIndex - 1] : null,
    current: values[validIndex] || 0,
    next: validIndex < values.length - 1 ? values[validIndex + 1] : null,
  }), [validIndex, values]);

  // Memoized format function
  const formatValue = useCallback((val) => {
    if (val === null) return "";
    if (field === "AXIS") return `${val}${fieldConfig.unit}`;
    return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
  }, [field, fieldConfig.unit]);

  // Optimized change handler with RAF
  const updateValue = useCallback((newIndex) => {
    if (rafId.current) return;
    
    rafId.current = requestAnimationFrame(() => {
      if (newIndex !== validIndex && newIndex >= 0 && newIndex < values.length) {
        onChange(values[newIndex].toString());
      }
      rafId.current = null;
    });
  }, [validIndex, values, onChange]);

  // Optimized wheel handler
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(values.length - 1, validIndex + delta));
    updateValue(newIndex);
  }, [validIndex, values.length, updateValue]);

  // Optimized mouse move with RAF
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const deltaY = lastDragY.current - e.clientY;
    accumulatedDelta.current += deltaY;
    
    const sensitivity = DRAG_SENSITIVITY.MOUSE;
    const steps = Math.floor(Math.abs(accumulatedDelta.current) / sensitivity);
    
    if (steps > 0) {
      const direction = accumulatedDelta.current > 0 ? steps : -steps;
      const newIndex = Math.max(0, Math.min(values.length - 1, validIndex + direction));
      updateValue(newIndex);
      accumulatedDelta.current = accumulatedDelta.current % sensitivity;
    }
    
    lastDragY.current = e.clientY;
  }, [isDragging, validIndex, values.length, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsActive(false);
    accumulatedDelta.current = 0;
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setIsActive(true);
    dragStartY.current = e.clientY;
    lastDragY.current = e.clientY;
    accumulatedDelta.current = 0;
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    setIsActive(true);
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartY.current = touch.clientY;
    lastDragY.current = touch.clientY;
    accumulatedDelta.current = 0;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length === 0) return;

    e.preventDefault();
    const touch = e.touches[0];
    const deltaY = lastDragY.current - touch.clientY;
    accumulatedDelta.current += deltaY;
    
    const sensitivity = DRAG_SENSITIVITY.TOUCH;
    const steps = Math.floor(Math.abs(accumulatedDelta.current) / sensitivity);
    
    if (steps > 0) {
      const direction = accumulatedDelta.current > 0 ? steps : -steps;
      const newIndex = Math.max(0, Math.min(values.length - 1, validIndex + direction));
      updateValue(newIndex);
      accumulatedDelta.current = accumulatedDelta.current % sensitivity;
    }
    
    lastDragY.current = touch.clientY;
  }, [isDragging, validIndex, values.length, updateValue]);

  const handleTouchEnd = useCallback(() => {
    setIsActive(false);
    setIsDragging(false);
    accumulatedDelta.current = 0;
  }, []);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMove = (e) => handleMouseMove(e);
      const handleUp = (e) => handleMouseUp(e);
      
      document.addEventListener("mousemove", handleMove, { passive: false });
      document.addEventListener("mouseup", handleUp, { passive: false });
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Memoized field labels
  const fieldLabel = useMemo(() => ({
    SPH: "Sphere",
    CYL: "Cylinder", 
    AXIS: "Axis",
    ADD: "Addition",
  }[field]), [field]);

  // Memoized class names
  const containerClassName = useMemo(() => 
    `relative w-full h-20 bg-white/90 border-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing select-none overflow-hidden transition-all duration-200 touch-manipulation ${
      isActive
        ? "border-blue-400/80 shadow-md shadow-blue-400/20"
        : value
        ? "border-emerald-400/70 shadow-md"
        : "border-slate-200/70 hover:border-slate-300"
    } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`, 
    [isActive, value, isDragging]
  );

  const currentValueClassName = useMemo(() => 
    `text-lg font-bold text-center transition-all duration-200 ${
      isActive ? "scale-105" : "scale-100"
    } ${value ? "text-emerald-600" : "text-slate-700"}`,
    [isActive, value]
  );

  return (
    <div className="group">
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {fieldLabel}
      </label>
      <div className="relative">
        <div
          ref={containerRef}
          className={containerClassName}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none", 
            touchAction: "none",
            userSelect: "none",
            willChange: isActive ? 'transform' : 'auto'
          }}
        >
          {/* Compact scroll indicators */}
          <div className="absolute right-1.5 top-1 text-slate-400 text-xs opacity-60">↑</div>
          <div className="absolute right-1.5 bottom-1 text-slate-400 text-xs opacity-60">↓</div>

          {/* Enhanced value display with better preview */}
          <div className="h-full flex flex-col items-center justify-center relative py-1">
            {/* Previous value - more visible */}
            <div className="text-slate-400 text-xs font-medium opacity-70 leading-none mb-0.5">
              {displayValues.prev !== null ? formatValue(displayValues.prev) : ""}
            </div>

            {/* Current value */}
            <div className={currentValueClassName}>
              {formatValue(displayValues.current)}
            </div>

            {/* Next value - more visible */}
            <div className="text-slate-400 text-xs font-medium opacity-70 leading-none mt-0.5">
              {displayValues.next !== null ? formatValue(displayValues.next) : ""}
            </div>
          </div>

          {/* Active overlay */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 pointer-events-none rounded-lg"></div>
          )}
        </div>

        {/* Value indicator */}
        {value && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full"></div>
        )}
      </div>
    </div>
  );
});

// Main component with simplified core functionality
export default function OptimizedPrescriptionForm() {
  const router = useRouter();
  const [prescription, setPrescription] = useState({
    RE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
    LE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
  });
  const [isSaved, setIsSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    localStorage.removeItem("lensSelection");
    const saved = localStorage.getItem("prescription");
    if (saved) {
      setPrescription(JSON.parse(saved));
      setIsSaved(true);
    }
  }, []);

  // Memoized change handler
  const handleChange = useCallback((eye, field, value) => {
    setPrescription((prev) => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value },
    }));
    setIsSaved(false);
  }, []);

  // Memoized validation functions
  const isValidPrescription = useCallback(() => {
    const { RE, LE } = prescription;
    const fields = ["SPH", "CYL", "AXIS", "ADD"];
    return fields.some((field) => RE[field] || LE[field]);
  }, [prescription]);

  const hasAddition = useCallback(() => {
    const addRE = prescription.RE.ADD?.trim();
    const addLE = prescription.LE.ADD?.trim();
    return addRE !== "" || addLE !== "";
  }, [prescription]);

  // Core save functionality from index copy.js
  const savePrescription = useCallback(() => {
    if (!isValidPrescription()) {
      alert("Invalid prescription. Please enter at least one value.");
      return;
    }
    localStorage.setItem("prescription", JSON.stringify(prescription));
    setIsSaved(true);
    setShowSuccess(true);
    triggerStorageUpdate();

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  }, [isValidPrescription, prescription]);

  const clearPrescription = useCallback(() => {
    const empty = {
      RE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
      LE: { SPH: "", CYL: "", AXIS: "", ADD: "" },
    };
    setPrescription(empty);
    localStorage.removeItem("prescription");
    localStorage.removeItem("lensSelection");
    localStorage.removeItem("frameType");

    setIsSaved(false);
    setShowSuccess(false);
    triggerStorageUpdate();
  }, []);

  // Core navigation functionality from index copy.js
  const goToLensType = useCallback(() => {
    if (hasAddition()) {
      router.push("/mf");
    } else {
      router.push("/sv");
    }
  }, [hasAddition, router]);
  return (
    <main className=" bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Simplified background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/15 to-pink-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1">
          
          {/* Success Message */}
          {showSuccess && (
            <div className="fixed top-4 right-4 z-50 bg-emerald-500/90 text-white px-4 py-2 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span className="font-medium text-sm">Prescription saved!</span>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-2">
              Enter Your Prescription
            </h1>
            <p className="text-slate-600 text-sm">Enter your prescription values</p>
          </div>

          {/* Prescription Form */}
          <div className="bg-white/80 border border-white/20 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            {/* Eye Selection Cards */}
            <div className="space-y-4">
              {["RE", "LE"].map((eye) => (
                <div
                  key={eye}
                  className="bg-white/70 border border-white/30 rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        eye === "RE"
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                          : "bg-gradient-to-r from-purple-400 to-pink-500"
                      }`}
                    />
                    <h3
                      className={`text-lg font-bold ${
                        eye === "RE"
                          ? "text-emerald-600"
                          : "text-purple-600"
                      }`}
                    >
                      {eye === "RE" ? "Right Eye (OD)" : "Left Eye (OS)"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["SPH", "CYL", "AXIS", "ADD"].map((field) => (
                      field === "AXIS" ? (
                        <AxisInput
                          key={field}
                          value={prescription[eye][field]}
                          onChange={(value) => handleChange(eye, field, value)}
                          eye={eye}
                        />
                      ) : (
                        <ScrollSelector
                          key={field}
                          field={field}
                          value={prescription[eye][field]}
                          onChange={(value) => handleChange(eye, field, value)}
                          eye={eye}
                        />
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center">
            <button
              onClick={savePrescription}
              disabled={!isValidPrescription()}
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                isValidPrescription()
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-blue-500/25 hover:scale-105"
                  : "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-500 cursor-not-allowed"
              }`}
            >
              💾 Save Prescription
            </button>

            <button
              onClick={clearPrescription}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all duration-200 font-semibold"
            >
              🗑️ Clear All
            </button>
          </div>

          {!isValidPrescription() && (
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl">
              <div className="flex items-center gap-2 text-amber-700">
                <span>💡</span>
                <span className="text-sm font-medium">
                  Please enter at least one prescription value to continue
                </span>
              </div>
            </div>
          )}

          {/* Next Button */}
          {isSaved && (
            <div className="text-center">
              <button
                onClick={goToLensType}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-200 font-bold"
              >
                🚀 Continue to Lens Selection
              </button>

              <div className="mt-3 text-center">
                <p className="text-slate-600 text-sm">
                  {hasAddition()
                    ? "📖 Detected reading addition - Multifocal lenses recommended"
                    : "👁️ Single vision lenses will be recommended"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}