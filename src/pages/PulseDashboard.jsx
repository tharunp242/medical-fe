import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Activity,
    Calendar,
    Clipboard,
    Heart,
    ArrowUpRight,
    Clock,
    Package,
    ShieldCheck,
    Sparkles,
    ThermometerSnowflake,
    Pill
} from 'lucide-react';
import SEO from '../components/SEO';

const PulseDashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: "Health Score", value: "98", unit: "pts", color: "bg-emerald-500", icon: <Activity /> },
        { label: "Active Orders", value: "02", unit: "pkg", color: "bg-primary-500", icon: <Package /> },
        { label: "Days to Refill", value: "14", unit: "days", color: "bg-accent-500", icon: <Clock /> }
    ];

    const recentPrescriptions = [
        { id: "RX-9012", date: "Oct 12, 2023", items: "Paracetamol, Cetirizine", status: "Verified", color: "emerald" },
        { id: "RX-8845", date: "Sep 28, 2023", items: "Amoxicillin", status: "Archived", color: "slate" }
    ];

    return (
        <div className="min-h-screen mesh-bg py-24 px-6 relative overflow-hidden">
            <SEO
                title="Wellness Pulse - Your Health Dashboard"
                description="Monitor your medications, track cold-chain deliveries, and manage your digitized medicine cabinet."
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-200">
                                neural pulse active
                            </div>
                            <Sparkles className="w-4 h-4 text-primary-500" />
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                            Hello, <span className="text-gradient-primary">{user?.name || 'Guest'}</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-bold tracking-tight">Your health ecosystem is currently performing optimally.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 rounded-[2.5rem] flex items-center gap-6"
                    >
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cold Chain Transit</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">4.2°C</p>
                        </div>
                        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100">
                            <ThermometerSnowflake className="text-primary-500 animate-pulse" />
                        </div>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-10 mb-16">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-10 shadow-lg relative z-10`}>
                                {stat.icon}
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-6xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                                <span className="text-lg font-black text-slate-400">{stat.unit}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Digital Cabinet */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 glass-card p-12 rounded-[4rem] relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Digital Cabinet</h3>
                            <button className="text-sm font-black text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest flex items-center gap-2">
                                View All <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {recentPrescriptions.map((rx) => (
                                <div key={rx.id} className="group p-8 bg-white/40 hover:bg-white rounded-[2.5rem] border border-slate-100 transition-all duration-500 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 bg-${rx.color}-50 text-${rx.color}-600 rounded-2xl flex items-center justify-center border border-${rx.color}-100`}>
                                            <Clipboard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-xl font-black text-slate-900">{rx.id}</h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${rx.status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {rx.status}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 tracking-tight">{rx.items}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{rx.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Refill */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass rounded-[4rem] p-12 flex flex-col items-center text-center relative overflow-hidden bg-primary-600 shadow-2xl shadow-primary-500/30"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl">
                            <Pill className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tighter leading-tight mb-4">Express Refill</h3>
                        <p className="text-primary-100 font-bold mb-10 leading-relaxed italic opacity-80">Refill your recurring medications with a single neural gesture.</p>
                        <button className="w-full py-6 bg-white text-primary-600 rounded-3xl font-black text-lg hover:bg-primary-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                            Instant Refill
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PulseDashboard;
