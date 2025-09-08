import React, { useState } from 'react';
import { User, Camera, Edit3, Settings, History, Star, Award, Calendar, Phone, Mail, MapPin, Save, X } from 'lucide-react';

interface UserProfileProps {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  onClose: () => void;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  joinDate: string;
  skinType: string;
  analysisCount: number;
  favoriteProducts: number;
}

const translations = {
  zh: {
    userProfile: '个人主页',
    editProfile: '编辑资料',
    saveChanges: '保存更改',
    cancel: '取消',
    personalInfo: '个人信息',
    skinAnalysis: '皮肤分析',
    myProducts: '我的产品',
    settings: '设置',
    name: '姓名',
    email: '邮箱',
    phone: '手机号',
    location: '所在地',
    joinDate: '加入时间',
    skinType: '肌肤类型',
    analysisHistory: '分析历史',
    totalAnalysis: '总分析次数',
    favoriteProducts: '收藏产品',
    recentAnalysis: '最近分析',
    skinMetrics: '皮肤指标',
    recommendations: '护肤建议',
    viewDetails: '查看详情',
    noAnalysisYet: '暂无分析记录',
    startAnalysis: '开始分析',
    uploadAvatar: '上传头像',
    changeAvatar: '更换头像',
    combinationSkin: '混合性肌肤',
    drySkin: '干性肌肤',
    oilySkin: '油性肌肤',
    sensitiveSkin: '敏感性肌肤',
    normalSkin: '中性肌肤',
    accountSettings: '账户设置',
    privacySettings: '隐私设置',
    notificationSettings: '通知设置',
    helpSupport: '帮助与支持',
    logout: '退出登录'
  },
  en: {
    userProfile: 'User Profile',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    personalInfo: 'Personal Info',
    skinAnalysis: 'Skin Analysis',
    myProducts: 'My Products',
    settings: 'Settings',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    joinDate: 'Join Date',
    skinType: 'Skin Type',
    analysisHistory: 'Analysis History',
    totalAnalysis: 'Total Analysis',
    favoriteProducts: 'Favorite Products',
    recentAnalysis: 'Recent Analysis',
    skinMetrics: 'Skin Metrics',
    recommendations: 'Recommendations',
    viewDetails: 'View Details',
    noAnalysisYet: 'No analysis yet',
    startAnalysis: 'Start Analysis',
    uploadAvatar: 'Upload Avatar',
    changeAvatar: 'Change Avatar',
    combinationSkin: 'Combination Skin',
    drySkin: 'Dry Skin',
    oilySkin: 'Oily Skin',
    sensitiveSkin: 'Sensitive Skin',
    normalSkin: 'Normal Skin',
    accountSettings: 'Account Settings',
    privacySettings: 'Privacy Settings',
    notificationSettings: 'Notification Settings',
    helpSupport: 'Help & Support',
    logout: 'Logout'
  }
};

