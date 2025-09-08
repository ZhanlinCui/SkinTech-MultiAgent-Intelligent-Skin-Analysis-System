import React, { useRef, useEffect } from 'react';

// 动态导入 Three.js 以避免 SSR 问题
let THREE: typeof import('three') | null = null;

interface ThreeBackgroundProps {
  theme: 'light' | 'dark';
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ theme }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 动态导入 Three.js
    const loadThree = async () => {
      if (!THREE) {
        THREE = await import('three');
      }
      return THREE;
    };

    const initScene = async () => {
      if (!mountRef.current) return;
      
      try {
        const ThreeJS = await loadThree();
        if (!ThreeJS) return;

        // Scene setup
        const scene = new ThreeJS.Scene();
        const camera = new ThreeJS.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new ThreeJS.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        sceneRef.current = scene;
        rendererRef.current = renderer;

        // Create floating particles
        const particlesGeometry = new ThreeJS.BufferGeometry();
        const particlesCount = 100;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new ThreeJS.BufferAttribute(posArray, 3));

        const particlesMaterial = new ThreeJS.PointsMaterial({
          size: 0.02,
          color: theme === 'dark' ? 0x64b5f6 : 0x1976d2,
          transparent: true,
          opacity: 0.6,
        });

        const particlesMesh = new ThreeJS.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Create floating geometric shapes
        const shapes: any[] = [];
        
        // Add some floating cubes and spheres
        for (let i = 0; i < 8; i++) {
          const geometry = i % 2 === 0 
            ? new ThreeJS.BoxGeometry(0.1, 0.1, 0.1)
            : new ThreeJS.SphereGeometry(0.05, 16, 16);
          
          const material = new ThreeJS.MeshBasicMaterial({
            color: theme === 'dark' ? 0x4fc3f7 : 0x0277bd,
            transparent: true,
            opacity: 0.3,
            wireframe: i % 3 === 0,
          });

          const mesh = new ThreeJS.Mesh(geometry, material);
          mesh.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4
          );
          
          shapes.push(mesh);
          scene.add(mesh);
        }

        camera.position.z = 5;

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);

          // Rotate particles
          particlesMesh.rotation.x += 0.001;
          particlesMesh.rotation.y += 0.002;

          // Animate shapes
          shapes.forEach((shape, index) => {
            shape.rotation.x += 0.01 * (index + 1);
            shape.rotation.y += 0.01 * (index + 1);
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
          });

          renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
          if (!camera || !renderer) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
          }
          if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
        };
      } catch (error) {
        console.warn('Three.js failed to load:', error);
      }
    };

    initScene();
  }, [theme]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ zIndex: -1 }}
    />
  );
};