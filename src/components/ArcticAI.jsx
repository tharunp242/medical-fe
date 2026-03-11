import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User, ArrowRight, Pill, ShieldCheck, ThermometerSnowflake } from 'lucide-react';

const ArcticAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hello! I am Arctic-AI. How can I assist with your health needs today?", time: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input, time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulated AI logic
        setTimeout(() => {
            let botResponse = "I've analyzed your query. ";
            const text = input.toLowerCase();

            if (text.includes('headache') || text.includes('pain')) {
                botResponse += "For headaches, I recommend Paracetamol or Ibuprofen. Would you like me to find the highest-rated options in our Arctic Store?";
            } else if (text.includes('track') || text.includes('order')) {
                botResponse += "Your recent order is currently in our 'Cold-Chain' transit. The temperature is maintained at 4°C. Shall I show you the live map?";
            } else if (text.includes('prescription')) {
                botResponse += "You can upload your prescription in the 'Prescription' section. I'll analyze it immediately and identify all medications for you.";
            } else {
                botResponse += "I'm searching our verified medical database. Could you please provide more details so I can give you the most accurate assistance?";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse, time: new Date() }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] no-print">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100, rotate: 5 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        className="mb-6 w-[400px] h-[600px] glass rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border-white/60 flex flex-col overflow-hidden"
                    >
                        {/* AI Header */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-400 p-8 flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                                    <Bot className="text-white w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight leading-none">Arctic-AI</h3>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        <p className="text-[10px] font-black text-primary-50 uppercase tracking-[0.2em]">Neural Active</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all transition-transform active:scale-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.type === 'bot' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] p-5 rounded-[2rem] font-bold text-sm leading-relaxed ${msg.type === 'bot'
                                            ? 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                                            : 'bg-primary-600 text-white rounded-tr-none shadow-xl shadow-primary-500/20'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-slate-50 p-5 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-2">
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Suggestions */}
                        <div className="px-6 pb-2">
                            <div className="flex flex-wrap gap-2">
                                {["Order Status", "Analyze Rx", "Dosage Info"].map(sug => (
                                    <button
                                        key={sug}
                                        onClick={() => setInput(sug)}
                                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-all"
                                    >
                                        {sug}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 border-t border-slate-50">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-slate-800"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 p-3 bg-slate-900 text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-20 h-20 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-500 group overflow-hidden ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-primary-600'
                    }`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isOpen ? (
                    <X className="text-white w-8 h-8" />
                ) : (
                    <div className="relative">
                        <MessageSquare className="text-white w-9 h-9" />
                        <Sparkles className="absolute -top-2 -right-2 text-primary-200 w-5 h-5 animate-pulse" />
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default ArcticAI;
