import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Mic, Volume2, Bot, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';

export const MedicalChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Namaste! Hello! I am your MedFlow AI assistant. I can analyze patient reports and talk in English, Hindi, or Telugu. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { patients, calculatePatientRisk } = useWorkflow();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const speak = (text) => {
        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Detect language for better voice selection (basic detection)
        // Note: Voice support varies by OS/Browser. 
        // We try to find a suitable voice.
        const voices = window.speechSynthesis.getVoices();

        // Try to match voice based on content
        if (text.match(/[\u0C00-\u0C7F]/)) utterance.lang = 'te-IN'; // Telugu
        else if (text.match(/[\u0900-\u097F]/)) utterance.lang = 'hi-IN'; // Hindi
        else utterance.lang = 'en-US';

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        // Simulate AI Logic - Including "Document Analysis" and "Medical Suggestion" context
        setTimeout(() => {
            let response = "";
            const lowerInput = userMessage.toLowerCase();

            // Medical Suggestions Logic
            if (lowerInput.includes('fever') || lowerInput.includes('bukhar') || lowerInput.includes('jwaram')) {
                if (lowerInput.includes('telugu')) {
                    response = "జ్వరం కోసం: పారాసెటమాల్ (Paracetamol) సాధారణంగా సూచించబడుతుంది. దయచేసి విశ్రాంతి తీసుకోండి మరియు తగినంత నీరు త్రాగండి. లక్షణాలు తగ్గకపోతే వెంటనే డాక్టరును సంప్రదించండి.";
                } else if (lowerInput.includes('hindi')) {
                    response = "बुखार के लिए: पैरासिटामोल (Paracetamol) आमतौर पर दी जाती है। कृपया आराम करें और खूब पानी पिएं। यदि लक्षण बने रहते हैं, तो डॉक्टर से सलाह लें।";
                } else {
                    response = "For Fever: Paracetamol is typically recommended for symptom relief. Ensure plenty of rest and hydration. If the temperature exceeds 103°F or persists, please consult a physician immediately.";
                }
            } else if (lowerInput.includes('pain') || lowerInput.includes('dard') || lowerInput.includes('noppi')) {
                response = "For Pain relief: Ibuprofen or Acetaminophen can be used. However, it is vital to identify the cause. Is the pain acute or chronic?";
            } else if (lowerInput.includes('headache') || lowerInput.includes('sar dard') || lowerInput.includes('tala noppi')) {
                response = "For Headache: Take rest in a dark room and stay hydrated. You may take a mild analgesic. If accompanied by blurred vision, seek emergency care.";
            }
            // Mock Document/Patient Analysis Logic
            else if (lowerInput.includes('report') || lowerInput.includes('analyze') || lowerInput.includes('summary')) {
                const latestPatient = patients[0];
                const risk = calculatePatientRisk(latestPatient);

                if (lowerInput.includes('telugu')) {
                    response = `రిపోర్ట్ విశ్లేషణ: ${latestPatient.name} యొక్క పరిస్థితి ${risk > 70 ? 'ప్రమాదకరంగా' : 'మెరుగ్గా'} ఉంది. రిస్క్ స్కోరు: ${risk}%.`;
                } else if (lowerInput.includes('hindi')) {
                    response = `रिपोर्ट विश्लेषण: ${latestPatient.name} की स्थिति ${risk > 70 ? 'चिंताजनक' : 'स्थिर'} है। रिस्क स्कोर: ${risk}%.`;
                } else {
                    response = `Analysis Report: Patient ${latestPatient.name} has a risk score of ${risk}%. Current status is ${latestPatient.status}. I recommend immediate follow-up on ${latestPatient.tasks.find(t => t.status !== 'Completed')?.action || 'all tasks'}.`;
                }
            } else if (lowerInput.includes('telugu')) {
                response = "నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?";
            } else if (lowerInput.includes('hindi')) {
                response = "नमस्ते! मैं आपकी किस प्रकार सहायता कर सकता हूँ?";
            } else {
                response = "I can analyze clinical reports, suggest basic first-aid/medicines for common symptoms, and provide multilingual support. Try asking 'I have a fever' or 'Analyze the current report'.";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
            speak(response);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white w-[400px] h-[550px] rounded-3xl border border-slate-200 shadow-premium flex flex-col overflow-hidden mb-6"
                    >
                        {/* Header */}
                        <div className="bg-hospital-900 p-5 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-hospital-500/20 border border-hospital-400/30 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-hospital-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">MedFlow Clinical AI</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-hospital-300 font-bold uppercase tracking-wider">Multi-lingual Mode</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user'
                                        ? 'bg-hospital-600 text-white rounded-tr-none shadow-md'
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                        }`}>
                                        <p className="leading-relaxed">{m.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Input */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <button className="p-1 px-2 bg-slate-100 rounded text-[10px] font-bold text-slate-500 border border-slate-200">Telugu</button>
                                <button className="p-1 px-2 bg-slate-100 rounded text-[10px] font-bold text-slate-500 border border-slate-200">Hindi</button>
                                <button className="p-1 px-2 bg-slate-100 rounded text-[10px] font-bold text-slate-500 border border-slate-200">Analyze Report</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask in English, Hindi or Telugu..."
                                        className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-hospital-500/20 outline-none"
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-hospital-600">
                                        <Mic className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleSend}
                                    className="p-3 bg-hospital-600 hover:bg-hospital-700 text-white rounded-2xl shadow-lg shadow-hospital-600/20 transition-all active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-hospital-900 text-white rounded-full shadow-premium flex items-center justify-center relative group"
            >
                {isOpen ? <X className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-hospital-500 border-2 border-slate-50 rounded-full animate-bounce flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                    </div>
                )}
                <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
                    AI Clinical Assistant
                </div>
            </motion.button>
        </div>
    );
};
