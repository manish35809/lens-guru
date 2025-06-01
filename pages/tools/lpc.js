import { useState } from "react";

export default function SRPCalculator() {
  const [lens, setLens] = useState('');
  const [fitting, setFitting] = useState('');
  const [accessories, setAccessories] = useState('');
  const [discount, setDiscount] = useState('');

  const lensNum = parseFloat(lens) || 0;
  const fittingNum = parseFloat(fitting) || 0;
  const accessoriesNum = parseFloat(accessories) || 0;
  const discountPercent = parseFloat(discount) || 0;

  const srp = (lensNum * 4) + (fittingNum * 2) + accessoriesNum;
  const discountAmount = (srp * discountPercent) / 100;
  const discountedPrice = srp - discountAmount;

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md border border-gray-100">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-2 shadow-sm">
            <div className="text-white text-lg">📊</div>
          </div>
          <h1 className="text-xl font-bold text-gray-800">SRP Calculator</h1>
          <p className="text-gray-500 text-xs mt-1">
            (Lens × 4) + (Fitting × 2) + Accessories
          </p>
        </div>

        {/* Inputs in Grid - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Lens Cost */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              💎 Lens
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="text"
                value={lens}
                onChange={handleInputChange(setLens)}
                placeholder="5000"
                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Fitting Cost */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              🔧 Fitting
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="text"
                value={fitting}
                onChange={handleInputChange(setFitting)}
                placeholder="1500"
                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Accessories Cost */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              ✨ Extras
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="text"
                value={accessories}
                onChange={handleInputChange(setAccessories)}
                placeholder="2000"
                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              🏷️ Discount %
            </label>
            <div className="relative">
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
              <input
                type="text"
                value={discount}
                onChange={handleInputChange(setDiscount)}
                placeholder="10"
                className="w-full pl-2 pr-6 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-3">
          {/* SRP Result */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-2 text-white text-xs font-bold">
                  ₹
                </div>
                <span className="text-sm font-medium text-gray-700">SRP:</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(srp)}
              </div>
            </div>
          </div>

          {/* Discounted Price Result */}
          {discountPercent > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-2 text-white text-xs font-bold">
                    🏷️
                  </div>
                  <span className="text-sm font-medium text-gray-700">Final Price:</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.max(0, discountedPrice))}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 flex justify-between items-center">
                <span>Discount Applied ({discountPercent}%):</span>
                <span className="font-medium text-red-600">-{formatCurrency(discountAmount)}</span>
              </div>
            </div>
          )}

          {/* Calculation Breakdown */}
          {(lensNum > 0 || fittingNum > 0 || accessoriesNum > 0) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-2 font-medium">Calculation Breakdown:</p>
              <div className="text-xs text-gray-600 bg-white rounded-lg p-2">
                <div className="mb-1">
                  <span className="text-blue-600 font-medium">{formatCurrency(lensNum)}</span>
                  <span className="text-gray-500"> × 4 + </span>
                  <span className="text-purple-600 font-medium">{formatCurrency(fittingNum)}</span>
                  <span className="text-gray-500"> × 2 + </span>
                  <span className="text-green-600 font-medium">{formatCurrency(accessoriesNum)}</span>
                  <span className="text-gray-500"> = </span>
                  <span className="text-blue-700 font-bold">{formatCurrency(srp)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="pt-1 border-t border-gray-100">
                    <span className="text-blue-700 font-medium">{formatCurrency(srp)}</span>
                    <span className="text-gray-500"> - </span>
                    <span className="text-red-600 font-medium">{formatCurrency(discountAmount)}</span>
                    <span className="text-gray-500"> = </span>
                    <span className="text-green-700 font-bold">{formatCurrency(Math.max(0, discountedPrice))}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}