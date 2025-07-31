import React, { useState, useEffect } from 'react';

const ImageCycler = ({ images, interval = 1300, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Preload all images
  useEffect(() => {
    const preloadImages = () => {
      images.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(index));
        };
        img.src = src;
      });
    };

    preloadImages();
  }, [images]);

  // Check if all images are loaded
  useEffect(() => {
    if (loadedImages.size === images.length && images.length > 0) {
      setIsLoading(false);
    }
  }, [loadedImages, images.length]);

  // Cycle through images
  useEffect(() => {
    if (!isLoading && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [images.length, interval, isLoading]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`image-cycler ${className}`}>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Hero image ${index + 1}`}
          className={`cycler-image ${index === currentIndex ? 'active' : ''}`}
          style={{
            display: index === currentIndex ? 'block' : 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ))}
    </div>
  );
};

export default ImageCycler;