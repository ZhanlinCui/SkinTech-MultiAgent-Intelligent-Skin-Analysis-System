import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Sun, Globe } from 'lucide-react';
import { Header } from './components/Header';
import { ThreeBackground } from './components/ThreeBackground';
import { ThreeFeatureSection } from './components/ThreeFeatureSection';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { ProductRecommendations } from './components/ProductRecommendations';
import { DialogueInterface } from './components/DialogueInterface';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { UserProfile } from './components/UserProfile';

export interface SkinAnalysis {
  id: string;
  timestamp: Date;
  confidence: number;
  metrics: {
    acne: number;
    wrinkles: number;
    pigmentation: number;
    texture: number;
    oiliness: number;
    sensitivity: number;
  };
  recommendations: string[];
  needsDialogue: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  category: string;
}

interface AIReasoning {
  content: string;
  result: string;
}

type Language = 'zh' | 'en';

const translations = {
  zh: {
    title: 'SkinTech 智能皮肤分析',
    subtitle: '基于多模态大模型的专业皮肤分析，让您成为自己喜欢的人',
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
    onlineService: '在线服务',
    analysisResults: '分析结果',
    reasoningProcess: '推理过程',
    productRecommendations: '产品推荐',
    aboutSkinTech: '关于 SkinTech',
    aboutDescription: 'SkinTech 致力于「让用户成为自己喜欢的人」，通过先进的AI技术为您提供专业的皮肤分析和个性化护肤建议。我们结合阿里云皮肤病理检测、多轮对话系统和MCP电商集成，为您打造全方位的智能皮肤健康管理平台。',
    professionalAI: '专业AI分析',
    personalizedRecommendation: '个性化推荐',
    privacyProtection: '隐私保护'
  },
  en: {
    title: 'SkinTech AI Skin Analysis',
    subtitle: 'Professional skin analysis based on multimodal large models, helping you become who you want to be',
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
    onlineService: 'Online Service',
    analysisResults: 'Analysis Results',
    reasoningProcess: 'Reasoning Process',
    productRecommendations: 'Product Recommendations',
    aboutSkinTech: 'About SkinTech',
    aboutDescription: 'SkinTech is committed to "helping users become who they want to be" by providing professional skin analysis and personalized skincare advice through advanced AI technology. We combine Alibaba Cloud skin pathology detection, multi-turn dialogue system, and MCP e-commerce integration to create a comprehensive intelligent skin health management platform.',
    professionalAI: 'Professional AI Analysis',
    personalizedRecommendation: 'Personalized Recommendations',
    privacyProtection: 'Privacy Protection'
  }
};

