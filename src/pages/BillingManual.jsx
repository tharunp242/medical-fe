import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CreditCard, ShieldCheck, HelpCircle, ArrowRight, Zap, CheckCircle2, CloudLightning } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const BillingManual = () => {
    const steps = [
        {
            title: "Select Your Medicines",
            description: "Browse our verified pharmacy and add required medicines to your global health cart.",
            icon: <Zap className="w-8 h-8 text-amber-500" />
        },
        {
            title: "Prescription Scan",
            description: "Upload your physical prescription for our Arctic AI to automatically identify and verify items.",
            icon: <BookOpen className="w-8 h-8 text-indigo-500" />
        },
        {
            title: "Confirm Logistics",
            description: "Provide your delivery node and contact information accurately for swift fulfillment.",
            icon: <HelpCircle className="w-8 h-8 text-emerald-500" />
        },
        {
            title: "Secure Settlement",
            description: "Complete your transaction using PayPal (INR) or chosen secure biometric gateway.",
            icon: <CreditCard className="w-8 h-8 text-primary-600" />
        }
    ];

    return (
        <div className="min-h-screen mesh-bg relative overflow-hidden py-24 px-6">
            <SEO
                title="Protocol Manual - MΞDSHOP"
                description="The comprehensive guide to MΞDSHOP ordering, billing procedures, and secure medical fulfillment."
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <div className="flex justify-center gap-3 mb-8">
                        <span className="bg-primary-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary-500/30">
                            Knowledge Center
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
                        Fulfillment <span className="text-gradient-primary">Manual.</span>
                    </h1>
                    <p className="text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-bold tracking-tight">
                        A definitive blueprint for navigating the MΞDSHOP Arctic checkout process and payment architecture.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Main Content Hub */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Interactive Steps */}
                        <div className="grid md:grid-cols-2 gap-10">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass p-12 rounded-[4rem] border-white/60 group hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="w-20 h-20 bg-white/50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-primary-600 group-hover:text-white transition-all duration-700 shadow-sm">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">{step.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-bold italic opacity-80">
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Payment Security Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-900 rounded-[5rem] p-16 text-white relative overflow-hidden shadow-2xl"
                        >
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl font-black mb-6 tracking-tighter leading-tight">
                                        Neural Payment <span className="text-primary-400">Security</span>
                                    </h2>
                                    <p className="text-lg opacity-70 mb-12 leading-relaxed font-bold italic">
                                        Leveraging Zero-Knowledge Proofs and bank-grade encryption nodes to ensure your transaction is invisible and invincible.
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center">
                                            <ShieldCheck className="w-8 h-8 text-primary-400" />
                                        </div>
                                        <div className="text-sm font-black text-slate-400 uppercase tracking-widest leading-loose">
                                            Certified <br /> Encrypted Nodes
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        "End-to-End SSL Stream",
                                        "PayPal Biometric Handshake",
                                        "Real-time INR Sync",
                                        "Identity Preservation"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-8 py-5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors cursor-default">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="font-black text-xs uppercase tracking-widest">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                        </motion.div>
                    </div>

                    {/* Support & Fast Actions Sidebar */}
                    <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
                        <div className="glass p-12 rounded-[4rem] border-white/60 shadow-2xl text-center">
                            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CloudLightning className="w-10 h-10 text-primary-600" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Need Assistance?</h3>
                            <p className="text-slate-500 mb-10 font-bold opacity-80 leading-relaxed italic">Our neural support nodes are active 24/7 for real-time guidance.</p>
                            <div className="space-y-4">
                                <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group">
                                    Initiate Chat <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full bg-white text-slate-900 border border-slate-100 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                                    Transmit Email
                                </button>
                            </div>
                        </div>

                        <div className="p-10 bg-white/30 rounded-[3rem] border border-white/60">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 px-2">Quick Resources</h3>
                            <ul className="space-y-6">
                                {[
                                    "Neural Invoice Guide",
                                    "Refund Policy Node",
                                    "Terminal Connection Help"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center justify-between group cursor-pointer px-2">
                                        <span className="text-sm font-black text-slate-700 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{item}</span>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-transform group-hover:translate-x-1" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingManual;
