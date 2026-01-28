import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles, Phone, Mail, Building, PieChart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// for production
// const API_BASE = 'https://fly-tech-backend.onrender.com/api';

const App = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm the Fly Your Tech assistant. How can I help you today? I can tell you about our services, pricing, or even help you schedule a meeting." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
      });
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Is the backend running?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl h-[85vh] glass-morphism rounded-3xl overflow-hidden flex flex-col z-10"
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Fly Your Tech</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Assistant Online</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Quick Actions</span>
              <div className="flex gap-2">
                <Building size={16} className="text-slate-400 hover:text-blue-400 cursor-help" title="Company Info" />
                <PieChart size={16} className="text-slate-400 hover:text-blue-400 cursor-help" title="Services" />
                <Calendar size={16} className="text-slate-400 hover:text-blue-400 cursor-help" title="Schedule" />
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`p-4 rounded-2xl ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-900/20'
                    : 'bg-white/5 border border-white/10 rounded-tl-none'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-400" />
                  <span className="text-sm text-slate-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our services, pricing, or leads..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 w-12 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-900/20"
            >
              <Send size={20} className="text-white" />
            </button>
          </form>
          <p className="text-[10px] text-center mt-3 text-slate-500 font-medium">
            Powered by Gemini & LangGraph • Advanced Tool Calling Integrated
          </p>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl z-10">
        <div className="glass-morphism p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400"><Mail size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Email Us</p>
            <p className="text-sm font-semibold">contact@flyyourtech.com</p>
          </div>
        </div>
        <div className="glass-morphism p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400"><Phone size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Call Us</p>
            <p className="text-sm font-semibold">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="glass-morphism p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400"><Building size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Location</p>
            <p className="text-sm font-semibold">Silicon Valley, CA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
