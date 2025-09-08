import React from 'react';
import { Heart, Github, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">SkinTech</h3>
            <p className="text-gray-400 text-sm">
              基于多模态大模型与MCP的智能皮肤分析与产品推荐平台
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for better skin</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">快速链接</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">皮肤分析</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">产品推荐</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">使用指南</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">常见问题</a>
            </div>
          </div>

          {/* Technology */}
          <div className="space-y-4">
            <h4 className="font-semibold">技术栈</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• 阿里云皮肤病理检测</p>
              <p>• 多轮对话系统</p>
              <p>• MCP 电商集成</p>
              <p>• RAG 检索增强生成</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">联系我们</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Github className="w-4 h-4" />
                <span>ark2321</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@littleskin.ai</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>400-123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 SkinTech. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
              <a href="#" className="hover:text-white transition-colors">关于我们</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};