import React, { useState } from 'react';
import { SkinAnalysis } from '../App';
import { MessageCircle, Send, Bot, User, CheckCircle } from 'lucide-react';

interface DialogueInterfaceProps {
  analysis: SkinAnalysis;
  onComplete: (updatedAnalysis: SkinAnalysis) => void;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const translations = {
  zh: {
    intelligentOptimization: '智能对话优化',
    optimizationDesc: '通过对话提升分析准确性',
    initialMessage1: `您好！我注意到这次皮肤分析的置信度为 {confidence}%，为了给您更准确的建议，我想询问一些补充信息。`,
    initialMessage2: '请问您最近是否有使用特殊的护肤产品？或者有什么特别的皮肤困扰想要改善？',
    followUpMessage: '谢谢您的信息！还有一个问题：您的皮肤在不同季节是否会有明显变化？这将帮助我们调整分析结果。',
    finalMessage: '非常感谢您提供的详细信息！基于我们的对话，我已经更新了您的皮肤分析结果。分析的准确性现在提升到了 95%。',
    dialogueComplete: '对话完成！分析结果已优化',
    viewUpdatedResults: '查看更新的分析结果',
    enterResponse: '请输入您的回答...',
    send: '发送'
  },
  en: {
    intelligentOptimization: 'Intelligent Dialogue Optimization',
    optimizationDesc: 'Improve analysis accuracy through dialogue',
    initialMessage1: `Hello! I noticed that the confidence level of this skin analysis is {confidence}%. To provide you with more accurate recommendations, I would like to ask some additional information.`,
    initialMessage2: 'Have you been using any special skincare products recently? Or do you have any particular skin concerns you would like to improve?',
    followUpMessage: 'Thank you for the information! One more question: Does your skin change significantly in different seasons? This will help us adjust the analysis results.',
    finalMessage: 'Thank you very much for providing detailed information! Based on our conversation, I have updated your skin analysis results. The accuracy of the analysis has now improved to 95%.',
    dialogueComplete: 'Dialogue completed! Analysis results optimized',
    viewUpdatedResults: 'View Updated Analysis Results',
    enterResponse: 'Please enter your response...',
    send: 'Send'
  }
};

export const DialogueInterface: React.FC<DialogueInterfaceProps> = ({ analysis, onComplete, theme, language }) => {
  const t = translations[language];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: t.initialMessage1.replace('{confidence}', (analysis.confidence * 100).toFixed(1)),
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'bot',
      content: t.initialMessage2,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [dialogueComplete, setDialogueComplete] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: messages.length < 6 
          ? t.followUpMessage
          : t.finalMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      if (messages.length >= 6) {
        setDialogueComplete(true);
      }
    }, 2000);
  };

  const handleComplete = () => {
    const updatedAnalysis: SkinAnalysis = {
      ...analysis,
      confidence: 0.95,
      recommendations: [
        ...analysis.recommendations,
        '根据对话信息，建议调整护肤程序',
        '考虑季节性护肤方案'
      ]
    };
    onComplete(updatedAnalysis);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-800/50 border-gray-600 backdrop-blur-sm'
      }`}>
        {/* Header */}
        <div className={`text-white p-6 transition-all duration-500 ${
          theme === 'light' 
            ? 'bg-gradient-to-r from-blue-600 to-teal-600' 
            : 'bg-gradient-to-r from-blue-700 to-teal-700'
        }`}>
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-bold">{t.intelligentOptimization}</h3>
              <p className={`transition-colors duration-500 ${
                theme === 'light' ? 'text-blue-100' : 'text-blue-200'
             }`}>{t.optimizationDesc}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'bot' 
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.type === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                
                <div className={`p-4 rounded-2xl ${
                  message.type === 'bot'
                    ? `${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-200'}`
                    : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                } ${
                  message.type === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                }`}>
                  <p>{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'bot' 
                      ? `${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}` 
                      : 'text-blue-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className={`p-4 rounded-2xl rounded-bl-sm transition-all duration-500 ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                }`}>
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce transition-colors duration-500 ${
                      theme === 'light' ? 'bg-gray-400' : 'bg-gray-500'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce transition-colors duration-500 ${
                      theme === 'light' ? 'bg-gray-400' : 'bg-gray-500'
                    }`} style={{animationDelay: '0.1s'}}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce transition-colors duration-500 ${
                      theme === 'light' ? 'bg-gray-400' : 'bg-gray-500'
                    }`} style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`border-t p-6 transition-colors duration-500 ${
          theme === 'light' ? 'border-gray-200' : 'border-gray-600'
        }`}>
          {dialogueComplete ? (
            <div className="text-center space-y-4">
              <div className={`flex items-center justify-center space-x-2 transition-colors duration-500 ${
                theme === 'light' ? 'text-green-600' : 'text-green-400'
              }`}>
                <CheckCircle className="w-6 h-6" />
               <span className="font-semibold">{t.dialogueComplete}</span>
              </div>
              <button
                onClick={handleComplete}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all"
              >
               {t.viewUpdatedResults}
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.enterResponse}
                className={`flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-900'
                    : 'border-gray-600 bg-gray-700 text-white'
                }`}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{t.send}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};