function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'process' | 'recommendations'>('analysis');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [aiReasoning, setAiReasoning] = useState<AIReasoning | null>(null);

  const t = translations[language];

  // 打字机效果
  useEffect(() => {
    const fullText = language === 'zh' 
      ? '开始您的智能皮肤分析之旅' 
      : 'Start Your Intelligent Skin Analysis Journey';
    
    let currentIndex = 0;
    setDisplayedText('');
    setIsTyping(true);
    
    const typeTimer = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeTimer);
      }
    }, 100); // 每100ms显示一个字符
    
    return () => clearInterval(typeTimer);
  }, [language]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const handleImageUpload = async (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsAnalyzing(true);
    setAnalysis(null);
    setProducts([]);
    setActiveTab('analysis');
    setAiReasoning(null);
    
    // Simulate API call to Alibaba Cloud skin analysis
    setTimeout(() => {
      const mockAnalysis: SkinAnalysis = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        confidence: Math.random() > 0.5 ? 0.85 : 0.65, // Sometimes trigger dialogue
        metrics: {
          acne: Math.random() * 100,
          wrinkles: Math.random() * 100,
          pigmentation: Math.random() * 100,
          texture: Math.random() * 100,
          oiliness: Math.random() * 100,
          sensitivity: Math.random() * 100,
        },
        recommendations: [
          '建议使用温和的清洁产品',
          '注意防晒保护',
          '保持充足的水分补充',
          '考虑使用含有烟酰胺的护肤品'
        ],
        needsDialogue: false
      };
      
      // Set needsDialogue based on confidence
      mockAnalysis.needsDialogue = mockAnalysis.confidence < 0.7;
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      
      // 模拟AI推理结果
      setAiReasoning({
        content: `1. 图像预处理: 检测到面部区域，进行标准化处理\n2. 特征提取: 使用ResNet50模型提取皮肤特征\n3. 多维度分析:\n   - 痘痘: ${mockAnalysis.metrics.acne.toFixed(1)}%\n   - 皱纹: ${mockAnalysis.metrics.wrinkles.toFixed(1)}%\n   - 色素: ${mockAnalysis.metrics.pigmentation.toFixed(1)}%\n4. 综合评估: 皮肤整体健康度 ${(100 - (mockAnalysis.metrics.acne + mockAnalysis.metrics.wrinkles + mockAnalysis.metrics.pigmentation)/3).toFixed(1)}%`,
        result: `根据分析，您的皮肤主要问题是${mockAnalysis.metrics.acne > 50 ? '痘痘' : mockAnalysis.metrics.wrinkles > 50 ? '皱纹' : '色素沉着'}。建议${mockAnalysis.recommendations[0]}`
      });
      
      // 直接生成产品推荐，不需要对话
      generateProductRecommendations(mockAnalysis);
    }, 2000);
  };

  const generateProductRecommendations = (analysisData: SkinAnalysis) => {
    // Mock product recommendations based on analysis
    const mockProducts: Product[] = [
      {
        id: 'p1',
        name: '温和洁面泡沫',
        brand: '兰蔻',
        price: 298,
        rating: 4.8,
        image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: '温和清洁，适合敏感肌肤',
        category: '清洁'
      },
      {
        id: 'p2',
        name: '高效保湿精华',
        brand: '雅诗兰黛',
        price: 560,
        rating: 4.9,
        image: 'https://images.pexels.com/photos/5938435/pexels-photo-5938435.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: '深层补水，改善肌肤纹理',
        category: '精华'
      },
      {
        id: 'p3',
        name: '烟酰胺修护面霜',
        brand: '倩碧',
        price: 420,
        rating: 4.7,
        image: 'https://images.pexels.com/photos/5938435/pexels-photo-5938435.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: '修护肌肤，改善色素沉着',
        category: '面霜'
      }
    ];
    
    setProducts(mockProducts);
  };

  const handleDialogueComplete = (updatedAnalysis: SkinAnalysis) => {
    setAnalysis(updatedAnalysis);
    setShowDialogue(false);
    generateProductRecommendations(updatedAnalysis);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-teal-50'
    }`}>
      <ThreeBackground theme={isDarkMode ? 'dark' : 'light'} />
      
      <Header 
        isDarkMode={isDarkMode}
        language={language}
        onToggleDarkMode={toggleDarkMode}
        onToggleLanguage={toggleLanguage}
        onLoginClick={() => setShowLoginModal(true)}
        onProfileClick={() => setShowUserProfile(true)}
        isLoggedIn={isLoggedIn}
      />

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <section className="text-center space-y-6 py-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Sparkles className={`w-8 h-8 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent`}>
                {t.title}
              </h1>
            </div>
            <p className={`text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed px-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t.subtitle}
            </p>
            
            {/* Demo Video Section */}
            <div className="max-w-4xl mx-auto mt-12">
              <div className={`rounded-3xl p-6 md:p-8 shadow-2xl border backdrop-blur-md transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-gray-900/10 border-gray-700/20' 
                  : 'bg-white/10 border-white/20'
              }`}>
                
                {/* Video Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full mb-4 transition-all duration-500 shadow-lg backdrop-blur-md border ${
                    isDarkMode 
                      ? 'bg-blue-600/20 border-blue-400/30 text-blue-300' 
                      : 'bg-blue-500/20 border-blue-400/30 text-blue-700'
                  }`}>
                    <span className="text-2xl">🎬</span>
                    <span className="font-bold text-lg">{language === 'zh' ? '产品演示视频' : 'Product Demo Video'}</span>
                  </div>
                  <h3 className={`text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                    isDarkMode 
                      ? 'from-blue-300 via-teal-300 to-purple-300' 
                      : 'from-blue-600 via-teal-600 to-purple-600'
                  }`}>
                    {language === 'zh' ? 'SkinTech 功能演示' : 'SkinTech Feature Demo'}
                  </h3>
                </div>
                
                {/* Video Player */}
                <div className="relative max-w-3xl mx-auto mb-6">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                   {/* B站视频预览图 */}
                   <div className="relative w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center group cursor-pointer"
                        onClick={() => window.open('https://www.bilibili.com/video/BV1cuaPz1EvP', '_blank')}>
                     {/* 视频封面背景 */}
                     <div className="absolute inset-0 bg-black/20"></div>
                     
                     {/* B站Logo */}
                     <div className="absolute top-4 left-4 flex items-center space-x-2">
                       <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                         <span className="text-pink-500 font-bold text-sm">B</span>
                       </div>
                       <span className="text-white font-medium">bilibili</span>
                     </div>
                     
                     {/* 播放按钮 */}
                     <div className="relative z-10 flex flex-col items-center space-y-4">
                       <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                         <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                       </div>
                       <div className="text-center text-white">
                         <h4 className="text-xl font-bold mb-2">SkinTech 功能演示</h4>
                         <p className="text-sm opacity-90">点击观看完整演示视频</p>
                         <p className="text-xs opacity-75 mt-1">UP主：散修青易</p>
                       </div>
                     </div>
                     
                     {/* 视频信息 */}
                     <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
                       <div className="flex items-center space-x-4">
                         <span>👁️ 1.2万</span>
                         <span>👍 98%</span>
                         <span>💬 234</span>
                       </div>
                       <span>⏱️ 3:24</span>
                     </div>
                     
                     {/* 悬停效果 */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                   </div>
                  </div>
                  
                  {/* Video Stats */}
                  <div className="mt-4 text-center">
                    <div className={`flex flex-wrap items-center justify-center gap-4 text-sm transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">👁️</span>
                        <span className="font-medium">1.2M {language === 'zh' ? '观看' : 'views'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">👍</span>
                        <span className="font-medium">98% {language === 'zh' ? '好评' : 'liked'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💬</span>
                        <span className="font-medium">2.3K {language === 'zh' ? '评论' : 'comments'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">⏱️</span>
                        <span className="font-medium">3:24</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Call to Action */}
                <div className="text-center">
                  <p className={`text-base mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {language === 'zh' 
                      ? '准备好体验AI皮肤分析了吗？' 
                      : 'Ready to experience AI skin analysis?'
                    }
                  </p>
                  <button 
                    onClick={() => {
                      const uploadSection = document.querySelector('[data-upload-section]');
                      if (uploadSection) {
                        uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {language === 'zh' ? '立即开始分析' : 'Start Analysis Now'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Flowing Blue Decoration */}
          {/* Elegant Section Divider */}
          <section className="py-8 md:py-12">
            <div className="relative max-w-4xl mx-auto">
              {/* Main flowing line */}
              <div className="relative h-px overflow-hidden">
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-transparent via-blue-400/30 to-transparent' 
                    : 'bg-gradient-to-r from-transparent via-blue-500/40 to-transparent'
                }`}></div>
                
                {/* Animated flowing light */}
                <div className={`absolute top-0 h-px w-32 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-transparent via-blue-300 to-transparent' 
                    : 'bg-gradient-to-r from-transparent via-blue-600 to-transparent'
                } animate-pulse`} 
                style={{
                  animation: 'flowRight 4s ease-in-out infinite',
                  animationDelay: '0s'
                }}></div>
                
                <div className={`absolute top-0 h-px w-24 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-transparent via-teal-300 to-transparent' 
                    : 'bg-gradient-to-r from-transparent via-teal-600 to-transparent'
                } animate-pulse`} 
                style={{
                  animation: 'flowLeft 3s ease-in-out infinite',
                  animationDelay: '1s'
                }}></div>
              </div>
              
              {/* Central ornament */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-400 to-teal-400 shadow-lg shadow-blue-400/50' 
                    : 'bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg shadow-blue-500/30'
                } animate-pulse`}></div>
                
                {/* Subtle glow rings */}
                <div className={`absolute inset-0 w-6 h-6 -m-1.5 rounded-full border transition-all duration-500 ${
                  isDarkMode 
                    ? 'border-blue-400/20' 
                    : 'border-blue-500/20'
                } animate-ping`} style={{animationDuration: '3s'}}></div>
                
                <div className={`absolute inset-0 w-9 h-9 -m-3 rounded-full border transition-all duration-500 ${
                  isDarkMode 
                    ? 'border-teal-400/10' 
                    : 'border-teal-500/15'
                } animate-ping`} style={{animationDuration: '4s', animationDelay: '1s'}}></div>
              </div>
              
              {/* Side ornaments */}
              <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
                  isDarkMode ? 'bg-blue-300/60' : 'bg-blue-400/70'
                } animate-pulse`} style={{animationDelay: '0.5s'}}></div>
              </div>
              
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
                  isDarkMode ? 'bg-teal-300/60' : 'bg-teal-400/70'
                } animate-pulse`} style={{animationDelay: '1.5s'}}></div>
              </div>
            </div>
            
            {/* Custom animations */}
            <style>{`
              @keyframes flowRight {
                0% { left: -128px; opacity: 0; }
                50% { opacity: 1; }
                100% { left: 100%; opacity: 0; }
              }
              
              @keyframes flowLeft {
                0% { right: -96px; opacity: 0; }
                50% { opacity: 1; }
                100% { right: 100%; opacity: 0; }
              }
            `}</style>
          </section>

          {/* Upload Section */}
          <section className="py-4 md:py-8" data-upload-section>
            <ImageUpload onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} theme={isDarkMode ? 'dark' : 'light'} language={language} />
          </section>

          {/* Feature Section - Show when no analysis */}
          {!analysis && !isAnalyzing && (
            <>
              {/* Feature Section */}
              <section className="py-8 md:py-12">
                <ThreeFeatureSection theme={isDarkMode ? 'dark' : 'light'} language={language} />
              </section>
            </>
          )}

          {/* Results Section */}
          {analysis && (
            <section className="py-4 md:py-8 space-y-6 md:space-y-8">
              {/* 分析结果标题 */}
              <div className="text-center mb-8">
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {language === 'zh' ? '分析结果' : 'Analysis Results'}
                </h2>
                <p className={`text-base md:text-lg transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'zh' ? '基于AI深度学习的专业皮肤分析报告' : 'Professional skin analysis report based on AI deep learning'}
                </p>
              </div>

              {/* 线性流程按钮布局 */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
                  
                  {/* STEP 1: AI推理过程 */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveTab('process')}
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                        activeTab === 'process'
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 shadow-teal-500/50 scale-110'
                          : `${isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 shadow-gray-700/50' 
                              : 'bg-white hover:bg-gray-50 shadow-gray-300/50'
                            }`
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`text-2xl md:text-3xl mb-1 ${
                          activeTab === 'process' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                        }`}>🧠</span>
                        <span className={`text-xs font-medium ${
                          activeTab === 'process' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                        }`}>
                          {language === 'zh' ? '推理' : 'Process'}
                        </span>
                      </div>
                      {activeTab === 'process' && (
                        <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping"></div>
                      )}
                    </button>
                    <div className={`mt-3 text-xs font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      STEP 1
                    </div>
                  </div>

                  {/* 虚线箭头 1 */}
                  <div className="hidden md:flex items-center space-x-2">
                    <div className={`w-16 h-px border-t-2 border-dashed transition-colors duration-300 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}></div>
                    <svg className={`w-4 h-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* 移动端垂直箭头 1 */}
                  <div className="md:hidden flex flex-col items-center space-y-2">
                    <div className={`w-px h-8 border-l-2 border-dashed transition-colors duration-300 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}></div>
                    <svg className={`w-4 h-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {/* STEP 2: 皮肤因素可视化 */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveTab('analysis')}
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                        activeTab === 'analysis'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/50 scale-110'
                          : `${isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 shadow-gray-700/50' 
                              : 'bg-white hover:bg-gray-50 shadow-gray-300/50'
                            }`
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`text-2xl md:text-3xl mb-1 ${
                          activeTab === 'analysis' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                        }`}>📊</span>
                        <span className={`text-xs font-medium ${
                          activeTab === 'analysis' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                        }`}>
                          {language === 'zh' ? '可视化' : 'Visual'}
                        </span>
                      </div>
                      {activeTab === 'analysis' && (
                        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
                      )}
                    </button>
                    <div className={`mt-3 text-xs font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      STEP 2
                    </div>
                  </div>

                  {/* 虚线箭头 2 */}
                  <div className="hidden md:flex items-center space-x-2">
                    <div className={`w-16 h-px border-t-2 border-dashed transition-colors duration-300 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}></div>
                    <svg className={`w-4 h-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* 移动端垂直箭头 2 */}
                  <div className="md:hidden flex flex-col items-center space-y-2">
                    <div className={`w-px h-8 border-l-2 border-dashed transition-colors duration-300 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}></div>
                    <svg className={`w-4 h-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {/* STEP 3: 个性化产品推荐 */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                        activeTab === 'recommendations'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/50 scale-110'
                          : `${isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 shadow-gray-700/50' 
                              : 'bg-white hover:bg-gray-50 shadow-gray-300/50'
                            }`
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`text-2xl md:text-3xl mb-1 ${
                          activeTab === 'recommendations' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                        }`}>🛍️</span>
                        <span className={`text-xs font-medium ${
                          activeTab === 'recommendations' ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                        }`}>
                          {language === 'zh' ? '推荐' : 'Products'}
                        </span>
                      </div>
                      {activeTab === 'recommendations' && (
                        <div className="absolute inset-0 rounded-full bg-orange-400/20 animate-ping"></div>
                      )}
                    </button>
                    <div className={`mt-3 text-xs font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      STEP 3
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 内容展示区域 */}
              <div className={`rounded-2xl p-6 md:p-8 shadow-sm border transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                  : 'bg-white border-gray-200'
              }`}>
                {/* 皮肤因素可视化分析 */}
                {activeTab === 'analysis' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div>
                        <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {language === 'zh' ? '皮肤因素可视化分析' : 'Skin Factors Visualization'}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {language === 'zh' ? '6大维度专业皮肤健康评估' : '6-dimensional professional skin health assessment'}
                        </p>
                      </div>
                    </div>
                    
                    <AnalysisResults 
                      analysis={analysis} 
                      image={currentImage} 
                      theme={isDarkMode ? 'dark' : 'light'}
                      language={language}
                    />
                  </div>
                )}
                
                {/* AI模型推理过程 */}
                {activeTab === 'process' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <div>
                        <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {language === 'zh' ? 'AI模型推理过程' : 'AI Model Reasoning Process'}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {language === 'zh' ? '深度学习算法分析步骤详解' : 'Detailed explanation of deep learning algorithm analysis steps'}
                        </p>
                      </div>
                    </div>

                    
                    {/* AI模型推理输出框 */}
                    <div className={`min-h-[400px] rounded-xl border-2 border-dashed p-6 transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700/20' 
                        : 'border-gray-300 bg-gray-50/50'
                    }`}>
                      {aiReasoning ? (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <h4 className={`font-medium mb-2 ${
                              isDarkMode ? 'text-teal-400' : 'text-teal-600'
                            }`}>
                              {language === 'zh' ? '推理过程' : 'Reasoning Process'}
                            </h4>
                            <pre className={`whitespace-pre-wrap text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {aiReasoning.content}
                            </pre>
                          </div>
                          <div className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <h4 className={`font-medium mb-2 ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              {language === 'zh' ? '分析结果' : 'Analysis Result'}
                            </h4>
                            <p className={`text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {aiReasoning.result}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center space-y-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors duration-300 ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div>
                              <h4 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {language === 'zh' ? 'AI模型正在推理中...' : 'AI Model is reasoning...'}
                              </h4>
                              <p className={`text-sm transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {language === 'zh' 
                                  ? '模型将自动输出详细的推理过程和分析结果' 
                                  : 'The model will automatically output detailed reasoning process and analysis results'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

          
                {/* 个性化产品推荐 */}
                {activeTab === 'recommendations' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🛍️</span>
                      </div>
                      <div>
                        <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {language === 'zh' ? '个性化产品推荐' : 'Personalized Product Recommendations'}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {language === 'zh' ? '基于分析结果的精准护肤产品匹配' : 'Precise skincare product matching based on analysis results'}
                        </p>
                      </div>
                    </div>
                    
                    {products.length > 0 ? (
                      <ProductRecommendations products={products} theme={isDarkMode ? 'dark' : 'light'} language={language} />
                    ) : (
                      <div className="text-center py-8">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h4 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{language === 'zh' ? '正在生成个性化推荐' : 'Generating Personalized Recommendations'}</h4>
                        <p className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>{language === 'zh' ? '基于您的皮肤分析结果匹配最适合的产品...' : 'Matching the most suitable products based on your skin analysis results...'}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* About Section - Separate from main content */}
        <section id="about-us" className="max-w-6xl mx-auto mt-8 md:mt-16 mb-8 px-4">
          <div className={`rounded-2xl p-4 md:p-6 shadow-sm border transition-all duration-500 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600' 
                    : 'bg-gradient-to-r from-blue-600 to-teal-600'
                }`}>
                  <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className={`text-lg md:text-xl font-bold transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{t.aboutSkinTech}</h3>
              </div>
              
              <p className={`max-w-2xl mx-auto text-sm md:text-base px-4 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.aboutDescription}
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 pt-2">
                <div className={`flex items-center space-x-2 px-3 py-2 md:px-4 rounded-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-blue-900/30 text-blue-300' 
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium">{t.professionalAI}</span>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-2 md:px-4 rounded-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-teal-900/30 text-teal-300' 
                    : 'bg-teal-50 text-teal-700'
                }`}>
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium">{t.personalizedRecommendation}</span>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-2 md:px-4 rounded-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-green-900/30 text-green-300' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium">{t.privacyProtection}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Help Center Section */}
        <section id="help-center" className="max-w-6xl mx-auto mt-8 mb-8 px-4">
          <div className={`rounded-2xl p-4 md:p-8 shadow-sm border transition-all duration-500 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-center mb-6 md:mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600' 
                    : 'bg-gradient-to-r from-orange-600 to-red-600'
                }`}>
                  <span className="text-xl md:text-2xl">❓</span>
                </div>
                <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{language === 'zh' ? '帮助中心' : 'Help Center'}</h3>
              </div>
              <p className={`max-w-2xl mx-auto text-sm md:text-base px-4 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {language === 'zh' 
                  ? '常见问题解答，使用指南，以及技术支持信息' 
                  : 'Frequently asked questions, user guides, and technical support information'
                }
              </p>
            </div>

            {/* FAQ Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {[
                {
                  icon: '🔬',
                  question: language === 'zh' ? '如何进行皮肤分析？' : 'How to perform skin analysis?',
                  answer: language === 'zh' 
                    ? '上传一张清晰的面部照片，我们的AI会自动分析您的皮肤状况，包括痘痘、皱纹、色素沉着等6个维度。' 
                    : 'Upload a clear facial photo, and our AI will automatically analyze your skin condition across 6 dimensions including acne, wrinkles, and pigmentation.',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: '📱',
                  question: language === 'zh' ? '支持哪些图片格式？' : 'What image formats are supported?',
                  answer: language === 'zh' 
                    ? '支持JPG、PNG、WEBP格式的图片。建议上传正面清晰照片，光线充足，分辨率不低于500x500像素。' 
                    : 'Supports JPG, PNG, WEBP format images. Recommend uploading clear frontal photos with good lighting and resolution no less than 500x500 pixels.',
                  color: 'from-teal-500 to-teal-600'
                },
                {
                  icon: '🛡️',
                  question: language === 'zh' ? '隐私安全如何保障？' : 'How is privacy and security guaranteed?',
                  answer: language === 'zh' 
                    ? '我们采用端到端加密技术，您的照片仅用于分析，不会被存储或用于其他用途。分析完成后会自动删除。' 
                    : 'We use end-to-end encryption technology. Your photos are only used for analysis and will not be stored or used for other purposes. They are automatically deleted after analysis.',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: '💬',
                  question: language === 'zh' ? '什么是智能对话优化？' : 'What is intelligent dialogue optimization?',
                  answer: language === 'zh' 
                    ? '当AI分析置信度较低时，系统会启动多轮对话，通过询问您的护肤习惯等信息来提升分析准确性。' 
                    : 'When AI analysis confidence is low, the system will initiate multi-turn dialogue to improve analysis accuracy by asking about your skincare habits.',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  icon: '🛍️',
                  question: language === 'zh' ? '产品推荐如何生成？' : 'How are product recommendations generated?',
                  answer: language === 'zh' 
                    ? '基于您的皮肤分析结果，结合MCP电商集成技术，为您推荐最适合的护肤产品，支持直接跳转购买。' 
                    : 'Based on your skin analysis results, combined with MCP e-commerce integration technology, we recommend the most suitable skincare products with direct purchase links.',
                  color: 'from-orange-500 to-orange-600'
                },
                {
                  icon: '⚡',
                  question: language === 'zh' ? '分析需要多长时间？' : 'How long does analysis take?',
                  answer: language === 'zh' 
                    ? '通常在2-5秒内完成分析。如果需要多轮对话优化，整个过程可能需要2-3分钟。' 
                    : 'Analysis is usually completed within 2-5 seconds. If multi-turn dialogue optimization is needed, the entire process may take 2-3 minutes.',
                  color: 'from-red-500 to-red-600'
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className={`group p-4 md:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/30 hover:border-blue-400' 
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${faq.color} shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <span className="text-lg md:text-2xl">{faq.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm md:text-base font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{faq.question}</h4>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className={`border-t pt-6 md:pt-8 transition-colors duration-500 ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className="text-center space-y-4">
                <h4 className={`text-base md:text-lg font-semibold transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {language === 'zh' ? '还有其他问题？' : 'Have other questions?'}
                </h4>
                <p className={`text-sm md:text-base px-4 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'zh' 
                    ? '我们的客服团队随时为您提供帮助' 
                    : 'Our customer service team is always ready to help you'
                  }
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
                  <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all flex items-center justify-center space-x-2">
                    <span>💬</span>
                    <span className="text-sm md:text-base">{language === 'zh' ? '在线客服' : 'Live Chat'}</span>
                  </button>
                  <button className={`px-4 py-2 md:px-6 md:py-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400'
                      : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                  }`}>
                    <span>📧</span>
                    <span className="text-sm md:text-base">{language === 'zh' ? '邮件支持' : 'Email Support'}</span>
                  </button>
                  <button className={`px-4 py-2 md:px-6 md:py-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400'
                      : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                  }`}>
                    <span>📞</span>
                    <span className="text-sm md:text-base">{language === 'zh' ? '电话支持' : 'Phone Support'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      <Footer />
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        theme={isDarkMode ? 'dark' : 'light'}
        language={language}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setShowLoginModal(false);
        }}
      />
      
      {showUserProfile && (
        <UserProfile
          theme={isDarkMode ? 'dark' : 'light'}
          language={language}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
}

export default App;