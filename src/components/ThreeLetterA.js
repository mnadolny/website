import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeLetterA = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    
    // Create gray gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#f5f5f5');  // Light gray
    gradient.addColorStop(1, '#d0d0d0');  // Darker gray
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    scene.background = texture;
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(30, 20, 40);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Simple Perlin noise implementation for organic movement
    class PerlinNoise {
      constructor() {
        this.permutation = [];
        this.p = [];
        
        // Initialize permutation array
        for (let i = 0; i < 256; i++) {
          this.permutation[i] = Math.floor(Math.random() * 256);
        }
        
        // Duplicate the permutation array
        for (let i = 0; i < 512; i++) {
          this.p[i] = this.permutation[i & 255];
        }
      }
      
      fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
      }
      
      lerp(t, a, b) {
        return a + t * (b - a);
      }
      
      grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
      }
      
      noise(x, y, z) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);
        
        const A = this.p[X] + Y;
        const AA = this.p[A] + Z;
        const AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y;
        const BA = this.p[B] + Z;
        const BB = this.p[B + 1] + Z;
        
        return this.lerp(w,
          this.lerp(v,
            this.lerp(u, this.grad(this.p[AA], x, y, z),
                         this.grad(this.p[BA], x - 1, y, z)),
            this.lerp(u, this.grad(this.p[AB], x, y - 1, z),
                         this.grad(this.p[BB], x - 1, y - 1, z))),
          this.lerp(v,
            this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1),
                         this.grad(this.p[BA + 1], x - 1, y, z - 1)),
            this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1),
                         this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
      }
    }

    // Simple Marching Cubes implementation for blob generation
    class MarchingCubes {
      constructor(resolution, size) {
        this.resolution = resolution;
        this.size = size;
        this.field = new Float32Array((resolution + 1) * (resolution + 1) * (resolution + 1));
        this.positions = [];
        this.normals = [];
        this.indices = [];
      }

      // Calculate field value at a point based on metaballs
      calculateField(x, y, z, metaballs) {
        let field = 0;
        for (const ball of metaballs) {
          const dx = x - ball.x;
          const dy = y - ball.y;
          const dz = z - ball.z;
          const distanceSquared = dx * dx + dy * dy + dz * dz;
          field += ball.strength / (distanceSquared + 0.1);
        }
        return field;
      }

      // Generate mesh from metaballs
      generateMesh(metaballs, threshold = 1.0) {
        this.positions = [];
        this.normals = [];
        this.indices = [];

        const step = this.size / this.resolution;
        const halfSize = this.size / 2;

        // Fill the 3D field
        for (let x = 0; x <= this.resolution; x++) {
          for (let y = 0; y <= this.resolution; y++) {
            for (let z = 0; z <= this.resolution; z++) {
              const worldX = x * step - halfSize;
              const worldY = y * step - halfSize;
              const worldZ = z * step - halfSize;
              
              const index = x + y * (this.resolution + 1) + z * (this.resolution + 1) * (this.resolution + 1);
              this.field[index] = this.calculateField(worldX, worldY, worldZ, metaballs);
            }
          }
        }

        // Simple cube marching (simplified marching cubes)
        for (let x = 0; x < this.resolution; x++) {
          for (let y = 0; y < this.resolution; y++) {
            for (let z = 0; z < this.resolution; z++) {
              this.marchCube(x, y, z, step, halfSize, threshold);
            }
          }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3));
        geometry.setIndex(this.indices);
        geometry.computeVertexNormals();

        return geometry;
      }

      marchCube(x, y, z, step, halfSize, threshold) {
        const corners = [
          [x, y, z], [x + 1, y, z], [x + 1, y + 1, z], [x, y + 1, z],
          [x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]
        ];

        let cubeIndex = 0;
        const cornerValues = [];

        for (let i = 0; i < 8; i++) {
          const [cx, cy, cz] = corners[i];
          const index = cx + cy * (this.resolution + 1) + cz * (this.resolution + 1) * (this.resolution + 1);
          const value = this.field[index];
          cornerValues[i] = value;
          
          if (value > threshold) {
            cubeIndex |= (1 << i);
          }
        }

        // Simple case: if all corners are inside or outside, no surface
        if (cubeIndex === 0 || cubeIndex === 255) return;

        // Create vertices (simplified - just create triangles for demonstration)
        const vertexIndex = this.positions.length / 3;
        
        // Add center point of cube as vertex
        const centerX = (x + 0.5) * step - halfSize;
        const centerY = (y + 0.5) * step - halfSize;
        const centerZ = (z + 0.5) * step - halfSize;
        
        this.positions.push(centerX, centerY, centerZ);
        this.normals.push(0, 1, 0); // Simplified normal

        // Create a simple quad for visualization
        if (cubeIndex > 0 && cubeIndex < 255) {
          const size = step * 0.3;
          
          // Add quad vertices
          this.positions.push(
            centerX - size, centerY - size, centerZ,
            centerX + size, centerY - size, centerZ,
            centerX + size, centerY + size, centerZ,
            centerX - size, centerY + size, centerZ
          );
          
          for (let i = 0; i < 4; i++) {
            this.normals.push(0, 0, 1);
          }

          // Add indices for two triangles
          const base = vertexIndex + 1;
          this.indices.push(
            base, base + 1, base + 2,
            base, base + 2, base + 3
          );
        }
      }
    }

    // Create metaballs positioned to form letter 'A'
    const createLetterAMetaballs = () => {
      const metaballs = [];
      
      // Letter 'A' outline using strategically placed spheres
      // Left diagonal stroke
      for (let i = 0; i < 8; i++) {
        const t = i / 7;
        metaballs.push({
          x: -15 + t * 15, // -15 to 0
          y: -25 + t * 50, // -25 to 25
          z: 0,
          strength: 100
        });
      }
      
      // Right diagonal stroke
      for (let i = 0; i < 8; i++) {
        const t = i / 7;
        metaballs.push({
          x: 0 + t * 15, // 0 to 15
          y: 25 - t * 50, // 25 to -25
          z: 0,
          strength: 100
        });
      }
      
      // Horizontal crossbar
      for (let i = 0; i < 6; i++) {
        const t = i / 5;
        metaballs.push({
          x: -8 + t * 16, // -8 to 8
          y: -5,
          z: 0,
          strength: 80
        });
      }
      
      // Add some depth metaballs
      for (let i = 0; i < metaballs.length; i++) {
        if (i % 3 === 0) { // Every third metaball gets depth
          metaballs.push({
            x: metaballs[i].x,
            y: metaballs[i].y,
            z: -4,
            strength: 60
          });
          metaballs.push({
            x: metaballs[i].x,
            y: metaballs[i].y,
            z: 4,
            strength: 60
          });
        }
      }
      
      return metaballs;
    };

    // Create animated blob letter with melting effect
    const createBlobLetter = () => {
      const metaballs = createLetterAMetaballs();
      const noise = new PerlinNoise();
      
      // Create a group to hold all spheres
      const letterGroup = new THREE.Group();
      
      // Metallic material
      const material = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.0
      });

      // Create sphere data with animation properties
      const sphereData = [];
      
      metaballs.forEach((ball, index) => {
        const radius = Math.sqrt(ball.strength / 10);
        const sphereGeometry = new THREE.SphereGeometry(radius, 16, 12);
        const sphere = new THREE.Mesh(sphereGeometry, material);
        
        sphere.position.set(ball.x, ball.y, ball.z);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        
        letterGroup.add(sphere);
        
        // Animation properties
        const data = {
          sphere: sphere,
          originalPosition: new THREE.Vector3(ball.x, ball.y, ball.z),
          originalRadius: radius,
          noiseOffset: Math.random() * 1000,
          driftSpeed: 0.0005 + Math.random() * 0.001, // Even slower drift
          isCore: index < 20, // More core spheres to maintain shape
          orbitRadius: 8 + Math.random() * 15,
          orbitSpeed: 0.0005 + Math.random() * 0.0005,
          orbitAngle: Math.random() * Math.PI * 2,
          driftDirection: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ).normalize(),
          meltingFactor: Math.random() * 0.1 + 0.05, // Much less melting
          cycleOffset: Math.random() * Math.PI * 2 // For cycling animation
        };
        
        sphereData.push(data);
      });
      
      scene.add(letterGroup);
      
      // Animation variables
      let startTime = Date.now();
      
      // Melting animation loop
      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        
        const currentTime = Date.now();
        const time = (currentTime - startTime) * 0.001; // Convert to seconds
        
        sphereData.forEach((data, index) => {
          const { sphere, originalPosition, originalRadius, noiseOffset, 
                  driftSpeed, isCore, orbitRadius, orbitSpeed, orbitAngle,
                  driftDirection, meltingFactor, cycleOffset } = data;
          
          // Gentler animation speeds
          const animationMultiplier = 1; // Reduced for subtler movement
          
          // Perlin noise for organic movement
          const noiseScale = 0.05;
          const timeOffset = time * animationMultiplier;
          
          const noiseX = noise.noise(
            timeOffset + noiseOffset,
            originalPosition.y * noiseScale,
            originalPosition.z * noiseScale
          );
          const noiseY = noise.noise(
            originalPosition.x * noiseScale,
            timeOffset + noiseOffset + 100,
            originalPosition.z * noiseScale
          );
          const noiseZ = noise.noise(
            originalPosition.x * noiseScale,
            originalPosition.y * noiseScale,
            timeOffset + noiseOffset + 200
          );
          
          if (isCore) {
            // Core spheres stay very close with subtle movement
            const coreMovement = 3;
            sphere.position.set(
              originalPosition.x + noiseX * coreMovement,
              originalPosition.y + noiseY * coreMovement,
              originalPosition.z + noiseZ * coreMovement
            );
            
            // Subtle size variation
            const sizeVariation = 1 + Math.sin(time * 1 + noiseOffset) * 0.15;
            sphere.scale.setScalar(sizeVariation);
            
          } else {
            // Non-core spheres: create a cycling melting effect
            const cycleTime = time * 0.3 + cycleOffset; // Slow cycle
            const cycleFactor = (Math.sin(cycleTime) + 1) * 0.5; // 0 to 1
            
            // Drift away and come back in cycles
            const maxDriftDistance = 25;
            const driftDistance = cycleFactor * maxDriftDistance;
            
            // Orbital motion that's always visible
            const currentOrbitAngle = time * orbitSpeed * 3 + orbitAngle;
            const orbitOffset = new THREE.Vector3(
              Math.cos(currentOrbitAngle) * orbitRadius * (0.5 + cycleFactor * 0.5),
              Math.sin(currentOrbitAngle * 0.7) * orbitRadius * 0.3,
              Math.sin(currentOrbitAngle) * orbitRadius * 0.2
            );
            
            // Combine movements but keep them near the letter
            sphere.position.set(
              originalPosition.x + driftDirection.x * driftDistance + orbitOffset.x + noiseX * 8,
              originalPosition.y + driftDirection.y * driftDistance + orbitOffset.y + noiseY * 8,
              originalPosition.z + driftDirection.z * driftDistance + orbitOffset.z + noiseZ * 8
            );
            
            // Size varies with cycle (shrink when far, grow when close)
            const sizeVariation = 0.7 + (1 - cycleFactor) * 0.5; // 0.7 to 1.2
            sphere.scale.setScalar(sizeVariation);
            
            // Subtle opacity variation but always visible
            const opacity = 0.7 + cycleFactor * 0.3; // 0.7 to 1.0
            sphere.material.opacity = opacity;
            sphere.material.transparent = opacity < 1;
          }
        });
        
        // Faster overall rotation
        letterGroup.rotation.y += 0.01;
        
        renderer.render(scene, camera);
      };
      
      animate();
    };

    // Create the blob letter
    createBlobLetter();

    // Handle resize
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeLetterA;