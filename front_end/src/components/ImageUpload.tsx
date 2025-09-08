import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Camera, Loader, Sparkles, Zap, Shield } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  isAnalyzing: boolean;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

const translations = {
  zh: {
    heroTitle: '开始您的智能皮肤分析之旅',
    heroSubtitle: '上传一张清晰的面部照片，我们的AI将为您提供专业的皮肤健康分析和个性化护肤建议',
    aiDriven: 'AI驱动的专业皮肤分析',
    analyzing: 'AI正在分析中...',
    analyzingDesc: '正在使用先进的多模态大模型分析您的皮肤状况',
    imagePreprocess: '图像预处理',
    featureExtraction: '特征提取',
    intelligentAnalysis: '智能分析',
    uploadSuccess: '图片上传成功！',
    uploadSuccessDesc: 'AI分析即将开始，您也可以重新上传其他照片',
    reupload: '重新上传',
    uploadPhoto: '上传您的面部照片',
    uploadDesc: '拖拽图片到此处，或点击下方按钮选择文件',
    privacyProtection: '隐私保护',
    secondAnalysis: '秒级分析',
    aiDrivenShort: 'AI驱动',
    selectFile: '选择文件',
    takePhoto: '拍照上传',
    supportedFormats: '支持格式：JPG、PNG、WEBP | 建议：正面清晰照片，光线充足',
    tryExamples: '或者试试这些示例',
    tryExamplesDesc: '点击下方示例图片快速体验分析功能',
    youngSkin: '年轻肌肤',
    youngSkinDesc: '适合基础护肤分析',
    matureSkin: '成熟肌肤',
    matureSkinDesc: '抗衰老护理建议',
    combinationSkin: '混合肌肤',
    combinationSkinDesc: '个性化护肤方案'
  },
  en: {
    heroTitle: 'Start Your Intelligent Skin Analysis Journey',
    heroSubtitle: 'Upload a clear facial photo, and our AI will provide professional skin health analysis and personalized skincare recommendations',
    aiDriven: 'AI-Driven Professional Skin Analysis',
    analyzing: 'AI is analyzing...',
    analyzingDesc: 'Using advanced multimodal large models to analyze your skin condition',
    imagePreprocess: 'Image Preprocessing',
    featureExtraction: 'Feature Extraction',
    intelligentAnalysis: 'Intelligent Analysis',
    uploadSuccess: 'Image uploaded successfully!',
    uploadSuccessDesc: 'AI analysis will begin shortly. You can also upload other photos',
    reupload: 'Re-upload',
    uploadPhoto: 'Upload Your Facial Photo',
    uploadDesc: 'Drag image here, or click the button below to select file',
    privacyProtection: 'Privacy Protection',
    secondAnalysis: 'Second-level Analysis',
    aiDrivenShort: 'AI-Driven',
    selectFile: 'Select File',
    takePhoto: 'Take Photo',
    supportedFormats: 'Supported formats: JPG, PNG, WEBP | Recommended: Clear frontal photo with good lighting',
    tryExamples: 'Or try these examples',
    tryExamplesDesc: 'Click the example images below to quickly experience the analysis function',
    youngSkin: 'Young Skin',
    youngSkinDesc: 'Suitable for basic skincare analysis',
    matureSkin: 'Mature Skin',
    matureSkinDesc: 'Anti-aging care recommendations',
    combinationSkin: 'Combination Skin',
    combinationSkinDesc: 'Personalized skincare plan'
  }
};

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, isAnalyzing, theme, language }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const t = translations[language];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (file.type.startsWith('image/')) {
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);

      try {
        // 创建FormData
        const formData = new FormData();
        formData.append('file', file);

        // 调用后端API保存图片到user_TempImage文件夹
        const response = await fetch('http://localhost:8000/api/save-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          // 将图片URL传递给父组件
          onImageUpload(result.image_url || reader.result as string);
          console.log('Image saved successfully:', result.image_path);
        } else {
          throw new Error(result.message || 'Failed to save image');
        }
      } catch (error) {
        console.error('Error saving image:', error);
        // 如果API调用失败，仍然使用本地预览的base64图片
        onImageUpload(reader.result as string);
        alert('图片保存失败，但您仍可以继续使用: ' + (error as Error).message);
      }
    } else {
      alert(t.supportedFormats);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-teal-100 px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">{t.aiDriven}</span>
        </div>
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 transition-colors duration-300 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {language === 'zh' ? (
            <>开始您的<span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">智能皮肤分析</span>之旅</>
          ) : (
            <>Start Your <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Intelligent Skin Analysis</span> Journey</>
          )}
        </h2>
        <p className={`text-base md:text-lg max-w-2xl mx-auto px-4 transition-colors duration-300 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          {t.heroSubtitle}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-3xl p-6 md:p-12 text-center transition-all duration-300 ${
          dragActive 
            ? `border-blue-500 shadow-lg scale-105 ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-blue-50 to-teal-50' 
                  : 'bg-gradient-to-br from-blue-900/20 to-teal-900/20'
              }` 
            : `${
                theme === 'light'
                  ? 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
                  : 'border-gray-600 hover:border-blue-400 hover:bg-gradient-to-br hover:from-gray-800/50 hover:to-blue-800/50'
              }`
        } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isAnalyzing ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="w-8 h-8 md:w-12 md:h-12 text-blue-600 animate-spin" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div className="space-y-3">
              <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{t.analyzing}</h3>
              <p className={`text-base md:text-lg px-4 transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>{t.analyzingDesc}</p>
              <div className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>{t.imagePreprocess}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span>{t.featureExtraction}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span>{t.intelligentAnalysis}</span>
                </div>
              </div>
            </div>
            <div className="max-w-md mx-auto">
              <div className={`w-full rounded-full h-3 overflow-hidden transition-colors duration-500 ${
                theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
              }`}>
                <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-orange-600 h-3 rounded-full animate-pulse transition-all duration-1000" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-6">
            <div className="relative inline-block">
            <img 
              src={preview} 
              alt="Preview" 
                className="max-h-60 md:max-h-80 mx-auto rounded-2xl shadow-xl border-4 border-white"
            />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className={`text-lg md:text-xl font-semibold transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{t.uploadSuccess}</h3>
              <p className={`text-sm md:text-base px-4 transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>{t.uploadSuccessDesc}</p>
            </div>
            <button 
              onClick={() => setPreview(null)}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-xl border-2 transition-all font-medium ${
                theme === 'light'
                  ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-blue-400 hover:text-blue-400'
              }`}
            >
              {t.reupload}
            </button>
            </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
                  <ImageIcon className="w-10 h-10 md:w-14 md:h-14 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 md:w-5 md:h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{t.uploadPhoto}</h3>
              <p className={`text-base md:text-lg px-4 transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>{t.uploadDesc}</p>
              <div className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>{t.privacyProtection}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>{t.secondAnalysis}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>{t.aiDrivenShort}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <label className="group bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all cursor-pointer flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Upload className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold text-sm md:text-base">{t.selectFile}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
              
              <button className={`group px-6 py-3 md:px-8 md:py-4 rounded-xl border-2 transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                theme === 'light'
                  ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-blue-400 hover:text-blue-400'
              }`}>
                <Camera className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold text-sm md:text-base">{t.takePhoto}</span>
              </button>
            </div>

            <div className={`pt-4 border-t transition-colors duration-500 ${
              theme === 'light' ? 'border-gray-200' : 'border-gray-600'
            }`}>
              <p className={`text-xs md:text-sm mb-3 px-4 transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>{t.supportedFormats}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sample Images */}
      {!isAnalyzing && !preview && (
        <div className="mt-12">
          <div className="text-center mb-6">
            <h3 className={`text-lg md:text-xl font-semibold mb-2 transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>{t.tryExamples}</h3>
            <p className={`text-sm md:text-base px-4 transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>{t.tryExamplesDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto px-4">
          {[
            {
              src: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=400',
              title: t.youngSkin,
              desc: t.youngSkinDesc
            },
            {
              src: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400',
              title: t.matureSkin,
              desc: t.matureSkinDesc
            },
            {
              src: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
              title: t.combinationSkin,
              desc: t.combinationSkinDesc
            }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => onImageUpload(item.src)}
              className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2"
            >
              <img 
                src={item.src} 
                alt={`示例 ${index + 1}`}
                className="w-full h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-semibold text-base md:text-lg">{item.title}</h4>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
              <div className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};