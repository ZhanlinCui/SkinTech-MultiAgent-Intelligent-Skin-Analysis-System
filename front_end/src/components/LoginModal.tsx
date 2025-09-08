import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  onLoginSuccess: () => void;
}

const translations = {
  zh: {
    loginWith: '登录方式',
    emailLogin: '邮箱登录',
    phoneLogin: '手机登录',
    phone: '手机号码',
    phonePlaceholder: '请输入手机号码',
    verificationCode: '验证码',
    verificationCodePlaceholder: '请输入验证码',
    sendCode: '发送验证码',
    resendCode: '重新发送',
    login: '登录',
    register: '注册',
    welcome: '欢迎回来',
    welcomeDesc: '登录您的 SkinTech 账户',
    createAccount: '创建账户',
    createAccountDesc: '加入 SkinTech 智能皮肤分析平台',
    email: '邮箱地址',
    password: '密码',
    confirmPassword: '确认密码',
    fullName: '姓名',
    emailPlaceholder: '请输入您的邮箱',
    passwordPlaceholder: '请输入密码',
    confirmPasswordPlaceholder: '请再次输入密码',
    fullNamePlaceholder: '请输入您的姓名',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    loginButton: '登录',
    registerButton: '注册',
    noAccount: '还没有账户？',
    hasAccount: '已有账户？',
    switchToRegister: '立即注册',
    switchToLogin: '立即登录',
    orContinueWith: '或者使用以下方式继续',
    wechat: '微信',
    qq: 'QQ',
    weibo: '微博'
  },
  en: {
    loginWith: 'Login Method',
    emailLogin: 'Email Login',
    phoneLogin: 'Phone Login',
    phone: 'Phone Number',
    phonePlaceholder: 'Enter your phone number',
    verificationCode: 'Verification Code',
    verificationCodePlaceholder: 'Enter verification code',
    sendCode: 'Send Code',
    resendCode: 'Resend',
    login: 'Login',
    register: 'Register',
    welcome: 'Welcome Back',
    welcomeDesc: 'Sign in to your SkinTech account',
    createAccount: 'Create Account',
    createAccountDesc: 'Join SkinTech AI Skin Analysis Platform',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    confirmPasswordPlaceholder: 'Confirm your password',
    fullNamePlaceholder: 'Enter your full name',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loginButton: 'Sign In',
    registerButton: 'Sign Up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    switchToRegister: 'Sign up',
    switchToLogin: 'Sign in',
    orContinueWith: 'Or continue with',
    wechat: 'WeChat',
    qq: 'QQ',
    weibo: 'Weibo'
  }
};

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, theme, language, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    rememberMe: false
  });

  const t = translations[language];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/register logic here
    console.log('Form submitted:', formData);
    onLoginSuccess();
  };

  const handleSendCode = () => {
    if (!formData.phone) return;
    
    // Simulate sending verification code
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl transition-all duration-300 ${
        theme === 'light' 
          ? 'bg-white' 
          : 'bg-gray-800 border border-gray-700'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-lg transition-colors ${
            theme === 'light'
              ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h2 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {isLogin ? t.welcome : t.createAccount}
              </h2>
            </div>
            <p className={`text-sm md:text-base transition-colors duration-300 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {isLogin ? t.welcomeDesc : t.createAccountDesc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Login Method Toggle */}
            <div className="flex justify-center">
              <div className={`rounded-lg p-1 shadow-sm border transition-all duration-300 ${
                theme === 'light' 
                  ? 'bg-gray-100 border-gray-200' 
                  : 'bg-gray-700 border-gray-600'
              }`}>
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`px-3 py-2 md:px-4 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'email'
                      ? `${theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'bg-gray-600 text-blue-400 shadow-sm'}`
                      : `${theme === 'light' 
                          ? 'text-gray-600 hover:text-gray-900' 
                          : 'text-gray-400 hover:text-gray-200'
                        }`
                  }`}
                >
                  {t.emailLogin}
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`px-3 py-2 md:px-4 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'phone'
                      ? `${theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'bg-gray-600 text-blue-400 shadow-sm'}`
                      : `${theme === 'light' 
                          ? 'text-gray-600 hover:text-gray-900' 
                          : 'text-gray-400 hover:text-gray-200'
                        }`
                  }`}
                >
                  {t.phoneLogin}
                </button>
              </div>
            </div>

            {/* Full Name (Register only) */}
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {t.fullName}
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t.fullNamePlaceholder}
                    className={`w-full pl-10 pr-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email or Phone */}
            {loginMethod === 'email' ? (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.emailPlaceholder}
                    className={`w-full pl-10 pr-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {t.phone}
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`}>📱</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.phonePlaceholder}
                    className={`w-full pl-10 pr-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                    required
                  />
                </div>
              </div>
            )}

            {/* Verification Code (Phone login only) */}
            {loginMethod === 'phone' && (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {t.verificationCode}
                </label>
                <div className="flex space-x-2 md:space-x-3">
                  <div className="flex-1 relative">
                    <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }`}>🔢</span>
                    <input
                      type="text"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      placeholder={t.verificationCodePlaceholder}
                      className={`w-full pl-10 pr-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        theme === 'light'
                          ? 'border-gray-300 bg-white text-gray-900'
                          : 'border-gray-600 bg-gray-700 text-white'
                      }`}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={!formData.phone || countdown > 0}
                    className={`px-3 py-2.5 md:px-4 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                      !formData.phone || countdown > 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s` : t.sendCode}
                  </button>
                </div>
              </div>
            )}

            {/* Password (Email login only) */}
            {loginMethod === 'email' && (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t.passwordPlaceholder}
                    className={`w-full pl-10 pr-12 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (Register only) */}
            {!isLogin && loginMethod === 'email' && (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {t.confirmPassword}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={t.confirmPasswordPlaceholder}
                    className={`w-full pl-10 pr-12 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password (Login only) */}
            {isLogin && loginMethod === 'email' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={`text-sm transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {t.rememberMe}
                  </span>
                </label>
                <button
                  type="button"
                  className={`text-sm font-medium transition-colors duration-300 ${
                    theme === 'light' 
                      ? 'text-blue-600 hover:text-blue-700' 
                      : 'text-blue-400 hover:text-blue-300'
                  }`}
                >
                  {t.forgotPassword}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 md:py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 font-medium"
            >
              {isLogin ? t.loginButton : t.registerButton}
            </button>

            {/* Switch Mode */}
            <div className="text-center">
              <span className={`text-sm transition-colors duration-300 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {isLogin ? t.noAccount : t.hasAccount}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className={`ml-1 text-sm font-medium transition-colors duration-300 ${
                  theme === 'light' 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                {isLogin ? t.switchToRegister : t.switchToLogin}
              </button>
            </div>

            {/* Social Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t transition-colors duration-300 ${
                  theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 transition-colors duration-300 ${
                  theme === 'light' ? 'bg-white text-gray-500' : 'bg-gray-800 text-gray-400'
                }`}>
                  {t.orContinueWith}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: t.wechat, color: 'bg-green-500', icon: '💬' },
                { name: t.qq, color: 'bg-blue-500', icon: '🐧' },
                { name: t.weibo, color: 'bg-red-500', icon: '📱' }
              ].map((social) => (
                <button
                  key={social.name}
                  type="button"
                  className={`${social.color} text-white py-2.5 md:py-3 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2`}
                >
                  <span className="text-base md:text-lg">{social.icon}</span>
                  <span className="text-sm font-medium">{social.name}</span>
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};