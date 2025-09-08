import React, { useRef, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

// 动态导入 Three.js
let THREE: typeof import('three') | null = null;

interface ThreeFeatureSectionProps {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

const translations = {
  zh: {
    whyChoose: '为什么选择 SkinTech',
    leadingTech: '领先的AI皮肤分析技术',
    techDescription: '结合阿里云皮肤病理检测、多轮对话系统和MCP电商集成，为您提供专业的皮肤健康管理服务',
    professionalAnalysis: '专业AI分析',
    professionalDesc: '基于阿里云皮肤病理检测API，提供痘痘、皱纹、色素等6大维度专业分析',
    intelligentDialogue: '智能对话优化',
    dialogueDesc: '当分析置信度较低时，启动多轮对话系统，通过交互优化分析准确性',
    personalizedRec: '个性化推荐',
    personalizedDesc: 'MCP电商集成技术，基于您的皮肤分析结果推荐最适合的护肤产品',
    highPrecision: '高精度',
    multiDimensional: '多维度',
    adaptive: '自适应',
    intelligent: '智能化',
    personalized: '个性化',
    preciseMatch: '精准匹配',
    analysisAccuracy: '分析准确率',
    trustedUsers: '用户信赖',
    analysisSpeed: '分析速度',
    onlineService: '在线服务'
  },
  en: {
    whyChoose: 'Why Choose SkinTech',
    leadingTech: 'Leading AI Skin Analysis Technology',
    techDescription: 'Combining Alibaba Cloud skin pathology detection, multi-turn dialogue system, and MCP e-commerce integration to provide professional skin health management services',
    professionalAnalysis: 'Professional AI Analysis',
    professionalDesc: 'Based on Alibaba Cloud DetectSkinDisease API, providing professional analysis across 6 dimensions including acne, wrinkles, and pigmentation',
    intelligentDialogue: 'Intelligent Dialogue Optimization',
    dialogueDesc: 'When analysis confidence is low, activate multi-turn dialogue system to optimize accuracy through interaction',
    personalizedRec: 'Personalized Recommendations',
    personalizedDesc: 'MCP e-commerce integration technology recommends the most suitable skincare products based on your skin analysis results',
    highPrecision: 'High Precision',
    multiDimensional: 'Multi-dimensional',
    adaptive: 'Adaptive',
    intelligent: 'Intelligent',
    personalized: 'Personalized',
    preciseMatch: 'Precise Match',
    analysisAccuracy: 'Analysis Accuracy',
    trustedUsers: 'Trusted Users',
    analysisSpeed: 'Analysis Speed',
    onlineService: 'Online Service'
  }
};

export const ThreeFeatureSection: React.FC<ThreeFeatureSectionProps> = ({ theme, language }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const t = translations[language];

  useEffect(() => {
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
        const camera = new ThreeJS.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        const renderer = new ThreeJS.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        sceneRef.current = scene;
        rendererRef.current = renderer;

        // Create floating orbs for each feature
        const orbs: any[] = [];
        const orbColors = [0x4f46e5, 0x059669, 0xea580c]; // Blue, Green, Orange
        
        for (let i = 0; i < 3; i++) {
          const geometry = new ThreeJS.SphereGeometry(0.3, 32, 32);
          const material = new ThreeJS.MeshBasicMaterial({
            color: orbColors[i],
            transparent: true,
            opacity: 0.6,
            wireframe: false,
          });
          
          const orb = new ThreeJS.Mesh(geometry, material);
          orb.position.set((i - 1) * 3, 0, -2);
          orbs.push(orb);
          scene.add(orb);

          // Add inner glow
          const glowGeometry = new ThreeJS.SphereGeometry(0.35, 32, 32);
          const glowMaterial = new ThreeJS.MeshBasicMaterial({
            color: orbColors[i],
            transparent: true,
            opacity: 0.2,
          });
          const glow = new ThreeJS.Mesh(glowGeometry, glowMaterial);
          glow.position.copy(orb.position);
          scene.add(glow);
        }

        // Create connecting lines between orbs
        const lineGeometry = new ThreeJS.BufferGeometry();
        const linePositions = new Float32Array([
          -3, 0, -2,  // First orb
          0, 0, -2,   // Second orb
          0, 0, -2,   // Second orb
          3, 0, -2    // Third orb
        ]);
        lineGeometry.setAttribute('position', new ThreeJS.BufferAttribute(linePositions, 3));
        
        const lineMaterial = new ThreeJS.LineBasicMaterial({
          color: theme === 'dark' ? 0x64b5f6 : 0x1976d2,
          transparent: true,
          opacity: 0.4,
        });
        
        const lines = new ThreeJS.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // Create floating particles around the scene
        const particlesGeometry = new ThreeJS.BufferGeometry();
        const particlesCount = 50;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 15;
        }

        particlesGeometry.setAttribute('position', new ThreeJS.BufferAttribute(posArray, 3));

        const particlesMaterial = new ThreeJS.PointsMaterial({
          size: 0.03,
          color: theme === 'dark' ? 0x64b5f6 : 0x1976d2,
          transparent: true,
          opacity: 0.6,
        });

        const particlesMesh = new ThreeJS.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 5;

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);

          // Rotate particles
          particlesMesh.rotation.x += 0.001;
          particlesMesh.rotation.y += 0.002;

          // Animate orbs
          orbs.forEach((orb, index) => {
            orb.rotation.x += 0.01;
            orb.rotation.y += 0.01;
            orb.position.y = Math.sin(Date.now() * 0.001 + index * 2) * 0.3;
            
            // Scale effect when hovered
            if (hoveredCard === index) {
              orb.scale.setScalar(1.2 + Math.sin(Date.now() * 0.005) * 0.1);
            } else {
              orb.scale.setScalar(1);
            }
          });

          // Animate connecting lines
          lines.rotation.z += 0.002;

          renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
          if (!camera || !renderer || !mountRef.current) return;
          camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
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
  }, [theme, hoveredCard]);

  return (
    <div className="relative">
      {/* Three.js Canvas */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 pointer-events-none"
        style={{ height: '600px' }}
      />
      
      {/* Content Overlay */}
      <div className={`relative z-10 rounded-3xl p-12 shadow-2xl border backdrop-blur-md transition-all duration-500 ${
        theme === 'light' 
          ? 'bg-white/10 border-white/20' 
          : 'bg-gray-900/10 border-gray-700/20'
      }`} style={{ minHeight: '600px' }}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full mb-6 transition-all duration-500 shadow-lg backdrop-blur-md border ${
            theme === 'light' 
              ? 'bg-blue-500/20 border-blue-400/30 text-blue-700' 
              : 'bg-blue-600/20 border-blue-400/30 text-blue-300'
          }`}>
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="font-bold text-lg">{t.whyChoose}</span>
          </div>
          <h3 className={`text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
            theme === 'light' 
              ? 'from-blue-600 via-teal-600 to-purple-600' 
              : 'from-blue-300 via-teal-300 to-purple-300'
          }`}>{t.leadingTech}</h3>
          <p className={`text-lg max-w-3xl mx-auto transition-colors duration-500 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>{t.techDescription}</p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: '🔬',
              title: t.professionalAnalysis,
              desc: t.professionalDesc,
              tags: [t.highPrecision, t.multiDimensional],
              colors: 'from-blue-500 to-blue-600'
            },
            {
              icon: '💬',
              title: t.intelligentDialogue,
              desc: t.dialogueDesc,
              tags: [t.adaptive, t.intelligent],
              colors: 'from-teal-500 to-teal-600'
            },
            {
              icon: '🛍️',
              title: t.personalizedRec,
              desc: t.personalizedDesc,
              tags: [t.personalized, t.preciseMatch],
              colors: 'from-orange-500 to-orange-600'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`group text-center space-y-4 p-6 rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${
                theme === 'light' 
                  ? 'bg-white/20 hover:bg-white/30 border border-white/30' 
                  : 'bg-gray-800/20 hover:bg-gray-800/30 border border-gray-600/30'
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.colors} rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-6`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h4 className={`text-xl font-bold transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{feature.title}</h4>
              <p className={`text-sm transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>{feature.desc}</p>
              <div className="flex justify-center space-x-2">
                {feature.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 shadow-md hover:shadow-lg bg-gradient-to-r ${feature.colors} text-white backdrop-blur-sm`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats Section */}
        <div className={`pt-8 border-t transition-colors duration-500 ${
          theme === 'light' ? 'border-white/30' : 'border-gray-600/30'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '95%+', label: t.analysisAccuracy, color: 'from-blue-300 to-blue-400' },
              { value: '10万+', label: t.trustedUsers, color: 'from-teal-300 to-teal-400' },
              { value: `2${language === 'zh' ? '秒' : 's'}`, label: t.analysisSpeed, color: 'from-orange-300 to-orange-400' },
              { value: '24/7', label: t.onlineService, color: 'from-purple-300 to-purple-400' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`group p-4 rounded-2xl transition-all duration-500 hover:scale-110 cursor-pointer ${
                  theme === 'light' 
                    ? 'bg-white/10 hover:bg-white/20 border border-white/20' 
                    : 'bg-gray-800/10 hover:bg-gray-800/20 border border-gray-600/20'
                }`}
              >
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium transition-colors duration-500 ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-300'
                }`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};