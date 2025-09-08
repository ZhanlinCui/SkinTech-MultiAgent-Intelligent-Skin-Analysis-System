import React from 'react';
import { Product } from '../App';
import { Star, ShoppingCart, ExternalLink, Tag } from 'lucide-react';

interface ProductRecommendationsProps {
  products: Product[];
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

const translations = {
  zh: {
    recommendedProducts: '推荐产品',
    viewMore: '查看更多',
    viewDetails: '查看详情',
    jdIntegration: '京东购物集成',
    jdDescription: '点击下方按钮，跳转到京东进行扫码登录，获取个性化推荐',
    connectJd: '连接京东账户'
  },
  en: {
    recommendedProducts: 'Recommended Products',
    viewMore: 'View More',
    viewDetails: 'View Details',
    jdIntegration: 'JD.com Shopping Integration',
    jdDescription: 'Click the button below to jump to JD.com for QR code login and get personalized recommendations',
    connectJd: 'Connect JD Account'
  }
};

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ products, theme, language }) => {
  const t = translations[language];

  return (
    <div className={`rounded-2xl p-6 shadow-sm border transition-all duration-500 ${
      theme === 'light' 
        ? 'bg-white border-gray-200' 
        : 'bg-gray-800/50 border-gray-600 backdrop-blur-sm'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ShoppingCart className={`w-6 h-6 transition-colors duration-500 ${
            theme === 'light' ? 'text-blue-600' : 'text-blue-400'
          }`} />
          <h3 className={`text-xl font-bold transition-colors duration-500 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>{t.recommendedProducts}</h3>
        </div>
        
        <button className={`text-sm font-medium flex items-center space-x-1 transition-colors duration-500 ${
          theme === 'light' 
            ? 'text-blue-600 hover:text-blue-700' 
            : 'text-blue-400 hover:text-blue-300'
        }`}>
          <ExternalLink className="w-4 h-4" />
          <span>{t.viewMore}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`group border rounded-xl p-4 hover:shadow-lg transition-all ${
              theme === 'light'
                ? 'border-gray-200 hover:border-blue-200'
                : 'border-gray-600 hover:border-blue-400 bg-gray-700/20'
            }`}
          >
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-semibold transition-colors ${
                      theme === 'light'
                        ? 'text-gray-900 group-hover:text-blue-600'
                        : 'text-white group-hover:text-blue-400'
                    }`}>
                      {product.name}
                    </h4>
                    <p className={`text-sm transition-colors duration-500 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>{product.brand}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Tag className={`w-4 h-4 transition-colors duration-500 ${
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-xs transition-colors duration-500 ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>{product.category}</span>
                  </div>
                </div>

                <p className={`text-sm line-clamp-2 transition-colors duration-500 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>{product.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className={`text-sm font-medium transition-colors duration-500 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>{product.rating}</span>
                    </div>
                    <span className={`text-lg font-bold transition-colors duration-500 ${
                      theme === 'light' ? 'text-orange-600' : 'text-orange-400'
                    }`}>¥{product.price}</span>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1.5 rounded-lg text-sm hover:from-blue-700 hover:to-teal-700 transition-all">
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-6 p-4 rounded-lg transition-all duration-500 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'
      }`}>
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
            theme === 'light' ? 'bg-orange-100' : 'bg-orange-900/50'
          }`}>
            <ExternalLink className={`w-4 h-4 transition-colors duration-500 ${
              theme === 'light' ? 'text-orange-600' : 'text-orange-400'
            }`} />
          </div>
          <h4 className={`font-medium transition-colors duration-500 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>{t.jdIntegration}</h4>
        </div>
        <p className={`text-sm mb-3 transition-colors duration-500 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          {t.jdDescription}
        </p>
        <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
          <ExternalLink className="w-5 h-5" />
          <span>{t.connectJd}</span>
        </button>
      </div>
    </div>
  );
};