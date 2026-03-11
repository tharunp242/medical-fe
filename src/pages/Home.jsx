import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Home = () => {
    return (
        <div className="min-h-screen mesh-bg relative overflow-hidden">
            <SEO
                title="Sri Durga Medicals"
                description="Experience the future of healthcare with MedShop. Cool, fast, and AI-powered medicine delivery at your fingertips."
            />

            {/* Premium Dynamic Background Effects */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary-50/40 rounded-full blur-[150px] animate-float"></div>
            <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-primary-50/20 rounded-full blur-[100px]"></div>


            {/* Hero Section */}
            <section className="max-w-7xl mx-auto pt-32 pb-40 px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-slate-900 font-extrabold mb-12 shadow-xl shadow-slate-200/20"
                    >
                        <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                        </span>
                        <span className="tracking-tight uppercase text-xs">Premium Arctic Care 24/7</span>
                    </motion.div>

                    <h1 className="text-7xl lg:text-[10rem] font-black text-slate-900 leading-[0.8] mb-10 tracking-[-0.05em]">
                        <div className="overflow-hidden">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                                className="inline-block"
                            >
                                Pure
                            </motion.span>
                        </div>
                        <div className="overflow-hidden">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
                                className="inline-block text-gradient-primary"
                            >
                                Health.
                            </motion.span>
                        </div>
                    </h1>


                    <p className="text-2xl text-slate-500/80 mb-14 max-w-lg leading-relaxed font-semibold tracking-tight">
                        The ultimate medical experience. Fast, intuitive, and powered by precision AI.
                    </p>

                    <div className="flex flex-wrap gap-8 items-center">
                        <Link to="/prescription" className="btn-medical group">
                            Get Started
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <ArrowRight className="w-6 h-6" />
                            </motion.div>
                        </Link>
                        <Link to="/store" className="group flex items-center gap-3 px-8 py-5 bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white rounded-[1.5rem] font-black text-slate-800 transition-all shadow-xl shadow-slate-200/10">
                            Explore Shop
                            <Package className="w-5 h-5 text-primary-500 group-hover:rotate-12 transition-transform" />
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-20 flex items-center gap-8"
                    >
                        <div className="flex -space-x-5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/150?u=${i + 50}`} className="w-14 h-14 rounded-full border-[5px] border-white shadow-2xl hover:translate-y-[-5px] transition-transform cursor-pointer" />
                            ))}
                        </div>
                        <div className="h-10 w-[2px] bg-slate-200 rounded-full"></div>
                        <div>
                            <p className="text-xl font-black text-slate-900 leading-none">50k+</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Health Partners</p>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    <div className="relative z-10">
                        <div className="absolute inset-0 bg-primary-500/10 blur-[120px] rounded-full scale-110"></div>
                        <img
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop"
                            alt="Modern Medical"
                            className="rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] border-[8px] border-white/50 object-cover aspect-[4/5] hover:scale-[1.03] transition-transform duration-[1.5s] ease-out"
                        />

                        {/* Floating Arctic Cards */}
                        <motion.div
                            animate={{ y: [0, -30, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute -bottom-12 -right-12 glass-card p-10 rounded-[3rem] max-w-[280px] z-20 backdrop-blur-3xl"
                        >
                            <div className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-sky-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-500/30">
                                <Shield className="text-white w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter">Pure Quality</h3>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed">Certified pharmaceutical standards for your safety.</p>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 30, 0] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
                            className="absolute top-20 -left-16 glass-card p-6 rounded-[2.5rem] z-20 flex items-center gap-5"
                        >
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Clock className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Response</p>
                                <p className="text-lg font-black text-slate-900 tracking-tight">45 Mins Delivery</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Premium Features Section */}
            <section className="max-w-7xl mx-auto pb-48 px-6 relative z-10">
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { title: "Arctic Delivery", icon: <Truck />, color: "from-blue-600 to-sky-400", desc: "Ultra-fast cryogenic delivery for sensitive medical supplies." },
                        { title: "AI Vision", icon: <Package />, color: "from-primary-600 to-accent-500", desc: "Our neural networks analyze your prescriptions with 99.9% accuracy." },
                        { title: "Global Network", icon: <Clock />, color: "from-emerald-600 to-teal-400", desc: "Connected to a sprawling network of premium licensed pharmacies." }
                    ].map((feat, i) => (
                        <motion.div
                            key={feat.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.8 }}
                            whileHover={{ y: -20, scale: 1.02 }}
                            className="p-12 rounded-[4rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-2lx hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 group"
                        >
                            <div className={`w-20 h-20 bg-gradient-to-br ${feat.color} rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl group-hover:rotate-[15deg] transition-transform duration-700`}>
                                {React.cloneElement(feat.icon, { className: "text-white w-10 h-10" })}
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter">{feat.title}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed text-lg italic opacity-80">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
