import React from 'react';
import { SkinAnalysis } from '../App';
import { TrendingUp, AlertCircle, CheckCircle, Activity } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: SkinAnalysis;
  image: string | null;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

const translations = {
  zh: {
    analysisImage: '分析图像',
    analysisOverview: '分析概览',
    analysisTime: '分析时间',
    confidence: '置信度',
    highConfidence: '分析结果可信度高',
    lowConfidence: '建议进行多轮对话确认',
    skinMetrics: '皮肤指标',
    aiRecommendations: 'AI 建议',
    metricLabels: {
      acne: '痘痘',
      wrinkles: '皱纹',
      pigmentation: '色素沉着',
      texture: '肌理纹理',
      oiliness: '出油程度',
      sensitivity: '敏感程度'
    }
  },
  en: {
    analysisImage: 'Analysis Image',
    analysisOverview: 'Analysis Overview',
    analysisTime: 'Analysis Time',
    confidence: 'Confidence',
    highConfidence: 'High confidence in analysis results',
    lowConfidence: 'Recommend multi-turn dialogue for confirmation',
    skinMetrics: 'Skin Metrics',
    aiRecommendations: 'AI Recommendations',
    metricLabels: {
      acne: 'Acne',
      wrinkles: 'Wrinkles',
      pigmentation: 'Pigmentation',
      texture: 'Texture',
      oiliness: 'Oiliness',
      sensitivity: 'Sensitivity'
    }
  }
};

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, image, theme, language }) => {
  const t = translations[language];
  const metricLabels = t.metricLabels;

  const getMetricColor = (value: number) => {
    if (value < 30) return 'text-green-600 bg-green-100';
    if (value < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMetricBorderColor = (value: number) => {
    if (value < 30) return 'border-green-200';
    if (value < 70) return 'border-yellow-200';
    return 'border-red-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image and Overview */}
      <div className="space-y-6">
        {image && (
          <div className={`rounded-2xl p-6 shadow-sm border transition-all duration-500 ${
            theme === 'light' 
              ? 'bg-white border-gray-200' 
              : 'bg-gray-800/50 border-gray-600 backdrop-blur-sm'
          }`}>
            <h3 className={`text-xl font-bold mb-4 transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>分析图像</h3>
            <img 
              src={image} 
              alt="Analysis" 
              className="w-full max-h-80 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}

        <div className={`rounded-2xl p-6 shadow-sm border transition-all duration-500 ${
          theme === 'light' 
            ? 'bg-white border-gray-200' 
            : 'bg-gray-800/50 border-gray-600 backdrop-blur-sm'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <Activity className={`w-6 h-6 transition-colors duration-500 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`} />
            <h3 className={`text-xl font-bold transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>分析概览</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>分析时间</span>
              <span className="font-medium">{analysis.timestamp.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>置信度</span>
              <div className="flex items-center space-x-2">
                <div className={`w-24 rounded-full h-2 transition-colors duration-500 ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                }`}>
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full"
                    style={{width: `${analysis.confidence * 100}%`}}
                  ></div>
                </div>
                <span className="font-medium">{(analysis.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {analysis.confidence > 0.8 ? (
                <CheckCircle className={`w-5 h-5 transition-colors duration-500 ${
                  theme === 'light' ? 'text-green-600' : 'text-green-400'
                }`} />
              ) : (
                <AlertCircle className={`w-5 h-5 transition-colors duration-500 ${
                  theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                }`} />
              )}
              <span className={`text-sm transition-colors duration-500 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {analysis.confidence > 0.8 ? '分析结果可信度高' : '建议进行多轮对话确认'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-6">
        <div className={`rounded-2xl p-6 shadow-sm border transition-all duration-500 ${
          theme === 'light' 
            ? 'bg-white border-gray-200' 
            : 'bg-gray-800/50 border-gray-600 backdrop-blur-sm'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className={`w-6 h-6 transition-colors duration-500 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`} />
            <h3 className={`text-xl font-bold transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>皮肤指标</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analysis.metrics).map(([key, value]) => (
              <div 
                key={key} 
                className={`p-4 rounded-lg border-2 ${getMetricBorderColor(value)} transition-all hover:shadow-sm ${
                  theme === 'dark' ? 'bg-gray-700/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium transition-colors duration-500 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {metricLabels[key as keyof typeof metricLabels]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMetricColor(value)}`}>
                    {value.toFixed(0)}
                  </span>
                </div>
                
                <div className={`w-full rounded-full h-2 transition-colors duration-500 ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'
                }`}>
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      value < 30 ? 'bg-green-500' :
                      value < 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{width: `${value}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl p-6 shadow-sm border transition-all duration-500 ${
          theme === 'light' 
            ? 'bg-white border-gray-200' 
            : 'bg-gray-800/50 border-gray-600 backdrop-blur-sm'
        }`}>
          <h3 className={`text-xl font-bold mb-4 transition-colors duration-500 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>AI 建议</h3>
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-500 ${
                theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'
              }`}>
                <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors duration-500 ${
                  theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`} />
                <span className={`transition-colors duration-500 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};