export const UserProfile: React.FC<UserProfileProps> = ({ theme, language, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'analysis' | 'products' | 'settings'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '张小美',
    email: 'zhangxiaomei@example.com',
    phone: '+86 138 0013 8000',
    avatar: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=200',
    location: '北京市朝阳区',
    joinDate: '2024-01-15',
    skinType: '混合性肌肤',
    analysisCount: 12,
    favoriteProducts: 8
  });

  const t = translations[language];

  const handleSave = () => {
    setIsEditing(false);
    // 这里可以添加保存到后端的逻辑
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const mockAnalysisHistory = [
    {
      id: 1,
      date: '2024-01-10',
      confidence: 0.92,
      mainIssues: ['轻微痘痘', 'T区出油'],
      image: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      date: '2024-01-05',
      confidence: 0.88,
      mainIssues: ['肌理粗糙', '缺水'],
      image: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
        theme === 'light' 
          ? 'bg-white' 
          : 'bg-gray-800 border border-gray-700'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300 ${
          theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-900/50'
        }`}>
          <h2 className={`text-2xl font-bold transition-colors duration-300 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>{t.userProfile}</h2>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.saveChanges}</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                    theme === 'light'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>{t.cancel}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                  theme === 'light'
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>{t.editProfile}</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className={`w-64 border-r transition-colors duration-300 ${
            theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-900/30'
          }`}>
            <div className="p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={userInfo.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className={`mt-3 font-semibold transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>{userInfo.name}</h3>
                <p className={`text-sm transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>{userInfo.skinType}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { key: 'info' as const, label: t.personalInfo, icon: User },
                  { key: 'analysis' as const, label: t.skinAnalysis, icon: History },
                  { key: 'products' as const, label: t.myProducts, icon: Star },
                  { key: 'settings' as const, label: t.settings, icon: Settings }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === item.key
                        ? `${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/50 text-blue-300'}`
                        : `${theme === 'light' 
                            ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                            : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                          }`
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Personal Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{t.personalInfo}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'name', label: t.name, icon: User, value: userInfo.name },
                      { key: 'email', label: t.email, icon: Mail, value: userInfo.email },
                      { key: 'phone', label: t.phone, icon: Phone, value: userInfo.phone },
                      { key: 'location', label: t.location, icon: MapPin, value: userInfo.location }
                    ].map((field) => (
                      <div key={field.key}>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {field.label}
                        </label>
                        <div className="relative">
                          <field.icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          {isEditing ? (
                            <input
                              type="text"
                              value={field.value}
                              onChange={(e) => handleInputChange(field.key as keyof UserInfo, e.target.value)}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                theme === 'light'
                                  ? 'border-gray-300 bg-white text-gray-900'
                                  : 'border-gray-600 bg-gray-700 text-white'
                              }`}
                            />
                          ) : (
                            <div className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-300 ${
                              theme === 'light'
                                ? 'border-gray-300 bg-gray-50 text-gray-900'
                                : 'border-gray-600 bg-gray-700 text-white'
                            }`}>
                              {field.value}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {[
                      { label: t.joinDate, value: userInfo.joinDate, icon: Calendar },
                      { label: t.totalAnalysis, value: userInfo.analysisCount.toString(), icon: Award },
                      { label: t.favoriteProducts, value: userInfo.favoriteProducts.toString(), icon: Star }
                    ].map((stat, index) => (
                      <div key={index} className={`p-4 rounded-lg border transition-all duration-300 ${
                        theme === 'light' 
                          ? 'border-gray-200 bg-white' 
                          : 'border-gray-600 bg-gray-700/50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                            theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/50 text-blue-400'
                          }`}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`text-sm transition-colors duration-300 ${
                              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                            }`}>{stat.label}</p>
                            <p className={`font-semibold transition-colors duration-300 ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis History Tab */}
              {activeTab === 'analysis' && (
                <div className="space-y-6">
                  <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{t.analysisHistory}</h3>
                  
                  {mockAnalysisHistory.length > 0 ? (
                    <div className="space-y-4">
                      {mockAnalysisHistory.map((analysis) => (
                        <div key={analysis.id} className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                          theme === 'light' 
                            ? 'border-gray-200 bg-white hover:border-blue-200' 
                            : 'border-gray-600 bg-gray-700/50 hover:border-blue-400'
                        }`}>
                          <div className="flex items-center space-x-4">
                            <img
                              src={analysis.image}
                              alt="Analysis"
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <p className={`font-medium transition-colors duration-300 ${
                                  theme === 'light' ? 'text-gray-900' : 'text-white'
                                }`}>
                                  {analysis.date}
                                </p>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  analysis.confidence > 0.9 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {(analysis.confidence * 100).toFixed(0)}% 置信度
                                </span>
                              </div>
                              <p className={`text-sm mb-2 transition-colors duration-300 ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                主要问题: {analysis.mainIssues.join(', ')}
                              </p>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                {t.viewDetails}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                        theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                      }`}>
                        <History className={`w-8 h-8 transition-colors duration-300 ${
                          theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      </div>
                      <h4 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>{t.noAnalysisYet}</h4>
                      <p className={`text-sm mb-4 transition-colors duration-300 ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>开始您的第一次皮肤分析</p>
                      <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all">
                        {t.startAnalysis}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{t.myProducts}</h3>
                  
                  <div className="text-center py-12">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                      theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                    }`}>
                      <Star className={`w-8 h-8 transition-colors duration-300 ${
                        theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </div>
                    <h4 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>暂无收藏产品</h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>开始分析皮肤，获取个性化产品推荐</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{t.settings}</h3>
                  
                  <div className="space-y-4">
                    {[
                      { label: t.accountSettings, icon: User },
                      { label: t.privacySettings, icon: Settings },
                      { label: t.notificationSettings, icon: Settings },
                      { label: t.helpSupport, icon: Settings }
                    ].map((setting, index) => (
                      <button
                        key={index}
                        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm ${
                          theme === 'light' 
                            ? 'border-gray-200 bg-white hover:border-blue-200' 
                            : 'border-gray-600 bg-gray-700/50 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <setting.icon className={`w-5 h-5 transition-colors duration-300 ${
                            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                          <span className={`transition-colors duration-300 ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                          }`}>{setting.label}</span>
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${
                          theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                        }`}>›</span>
                      </button>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <button className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};