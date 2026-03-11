import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || password.length < 6) {
            toast.error('Data validation failed. Check entries.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password
            });

            login(response.data.user);
            toast.success(`Identity Confirmed. Welcome to the Network, ${response.data.user.name}`);
            navigate('/');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen mesh-bg flex items-center justify-center px-6 relative overflow-hidden">
            <SEO
                title="Establish Identity - MΞDSHOP"
                description="Join the premium Arctic healthcare network for personalized medical delivery and AI diagnostics."
            />

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-[520px] relative z-10"
            >
                <div className="glass p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-white/60 text-center">

                    <div className="mb-10">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-20 h-20 bg-primary-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/40 border border-white/20"
                        >
                            <UserPlus className="text-white w-10 h-10" />
                        </motion.div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">Establish Identity.</h2>
                        <p className="text-slate-500 font-bold tracking-tight">Begin your premium Arctic health journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 text-left">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
                            <div className="relative">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white/50 border border-white rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-bold placeholder:text-slate-300"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Digital Identification</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white/50 border border-white rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-bold placeholder:text-slate-300"
                                    placeholder="email@provider.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white/50 border border-white rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-bold placeholder:text-slate-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg mt-6 shadow-2xl hover:bg-primary-600 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Confirm Registration <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-12 space-y-6">
                        <p className="text-sm font-bold text-slate-500">
                            Already verified?{' '}
                            <Link to="/login" className="text-primary-600 font-black hover:underline uppercase tracking-widest text-xs px-2">
                                Access Portal
                            </Link>
                        </p>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-3">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                <ShieldCheck className="w-4 h-4" /> HIPAA Protocol Active
                            </div>
                            <Sparkles className="w-4 h-4 text-primary-200" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
