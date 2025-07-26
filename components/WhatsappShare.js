import { useState } from "react";

const formatPower = (power) => {
  if (!power) return "";

  const formatEye = (eye, eyeName) => {
    if (!eye) return "";
    const parts = [];
    if (eye.SPH) parts.push(`SPH ${eye.SPH}`);
    if (eye.CYL) parts.push(`CYL ${eye.CYL}`);
    if (eye.AXIS) parts.push(`AXIS ${eye.AXIS}`);
    if (eye.ADD) parts.push(`ADD ${eye.ADD}`);
    return parts.length > 0 ? `${eyeName}: ${parts.join(", ")}` : "";
  };

  const { RE, LE } = power;
  const rightEye = formatEye(RE, "RE");
  const leftEye = formatEye(LE, "LE");
  return [rightEye, leftEye].filter(Boolean).join("\n");
};

export default function WhatsAppShareButton({ lens, prescription }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [patientName, setPatientName] = useState("");

  const handleShare = () => {
    const features = [
      { key: "clear", label: "Clear" },
      { key: "filterBlueVioletLight", label: "Blue Light Filter" },
      { key: "allowEssentialBlueLight", label: "Essential Blue Light" },
      { key: "photochromic", label: "Photochromic" },
      { key: "unbreakable", label: "Unbreakable" },
      { key: "tintable", label: "Tintable" },
    ];

    const enabledFeatures = features
      .filter((f) => lens[f.key])
      .map((f) => `✔️ ${f.label}`)
      .join("\n");

    const text = `📝 *Order No*: ${orderNo}
👤 *Patient Name*: ${patientName}

• *Lens Name*:
${lens.thickness?.index} ${lens.name}
(${lens.brand})

🔍 *Material*:
${enabledFeatures || "None"}

👓 *Lens Selected*:
• Type: ${lens.lensType}

📋 *Prescription*:
${formatPower(prescription)}`;

    const url = `https://wa.me/917727969952?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setIsModalOpen(false);
    setOrderNo("");
    setPatientName("");
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A12 12 0 0012 0C5.373 0 .001 5.372 0 12c0 2.125.555 4.097 1.523 5.818L0 24l6.395-1.678A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12 0-3.19-1.248-6.243-3.48-8.52zM12 22c-1.746 0-3.406-.446-4.876-1.26l-.349-.198-3.79 1 1.007-3.693-.229-.38A9.935 9.935 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.108-7.264c-.27-.135-1.604-.793-1.85-.883s-.429-.135-.607.135-.697.883-.854 1.064-.314.203-.583.068c-1.597-.795-2.643-1.42-3.709-3.209-.28-.483.28-.448.805-1.49.09-.18.045-.338-.023-.474-.068-.135-.607-1.457-.83-1.996-.22-.528-.446-.456-.607-.465l-.516-.01c-.18 0-.47.067-.717.338s-.94.916-.94 2.233.962 2.59 1.096 2.77c.135.18 1.89 2.883 4.588 4.043.641.276 1.14.44 1.53.56.642.203 1.226.174 1.69.106.515-.077 1.604-.655 1.83-1.29.226-.635.226-1.18.158-1.29-.068-.112-.248-.18-.518-.315z" />
        </svg>
        Share on WhatsApp
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl p-0 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 animate-pulse"
            style={{ animation: "modalSlideIn 0.3s ease-out" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.52 3.48A12 12 0 0012 0C5.373 0 .001 5.372 0 12c0 2.125.555 4.097 1.523 5.818L0 24l6.395-1.678A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12 0-3.19-1.248-6.243-3.48-8.52zM12 22c-1.746 0-3.406-.446-4.876-1.26l-.349-.198-3.79 1 1.007-3.693-.229-.38A9.935 9.935 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.108-7.264c-.27-.135-1.604-.793-1.85-.883s-.429-.135-.607.135-.697.883-.854 1.064-.314.203-.583.068c-1.597-.795-2.643-1.42-3.709-3.209-.28-.483.28-.448.805-1.49.09-.18.045-.338-.023-.474-.068-.135-.607-1.457-.83-1.996-.22-.528-.446-.456-.607-.465l-.516-.01c-.18 0-.47.067-.717.338s-.94.916-.94 2.233.962 2.59 1.096 2.77c.135.18 1.89 2.883 4.588 4.043.641.276 1.14.44 1.53.56.642.203 1.226.174 1.69.106.515-.077 1.604-.655 1.83-1.29.226-.635.226-1.18.158-1.29-.068-.112-.248-.18-.518-.315z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Share Order
                    </h2>
                    <p className="text-green-100 text-sm">
                      Enter details to continue
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Order Number Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Order Number
                </label>
                <input
                  type="text"
                  placeholder="Enter order number"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Patient Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Patient Name
                </label>
                <input
                  type="text"
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={!orderNo || !patientName}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A12 12 0 0012 0C5.373 0 .001 5.372 0 12c0 2.125.555 4.097 1.523 5.818L0 24l6.395-1.678A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12 0-3.19-1.248-6.243-3.48-8.52zM12 22c-1.746 0-3.406-.446-4.876-1.26l-.349-.198-3.79 1 1.007-3.693-.229-.38A9.935 9.935 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.108-7.264c-.27-.135-1.604-.793-1.85-.883s-.429-.135-.607.135-.697.883-.854 1.064-.314.203-.583.068c-1.597-.795-2.643-1.42-3.709-3.209-.28-.483.28-.448.805-1.49.09-.18.045-.338-.023-.474-.068-.135-.607-1.457-.83-1.996-.22-.528-.446-.456-.607-.465l-.516-.01c-.18 0-.47.067-.717.338s-.94.916-.94 2.233.962 2.59 1.096 2.77c.135.18 1.89 2.883 4.588 4.043.641.276 1.14.44 1.53.56.642.203 1.226.174 1.69.106.515-.077 1.604-.655 1.83-1.29.226-.635.226-1.18.158-1.29-.068-.112-.248-.18-.518-.315z" />
                  </svg>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
