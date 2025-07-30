import React, { useEffect, useRef, useState } from 'react';
import './InteractiveBlob.css';

const InteractiveBlob = () => {
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [currentPos, setCurrentPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animationFrameRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const animateBlob = () => {
      setCurrentPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.08,
        y: prev.y + (mousePos.y - prev.y) * 0.08
      }));
      
      animationFrameRef.current = requestAnimationFrame(animateBlob);
    };

    animationFrameRef.current = requestAnimationFrame(animateBlob);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos]);

  useEffect(() => {
    const time = Date.now() * 0.001;
    
    // Update main blob (follows cursor)
    if (blob1Ref.current) {
      const blob = blob1Ref.current;
      blob.style.transform = `translate(${currentPos.x - 800}px, ${currentPos.y - 800}px)`;
      
      const hue = (currentPos.x + currentPos.y) * 0.1 + time * 10;
      const saturation = 80 + Math.sin(time * 0.5) * 15;
      const lightness = 60 + Math.sin(time * 0.3) * 10;
      
      const r1 = 20 + Math.sin(time * 0.8) * 30;
      const r2 = 80 + Math.cos(time * 0.6) * 20;
      const r3 = 30 + Math.sin(time * 1.2) * 35;
      const r4 = 70 + Math.cos(time * 0.9) * 25;
      const r5 = 70 + Math.sin(time * 0.4) * 30;
      const r6 = 20 + Math.cos(time * 1.1) * 40;
      const r7 = 80 + Math.sin(time * 0.7) * 25;
      const r8 = 30 + Math.cos(time * 0.5) * 35;
      
      blob.style.borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r5}% ${r6}% ${r7}% ${r8}%`;
      
      blob.style.background = `
        radial-gradient(
          ellipse 150% 100% at ${20 + Math.sin(time * 0.3) * 30}% ${30 + Math.cos(time * 0.4) * 30}%,
          hsla(${hue % 360}, ${saturation}%, ${lightness}%, 0.8) 0%,
          hsla(${(hue + 80) % 360}, ${saturation}%, ${lightness - 15}%, 0.6) 50%,
          hsla(${(hue + 160) % 360}, ${saturation}%, ${lightness - 25}%, 0.3) 80%,
          transparent 100%
        )
      `;
    }
    
    // Update second blob (slower, different position)
    if (blob2Ref.current) {
      const blob = blob2Ref.current;
      const offsetX = currentPos.x * 0.3 + Math.sin(time * 0.2) * 200;
      const offsetY = currentPos.y * 0.4 + Math.cos(time * 0.15) * 150;
      blob.style.transform = `translate(${offsetX - 700}px, ${offsetY - 700}px)`;
      
      const hue2 = (currentPos.x * 0.05 + currentPos.y * 0.08) + time * 8 + 120;
      const r1 = 40 + Math.sin(time * 0.6 + 2) * 25;
      const r2 = 60 + Math.cos(time * 0.8 + 1) * 30;
      const r3 = 50 + Math.sin(time * 1.0 + 3) * 20;
      const r4 = 50 + Math.cos(time * 0.7 + 2) * 35;
      
      blob.style.borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r4}% ${r1}% ${r2}% ${r3}%`;
    }
    
    // Update third blob (independent movement)
    if (blob3Ref.current) {
      const blob = blob3Ref.current;
      const offsetX = window.innerWidth * 0.7 + Math.sin(time * 0.1) * 300;
      const offsetY = window.innerHeight * 0.3 + Math.cos(time * 0.12) * 200;
      blob.style.transform = `translate(${offsetX - 600}px, ${offsetY - 600}px)`;
      
      const r1 = 60 + Math.sin(time * 0.5 + 4) * 20;
      const r2 = 40 + Math.cos(time * 0.9 + 3) * 25;
      const r3 = 30 + Math.sin(time * 0.7 + 1) * 30;
      const r4 = 70 + Math.cos(time * 0.6 + 5) * 15;
      
      blob.style.borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r3}% ${r4}% ${r1}% ${r2}%`;
    }
  }, [currentPos]);

  return (
    <div className="interactive-blob-container">
      <div ref={blob1Ref} className="interactive-blob blob-main" />
      <div ref={blob2Ref} className="interactive-blob blob-secondary" />
      <div ref={blob3Ref} className="interactive-blob blob-tertiary" />
    </div>
  );
};

export default InteractiveBlob;