import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0xff006e),
      new THREE.Color(0x8338ec),
      new THREE.Color(0x3a86ff),
      new THREE.Color(0x06ffa5),
      new THREE.Color(0xffbe0b),
      new THREE.Color(0xfb5607),
      new THREE.Color(0xff4365),
      new THREE.Color(0x00f5ff),
    ];

    // Initialize particles in clusters
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create multiple cluster centers
      const clusterIndex = Math.floor(Math.random() * 3);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 10;
      
      const clusterOffsets = [
        { x: -10, y: 0, z: 0 },
        { x: 10, y: 5, z: -5 },
        { x: 0, y: -10, z: 5 }
      ];
      
      const cluster = clusterOffsets[clusterIndex];
      
      positions[i3] = Math.cos(angle) * radius + cluster.x + (Math.random() - 0.5) * 5;
      positions[i3 + 1] = Math.sin(angle) * radius + cluster.y + (Math.random() - 0.5) * 5;
      positions[i3 + 2] = cluster.z + (Math.random() - 0.5) * 10;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 1.5 + 0.5;

      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (500.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        float r = 0.0;
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        r = dot(cxy, cxy);
        
        if (r > 1.0) {
            discard;
        }
        
        float alpha = 1.0 - smoothstep(0.0, 1.0, sqrt(r));
        alpha = pow(alpha, 0.3);
        
        vec3 finalColor = vColor * 2.0;
        gl_FragColor = vec4(finalColor, alpha * 0.7);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      transparent: true,
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
      mouseRef.current = { x: mouse.x, y: mouse.y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      const positions = particles.geometry.attributes.position.array;
      const time = Date.now() * 0.0001;

      raycaster.setFromCamera(mouse, camera);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.at(50, intersectPoint);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Add velocity
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Simple flocking behavior - only check nearby particles
        let cohesionX = 0, cohesionY = 0, cohesionZ = 0;
        let count = 0;
        
        // Only check a few nearby particles for performance
        for (let j = 0; j < 20; j++) {
          const randomIndex = Math.floor(Math.random() * particleCount);
          const j3 = randomIndex * 3;
          
          const dx = positions[j3] - positions[i3];
          const dy = positions[j3 + 1] - positions[i3 + 1];
          const dz = positions[j3 + 2] - positions[i3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < 5 && distance > 0) {
            cohesionX += positions[j3];
            cohesionY += positions[j3 + 1];
            cohesionZ += positions[j3 + 2];
            count++;
          }
        }
        
        if (count > 0) {
          cohesionX /= count;
          cohesionY /= count;
          cohesionZ /= count;
          
          velocities[i3] += (cohesionX - positions[i3]) * 0.001;
          velocities[i3 + 1] += (cohesionY - positions[i3 + 1]) * 0.001;
          velocities[i3 + 2] += (cohesionZ - positions[i3 + 2]) * 0.001;
        }

        // Mouse interaction - stronger repulsion
        const mouseDistX = intersectPoint.x - positions[i3];
        const mouseDistY = intersectPoint.y - positions[i3 + 1];
        const mouseDistZ = intersectPoint.z - positions[i3 + 2];
        const mouseDist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY + mouseDistZ * mouseDistZ);
        
        if (mouseDist < 15) {
          const force = (15 - mouseDist) * 0.1;
          const repelX = -mouseDistX / mouseDist;
          const repelY = -mouseDistY / mouseDist;
          const repelZ = -mouseDistZ / mouseDist;
          
          velocities[i3] += repelX * force;
          velocities[i3 + 1] += repelY * force;
          velocities[i3 + 2] += repelZ * force;
        }

        // Organic movement
        velocities[i3] += Math.sin(time + i * 0.1) * 0.001;
        velocities[i3 + 1] += Math.cos(time + i * 0.1) * 0.001;
        
        // Damping
        velocities[i3] *= 0.98;
        velocities[i3 + 1] *= 0.98;
        velocities[i3 + 2] *= 0.98;
        
        // Speed limit
        const speed = Math.sqrt(velocities[i3] * velocities[i3] + velocities[i3 + 1] * velocities[i3 + 1] + velocities[i3 + 2] * velocities[i3 + 2]);
        if (speed > 0.5) {
          velocities[i3] = (velocities[i3] / speed) * 0.5;
          velocities[i3 + 1] = (velocities[i3 + 1] / speed) * 0.5;
          velocities[i3 + 2] = (velocities[i3 + 2] / speed) * 0.5;
        }

        // Boundaries
        if (positions[i3] > 40) velocities[i3] *= -1;
        if (positions[i3] < -40) velocities[i3] *= -1;
        if (positions[i3 + 1] > 40) velocities[i3 + 1] *= -1;
        if (positions[i3 + 1] < -40) velocities[i3 + 1] *= -1;
        if (positions[i3 + 2] > 25) velocities[i3 + 2] *= -1;
        if (positions[i3 + 2] < -25) velocities[i3 + 2] *= -1;
      }

      particles.geometry.attributes.position.needsUpdate = true;
      
      // Gentle rotation
      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default ParticleBackground;