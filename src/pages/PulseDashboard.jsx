import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Pill,
    AlertTriangle,
    Pencil,
    X
} from 'lucide-react';
import SEO from '../components/SEO';
import axios from 'axios';
import toast from 'react-hot-toast';

const PulseDashboard = () => {
    const { user, updateUser } = useAuth();

    const [products, setProducts] = useState([]);
    const [ageCategory, setAgeCategory] = useState(user?.ageCategory || 'Adult');
    const [savingAgeCategory, setSavingAgeCategory] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        ageCategory: user?.ageCategory || 'Adult'
    });
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
                setProducts(response.data || []);
            } catch (err) {
                console.error('Failed to fetch products for dashboard', err);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setAgeCategory(user?.ageCategory || 'Adult');
    }, [user?.ageCategory]);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
                ageCategory: user.ageCategory || 'Adult'
            });
        }
    }, [user]);

    const handleSaveAgeCategory = async (e) => {
        e.preventDefault();
        if (!user?._id) {
            toast.error('Please login again to update your profile');
            return;
        }

        try {
            setSavingAgeCategory(true);
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/auth/users/${user._id}/age-category`, {
                ageCategory
            });

            updateUser(response.data);
            toast.success('Age category updated');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update age category');
        } finally {
            setSavingAgeCategory(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!user?._id) {
            toast.error('Please login again to update your profile');
            return;
        }

        if (!profileData.name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        try {
            setSavingProfile(true);
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/auth/users/${user._id}/profile`, {
                name: profileData.name,
                phone: profileData.phone,
                address: profileData.address,
                ageCategory: profileData.ageCategory
            });

            updateUser(response.data);
            setShowProfileModal(false);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const availableProducts = products.filter((p) => p.stock > 0);
    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10);
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    const stats = [
        { label: 'Available Medicines', value: String(availableProducts.length).padStart(2, '0'), unit: 'items', color: 'bg-emerald-500', icon: <Package /> },
        { label: 'Low Stock Alerts', value: String(lowStockProducts.length).padStart(2, '0'), unit: 'items', color: 'bg-amber-500', icon: <AlertTriangle /> },
        { label: 'Out of Stock', value: String(outOfStockProducts.length).padStart(2, '0'), unit: 'items', color: 'bg-red-500', icon: <Clock /> }
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

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setShowProfileModal(true)}
                        className="glass-card p-6 rounded-[2.5rem] flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-all"
                    >
                        <Pencil className="w-6 h-6 text-primary-600" />
                    </motion.button>
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

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 rounded-[2.5rem] mb-10"
                >
                    <div className="mb-8 pb-8 border-b border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Profile Age Category</h3>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Update for Better Recommendations</span>
                        </div>

                        <form onSubmit={handleSaveAgeCategory} className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
                            <div className="w-full md:max-w-sm">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Age Category</label>
                                <select
                                    value={ageCategory}
                                    onChange={(e) => setAgeCategory(e.target.value)}
                                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                >
                                    <option value="Child">Child</option>
                                    <option value="Adult">Adult</option>
                                    <option value="Senior Citizen">Senior Citizen</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={savingAgeCategory}
                                className={`px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${savingAgeCategory
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-primary-600'
                                    }`}
                            >
                                {savingAgeCategory ? 'Saving...' : 'Save Age Category'}
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Stock Details</h3>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Inventory Snapshot</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-3">Low Stock Products</p>
                            {lowStockProducts.slice(0, 5).map((p) => (
                                <div key={p._id} className="flex items-center justify-between text-sm font-bold text-slate-700 py-1">
                                    <span className="truncate pr-3">{p.name}</span>
                                    <span className="text-amber-700">{p.stock} left</span>
                                </div>
                            ))}
                            {lowStockProducts.length === 0 && <p className="text-sm font-bold text-slate-500">No low-stock products right now.</p>}
                        </div>

                        <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                            <p className="text-xs font-black text-red-700 uppercase tracking-widest mb-3">Out of Stock Products</p>
                            {outOfStockProducts.slice(0, 5).map((p) => (
                                <div key={p._id} className="flex items-center justify-between text-sm font-bold text-slate-700 py-1">
                                    <span className="truncate pr-3">{p.name}</span>
                                    <span className="text-red-700">Out</span>
                                </div>
                            ))}
                            {outOfStockProducts.length === 0 && <p className="text-sm font-bold text-slate-500">All listed products are in stock.</p>}
                        </div>
                    </div>
                </motion.div>

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

            {/* Profile Edit Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl relative"
                        >
                            <button onClick={() => setShowProfileModal(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>

                            <div className="p-12">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Edit <span className="text-primary-600">Profile</span></h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10 italic">Update your personal information</p>

                                <form onSubmit={handleSaveProfile} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Address</label>
                                        <textarea
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none font-bold resize-none h-24"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Age Category</label>
                                        <select
                                            value={profileData.ageCategory}
                                            onChange={(e) => setProfileData({ ...profileData, ageCategory: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none font-bold"
                                        >
                                            <option value="Child">Child</option>
                                            <option value="Adult">Adult</option>
                                            <option value="Senior Citizen">Senior Citizen</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={savingProfile}
                                        className={`w-full py-6 mt-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl ${savingProfile
                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                            : 'bg-slate-900 text-white hover:bg-primary-600'
                                            }`}
                                    >
                                        {savingProfile ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PulseDashboard;
