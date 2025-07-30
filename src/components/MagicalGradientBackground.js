import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MagicalGradientBackground.css';

gsap.registerPlugin(ScrollTrigger);

const MagicalGradientBackground = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const frameRef = useRef(0);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    // Fragment shader for magical gradient effect
    const fragmentShader = `
      uniform float uTime;
      uniform float uScrollProgress;
      uniform vec2 uResolution;

      varying vec2 vUv;

      // Smooth noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        
        // Create flowing effect based on time and scroll
        float scrollOffset = uScrollProgress * 2.0;
        float timeOffset = uTime * 0.1;
        
        // Create multiple layers of noise for depth
        float noise1 = snoise(vec2(uv.x * 2.0 - timeOffset, uv.y * 2.0 - scrollOffset)) * 0.5;
        float noise2 = snoise(vec2(uv.x * 3.0 + timeOffset * 0.5, uv.y * 3.0 - scrollOffset * 0.7)) * 0.3;
        float noise3 = snoise(vec2(uv.x * 5.0 - timeOffset * 0.3, uv.y * 5.0 - scrollOffset * 0.5)) * 0.2;
        
        float combinedNoise = noise1 + noise2 + noise3;
        
        // Create gradient position
        float gradientPos = uv.y + combinedNoise * 0.3 + scrollOffset * 0.5;
        
        // Define color stops for magical gradient
        vec3 color1 = vec3(0.0, 0.0, 0.8);     // Deep blue
        vec3 color2 = vec3(0.4, 0.0, 0.8);     // Purple
        vec3 color3 = vec3(0.8, 0.0, 0.4);     // Magenta
        vec3 color4 = vec3(1.0, 0.3, 0.0);     // Orange
        vec3 color5 = vec3(1.0, 0.2, 0.8);     // Pink
        
        // Smooth gradient mixing
        vec3 finalColor;
        float smoothFactor = 3.0;
        
        if (gradientPos < 0.25) {
          finalColor = mix(color1, color2, smoothstep(0.0, 0.25, gradientPos) * smoothFactor);
        } else if (gradientPos < 0.5) {
          finalColor = mix(color2, color3, smoothstep(0.25, 0.5, gradientPos) * smoothFactor);
        } else if (gradientPos < 0.75) {
          finalColor = mix(color3, color4, smoothstep(0.5, 0.75, gradientPos) * smoothFactor);
        } else {
          finalColor = mix(color4, color5, smoothstep(0.75, 1.0, gradientPos) * smoothFactor);
        }
        
        // Add some brightness variation
        float brightness = 0.8 + sin(combinedNoise * 3.0) * 0.2;
        finalColor *= brightness;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create material with uniforms
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) }
      }
    });
    materialRef.current = material;

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Set up scroll trigger
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      }
    });

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Update time uniform
      material.uniforms.uTime.value += 0.016;
      
      // Update scroll progress with smooth interpolation
      material.uniforms.uScrollProgress.value += (scrollProgressRef.current - material.uniforms.uScrollProgress.value) * 0.1;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={mountRef} className="magical-gradient-background" />;
};

export default MagicalGradientBackground;