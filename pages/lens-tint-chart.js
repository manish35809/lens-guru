import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
} from "lucide-react";

const LensTintGallery = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulate fetching images - using placeholder images for demo
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Using placeholder images for demonstration
        const imageList = [
          "/tintChart/1.jpg",
          "/tintChart/2.jpg",
          "/tintChart/3.jpg",
        ];

        setImages(imageList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    setZoom(1);
    setRotation(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoom(1);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = async () => {
    try {
      const imageUrl = images[currentImageIndex];
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `tint-chart-${currentImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "r":
        case "R":
          handleRotate();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading lens tint charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Lens Tint Gallery
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our comprehensive collection of lens tint charts and color
              options
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Total Charts: {images.length}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">
              No tint charts found in the directory.
            </p>
          </div>
        ) : (
          <>
            {/* Grid Layout for Multiple Images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  {/* A4 Aspect Ratio Container */}
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "210/297" }}
                  >
                    <img
                      src={image}
                      alt={`Lens Tint Chart ${index + 1}`}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ZoomIn className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                      Tint Chart {index + 1}
                    </h3>
                    <p className="text-gray-500 text-sm">Chart #{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modal for Fullscreen View */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="relative w-full h-full max-w-6xl max-h-full">
            {/* Modal Controls */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleRotate}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                title="Rotate (R)"
              >
                <RotateCw className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleDownload}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={closeModal}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                  title="Previous (←)"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                  title="Next (→)"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Modal Image */}
            <div className="w-full h-full flex items-center justify-center p-16">
              <div
                className="relative transition-transform duration-300 origin-center max-w-full max-h-full"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }}
              >
                <img
                  src={images[currentImageIndex]}
                  alt={`Lens Tint Chart ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  style={{ maxHeight: "70vh", width: "auto" }}
                />
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-medium">
                {currentImageIndex + 1} of {images.length}
              </span>
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-sm">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LensTintGallery;
