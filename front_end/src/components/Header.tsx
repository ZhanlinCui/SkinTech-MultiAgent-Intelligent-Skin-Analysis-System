import React, { useState } from 'react';
import { Sparkles, User, Moon, Sun, Globe } from 'lucide-react';

interface HeaderProps {
  onToggleLanguage: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  language: 'zh' | 'en';
  onLoginClick: () => void;
  onProfileClick: () => void;
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleLanguage, 
  onToggleDarkMode, 
  isDarkMode, 
  language, 
  onLoginClick, 
  onProfileClick, 
  isLoggedIn 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-us');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToHelp = () => {
    const helpSection = document.getElementById('help-center');
    if (helpSection) {
      helpSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>SkinTech</h1>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>智能皮肤分析</p>
            </div>
            <div className="sm:hidden">
              <h1 className={`text-lg font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>SkinTech</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={scrollToHome}
              className={`transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'zh' ? '首页' : 'Home'}
            </button>
            <button 
              onClick={scrollToAbout}
              className={`transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'zh' ? '关于我们' : 'About Us'}
            </button>
            <button 
              onClick={scrollToHelp}
              className={`transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'zh' ? '帮助中心' : 'Help Center'}
            </button>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 transition-all ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                } ${isDarkMode ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
                <div className={`w-full h-0.5 transition-all ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                } ${isDarkMode ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
                <div className={`w-full h-0.5 transition-all ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                } ${isDarkMode ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
              </div>
            </button>

            <button 
              onClick={onToggleLanguage}
              className={`hidden sm:flex p-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={language === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <Globe className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={onProfileClick}
              className={`hidden sm:flex p-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="个人主页"
            >
              <User className="w-5 h-5" />
            </button>
            
            {!isLoggedIn ? (
              <button 
                onClick={onLoginClick}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-2 text-sm md:px-4 md:text-base rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all"
              >
                {language === 'zh' ? '登录' : 'Login'}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">张</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`py-4 border-t mt-4 space-y-4 transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button 
              onClick={scrollToHome}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {language === 'zh' ? '首页' : 'Home'}
            </button>
            <button 
              onClick={scrollToAbout}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {language === 'zh' ? '关于我们' : 'About Us'}
            </button>
            <button 
              onClick={scrollToHelp}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {language === 'zh' ? '帮助中心' : 'Help Center'}
            </button>
            
            <div className="flex items-center justify-between px-4 py-2">
              <button 
                onClick={() => {
                  onToggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm">{language === 'zh' ? 'English' : '中文'}</span>
              </button>
              
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    onProfileClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{language === 'zh' ? '个人主页' : 'Profile'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};