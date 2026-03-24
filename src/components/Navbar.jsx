import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Pill, LogOut, ChevronDown, ShoppingBag, Package, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', phone: '', address: '', ageCategory: 'Adult' });
    const [savingProfile, setSavingProfile] = useState(false);
    const { cartCount } = useCart();
    const location = useLocation();
    const { user, logout, updateUser } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleSaveProfile = async () => {
        if (!profileData.name || !profileData.phone || !profileData.address) {
            alert('Please fill all fields');
            return;
        }
        setSavingProfile(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users/${user._id}/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: profileData.name,
                    phone: profileData.phone,
                    address: profileData.address,
                    ageCategory: profileData.ageCategory
                })
            });
            if (response.ok) {
                const updated = await response.json();
                updateUser(updated);
                setShowProfileModal(false);
                setIsProfileOpen(false);
            }
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/store' },
        { name: 'Prescription', path: '/prescription' },
        { name: 'Appointments', path: '/appointments' },
        { name: 'Orders', path: '/orders' },
    ];


    if (user?.role === 'admin') {
        navLinks.push({ name: 'Calculator', path: '/bill-calculator' });
        navLinks.push({ name: 'Admin', path: '/admin' });
    }





    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${isScrolled ? 'py-4 px-4' : 'py-6 px-8'}`}>
            <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-1000 ${isScrolled ? 'glass rounded-[2rem] px-8 py-3 shadow-2xl' : 'glass rounded-[2.5rem] px-10 py-5 bg-white/20 border-white/30'}`}>
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: [0, 90, 0] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="bg-primary-600 w-12 h-12 rounded-[1rem] flex items-center justify-center shadow-2xl shadow-primary-500/40"
                        >
                            <Pill className="text-white w-6 h-6" />
                        </motion.div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-[-0.08em] text-slate-900 group-hover:text-primary-600 transition-colors leading-none">
                            Sri <span className="text-primary-500">Durga</span> Medicals
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mt-1">Healthcare</span>
                    </div>
                </Link>


                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Link
                        to="/"
                        className={`text-sm uppercase tracking-[0.2em] font-black transition-all relative group ${location.pathname === '/' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Home
                        <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </Link>

                    <Link
                        to="/store"
                        className={`text-sm uppercase tracking-[0.2em] font-black transition-all relative group ${location.pathname === '/store' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Products
                        <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${location.pathname === '/store' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </Link>

                    <Link
                        to="/prescription"
                        className={`text-sm uppercase tracking-[0.2em] font-black transition-all relative group ${location.pathname === '/prescription' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Prescription
                        <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${location.pathname === '/prescription' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </Link>
                    <Link
                        to="/orders"
                        className={`text-sm uppercase tracking-[0.2em] font-black transition-all relative group ${location.pathname === '/orders' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Orders
                        <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${location.pathname === '/orders' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </Link>

                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className={`text-sm uppercase tracking-[0.2em] font-black transition-all relative group ${location.pathname === '/admin' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Admin
                            <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${location.pathname === '/admin' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/cart" className="p-3 text-slate-500 hover:text-primary-600 transition-all relative group">
                        <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-5 h-5 bg-slate-900 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </Link>


                    {user ? (
                        <div className="relative ml-2">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-2 pr-5 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white hover:border-primary-200 transition-all group shadow-sm"
                            >
                                <div className="w-9 h-9 bg-primary-600 text-white rounded-full flex items-center justify-center font-black shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-black text-slate-800 hidden lg:block tracking-tight">{user.name}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-4 w-56 glass rounded-[2rem] p-3 shadow-2xl border border-white/60 z-50"
                                    >
                                        <div className="px-4 py-3 mb-2 border-b border-slate-100/50">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</p>
                                            <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
                                        </div>
                                                <Link 
                                            to="/orders" 
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-2xl transition-all"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Package className="w-4 h-4" /> My Orders
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-2xl transition-all">
                                                <User className="w-4 h-4" /> Admin Portal
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setShowProfileModal(true);
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-2xl transition-all"
                                        >
                                            <Pencil className="w-4 h-4" /> Edit Profile
                                        </button>
                                        <button
                                            onClick={() => { logout(); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                        >
                                            <LogOut className="w-4 h-4" /> Log Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4 ml-2">
                            <Link to="/login" className="text-sm font-black text-slate-600 hover:text-primary-600 px-4 tracking-tight">Login</Link>
                            <Link to="/signup" className="btn-primary !py-2.5 !px-7 !rounded-xl text-sm">Join Now</Link>
                        </div>
                    )}

                    <button className="md:hidden p-3 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-4 right-4 mt-4 glass rounded-[2.5rem] p-8 shadow-2xl border border-white/60 flex flex-col gap-4"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-xl font-black py-4 border-b border-slate-100 last:border-0 transition-colors ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-800'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md mx-4 bg-white rounded-[2.5rem] shadow-2xl p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-slate-900">Edit Profile</h2>
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSaveProfile();
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full mt-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 font-bold text-sm"
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Phone</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full mt-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 font-bold text-sm"
                                        placeholder="Your phone number"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Address</label>
                                    <input
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        className="w-full mt-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 font-bold text-sm"
                                        placeholder="Your address"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Age Category</label>
                                    <select
                                        value={profileData.ageCategory}
                                        onChange={(e) => setProfileData({ ...profileData, ageCategory: e.target.value })}
                                        className="w-full mt-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 font-bold text-sm"
                                    >
                                        <option value="Child">Child</option>
                                        <option value="Adult">Adult</option>
                                        <option value="Senior Citizen">Senior Citizen</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="w-full mt-6 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50"
                                >
                                    {savingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};


export default Navbar;

