import React, { useEffect, useRef } from 'react';
import './LiquidBackground.css';

const LiquidBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animationRef = useRef();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Noise function for smooth organic movement
    const noise = (x, y, t) => {
      const value = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.8) +
                    Math.sin(x * 0.02 + t * 1.3) * Math.cos(y * 0.02 + t * 0.9) * 0.5 +
                    Math.sin(x * 0.005 + t * 0.7) * Math.cos(y * 0.005 + t * 0.6) * 2;
      return value;
    };

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      timeRef.current += 0.002;
      
      // Smooth mouse following
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create multiple gradient layers
      const layers = 4;
      
      for (let layer = 0; layer < layers; layer++) {
        ctx.save();
        
        // Create clipping path for organic shape
        ctx.beginPath();
        const points = 100;
        const radius = Math.min(canvas.width, canvas.height) * 0.8;
        
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const baseX = canvas.width / 2;
          const baseY = canvas.height / 2;
          
          // Add noise-based distortion
          const noiseValue = noise(
            Math.cos(angle) * 100 + layer * 50,
            Math.sin(angle) * 100 + layer * 50,
            timeRef.current + layer * 0.5
          );
          
          // Mouse interaction
          const dx = mouseRef.current.x - baseX;
          const dy = mouseRef.current.y - baseY;
          const mouseDistance = Math.sqrt(dx * dx + dy * dy);
          const mouseAngle = Math.atan2(dy, dx);
          const angleDiff = Math.abs(angle - mouseAngle);
          const mouseInfluence = Math.max(0, 1 - mouseDistance / 300) * 
                                Math.max(0, 1 - angleDiff / Math.PI) * 50;
          
          const distortion = radius * 0.3 + noiseValue * 30 + mouseInfluence;
          const x = baseX + Math.cos(angle) * (radius + distortion);
          const y = baseY + Math.sin(angle) * (radius + distortion);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            // Use quadratic curves for smoothness
            const prevAngle = ((i - 1) / points) * Math.PI * 2;
            const prevNoise = noise(
              Math.cos(prevAngle) * 100 + layer * 50,
              Math.sin(prevAngle) * 100 + layer * 50,
              timeRef.current + layer * 0.5
            );
            const prevDistortion = radius * 0.3 + prevNoise * 30;
            const prevX = baseX + Math.cos(prevAngle) * (radius + prevDistortion);
            const prevY = baseY + Math.sin(prevAngle) * (radius + prevDistortion);
            
            const cpX = (prevX + x) / 2;
            const cpY = (prevY + y) / 2;
            
            ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
          }
        }
        
        ctx.closePath();
        ctx.clip();
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          canvas.width / 2 + Math.sin(timeRef.current + layer) * 50,
          canvas.height / 2 + Math.cos(timeRef.current + layer) * 50,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height)
        );
        
        // Layer-specific colors matching the reference
        if (layer === 0) {
          gradient.addColorStop(0, 'rgba(230, 180, 255, 0.6)');
          gradient.addColorStop(0.5, 'rgba(255, 120, 200, 0.4)');
          gradient.addColorStop(1, 'rgba(180, 140, 255, 0.2)');
        } else if (layer === 1) {
          gradient.addColorStop(0, 'rgba(255, 150, 220, 0.5)');
          gradient.addColorStop(0.5, 'rgba(200, 180, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 200, 230, 0.2)');
        } else if (layer === 2) {
          gradient.addColorStop(0, 'rgba(200, 160, 255, 0.4)');
          gradient.addColorStop(0.5, 'rgba(255, 180, 200, 0.3)');
          gradient.addColorStop(1, 'rgba(220, 200, 255, 0.1)');
        } else {
          gradient.addColorStop(0, 'rgba(255, 200, 255, 0.3)');
          gradient.addColorStop(0.5, 'rgba(230, 190, 255, 0.2)');
          gradient.addColorStop(1, 'rgba(255, 220, 240, 0.1)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add blur effect
        ctx.filter = `blur(${20 + layer * 10}px)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="liquid-background" />;
};

export default LiquidBackground;