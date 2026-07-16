import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, ChevronLeft, Bot } from 'lucide-react';
import { analyzeMessage, viviQuickActions, AppConfig, BotAction } from '../data/viviKnowledge';

interface Message {
  id: string;
  text: string;
  sender: 'vivi' | 'user';
  timestamp: Date;
  action?: BotAction;
}

interface ViviBotProps {
  config: AppConfig;
  onNavigate?: (view: 'home' | 'services' | 'booking') => void;
  hidden?: boolean;
}

export default function ViviBot({ config, onNavigate, hidden }: ViviBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hidden && isOpen) {
      setIsOpen(false);
    }
  }, [hidden, isOpen]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      text: 'يا هلا فيكِ في ڤيڤيد بيوتي! ✨',
      sender: 'vivi',
      timestamp: new Date()
    },
    {
      id: 'welcome-2',
      text: 'أنا ڤيفي، خبيرة التجميل الخاصة بكِ ومساعدتك الشخصية. كيف أقدر أساعدك اليوم؟ تقدرين تسأليني عن الحجوزات، المواعيد، أو حتى نصائح للعناية بجمالك!',
      sender: 'vivi',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleActionClick = (action: BotAction) => {
    if (action.type === 'link') {
      window.open(action.target, '_blank');
    } else if (action.type === 'scroll') {
      if (onNavigate) {
        if (action.target === 'booking-section') onNavigate('booking');
        else if (action.target === 'services-section') onNavigate('services');
        else if (action.target === 'location-section') onNavigate('home');
      }
      setIsOpen(false); // Close the chat to show the scrolled section
      setTimeout(() => {
        const element = document.getElementById(action.target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (action.target === 'booking-section' || action.target === 'services-section') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 300);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking time based on message length
    const thinkingTime = Math.min(1500, Math.max(800, text.length * 20));

    setTimeout(() => {
      const response = analyzeMessage(text, config);
      const newViviMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        action: response.action,
        sender: 'vivi',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newViviMsg]);
      setIsTyping(false);
    }, thinkingTime);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && !hidden && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: isScrolling ? 0.4 : 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ opacity: { duration: 0.3 } }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-4 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 text-stone-900 shadow-xl shadow-amber-900/20 hover:shadow-amber-500/30 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-8 h-8 relative z-10" />
              {!isScrolling && (
                <span className="absolute inset-0 -m-4 rounded-full border border-amber-400/50 animate-ping" style={{ animationDuration: '3s' }}></span>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-[calc(100vw-2rem)] md:w-[380px] h-[600px] max-h-[calc(100vh-2rem)] flex flex-col bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-stone-800 to-stone-900 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-stone-900">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-stone-900 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-stone-100 flex items-center gap-1 text-sm">
                    ڤيفي
                  </h3>
                  <p className="text-xs text-stone-400">مساعدتك الشخصية في ڤيڤيد</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-stone-800 text-stone-400' : 'bg-gradient-to-br from-amber-200 to-amber-400 text-stone-900'}`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-amber-200 text-stone-950 rounded-br-none'
                            : 'bg-stone-800 text-stone-100 rounded-bl-none border border-stone-700'
                        }`}
                      >
                        {msg.text}
                      </div>
                      {/* Render Action Button if it exists */}
                      {msg.action && (
                        <button
                          onClick={() => handleActionClick(msg.action!)}
                          className="self-start inline-flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-amber-500/30 hover:border-amber-400 text-amber-200 text-xs font-medium rounded-xl transition-colors shadow-sm"
                        >
                          {msg.action.label}
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 mx-10">
                    {msg.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-stone-900 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-stone-800 border border-stone-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (only show if latest message is from Vivi) */}
            {messages[messages.length - 1].sender === 'vivi' && !isTyping && (
               <div className="px-4 pb-2 flex flex-wrap gap-2">
                 {viviQuickActions.map((action, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleSendMessage(action)}
                     className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-amber-100 text-xs rounded-full transition-all text-right shadow-sm"
                   >
                     {action}
                   </button>
                 ))}
               </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-stone-900 border-t border-stone-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اسألي ڤيفي..."
                  className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-full py-3 pr-4 pl-12 text-sm text-stone-100 placeholder-stone-500 outline-none transition-colors"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute left-2 p-2 bg-amber-200 hover:bg-amber-300 text-stone-900 rounded-full disabled:opacity-50 disabled:hover:bg-amber-200 transition-colors"
                >
                  <Send className="w-4 h-4 rtl:-scale-x-100" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
