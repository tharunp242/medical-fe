import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    ArrowUpRight,
    TrendingUp,
    RefreshCcw,
    Plus,
    Activity,
    ShieldCheck,
    Database,
    ChevronRight,
    Search,
    X,
    Filter,
    BarChart3,
    CheckCircle2,
    Download,
    History,
    Zap,
    AlertTriangle,
    ChevronDown,
    User,
    LogOut,
    Pencil,
    Trash2
} from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout, updateUser } = useAuth();
    const LOW_STOCK_THRESHOLD = 10;
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        ageCategory: user?.ageCategory || 'Adult'
    });
    const [savingProfile, setSavingProfile] = useState(false);

    // Activity Logs State (Mock)
    const [logs, setLogs] = useState([
        { id: 1, action: "Stock Re-synchronized", node: "Paracetamol", time: "2 mins ago", type: "system" },
        { id: 2, action: "New Order Detected", node: "NODE-88219", time: "15 mins ago", type: "order" },
        { id: 3, action: "Prescription Verified", node: "USER-992", time: "45 mins ago", type: "security" },
    ]);

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        dosage: '',
        requiresPrescription: false
    });

    const fetchData = async () => {
        try {
            const [ordersRes, productsRes, usersRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/orders`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/users`)
            ]);
            setOrders(ordersRes.data || []);
            setProducts(productsRes.data || []);
            setUsers(usersRes.data || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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

    const handleUpdateStock = async (id, stock) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/products/${id}/stock`, { stock });
            toast.success('Inventory Synchronized');
            setLogs(prev => [{ id: Date.now(), action: "Stock Updated", node: "Product Sync", time: "Just now", type: "system" }, ...prev]);
            fetchData();
        } catch (err) {
            toast.error('Sync Failed');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, { status });
            toast.success(`Order set to ${status}`);
            setLogs(prev => [{ id: Date.now(), action: `Status: ${status}`, node: `Order ${id.slice(-4)}`, time: "Just now", type: "order" }, ...prev]);
            fetchData();
        } catch (err) {
            toast.error('Status update failed');
        }
    };

    const handleToggleAdmin = async (userId, makeAdmin) => {
        try {
            // optimistic UI change
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: makeAdmin ? 'admin' : 'user' } : u));
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/role`, { role: makeAdmin ? 'admin' : 'user' });
            toast.success(`User role updated to ${makeAdmin ? 'admin' : 'user'}`);
            setLogs(prev => [{ id: Date.now(), action: `Role changed to ${makeAdmin ? 'admin' : 'user'}`, node: `USER-${userId.slice(-4)}`, time: 'Just now', type: 'system' }, ...prev]);
        } catch (err) {
            toast.error('Failed to update role');
            fetchData();
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
            setUsers(prev => prev.filter(u => u._id !== userId));
            toast.success('User deleted');
            setLogs(prev => [{ id: Date.now(), action: 'User deleted', node: `USER-${userId.slice(-4)}`, time: 'Just now', type: 'system' }, ...prev]);
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, newProduct);
            toast.success('New Medical Node Materialized');
            setShowAddModal(false);
            setLogs(prev => [{ id: Date.now(), action: "Node Materialized", node: newProduct.name, time: "Just now", type: "system" }, ...prev]);
            setNewProduct({ name: '', category: '', price: '', stock: '', dosage: '', requiresPrescription: false });
            fetchData();
        } catch (err) {
            toast.error('Materialization Error');
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        if (!editingProduct?._id) return;

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`, {
                name: editingProduct.name,
                category: editingProduct.category,
                price: Number(editingProduct.price),
                stock: Number(editingProduct.stock),
                dosage: editingProduct.dosage,
                requiresPrescription: Boolean(editingProduct.requiresPrescription)
            });

            toast.success('Product updated successfully');
            setLogs(prev => [{ id: Date.now(), action: 'Product updated', node: editingProduct.name, time: 'Just now', type: 'system' }, ...prev]);
            setShowEditModal(false);
            setEditingProduct(null);
            fetchData();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update product');
        }
    };

    const handleDeleteProduct = async (productId, productName) => {
        if (!confirm(`Delete ${productName}? This action cannot be undone.`)) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productId}`);
            toast.success('Product deleted successfully');
            setLogs(prev => [{ id: Date.now(), action: 'Product deleted', node: productName, time: 'Just now', type: 'system' }, ...prev]);
            fetchData();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to delete product');
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

    const handleExport = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Compiling Neural Data...',
                success: 'Order Manifest Exported (PDF)',
                error: 'Export Interrupted'
            }
        );
    };

    const stats = [
        { label: 'Neural Revenue', value: `₹${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, change: '+12.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Active Dispatches', value: orders.filter(o => o.status === 'Pending').length, change: '-2', icon: ShoppingCart, color: 'text-primary-500', bg: 'bg-primary-500/10' },
        { label: 'Inventory Nodes', value: products.length, change: '+5', icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Users', value: users.length, change: '+1', icon: User, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    ];

    // Chart Data Animation
    const trendPath = "M0 80 Q 20 20, 40 50 T 80 30 T 120 70 T 160 20 T 200 60 T 240 40 T 280 10 T 320 50";

    // Analytics state
    const [analyticsRange, setAnalyticsRange] = useState('day'); // 'day' | 'week' | 'month' | 'year'

    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
    const outOfStockProducts = products.filter((p) => p.stock === 0);
    const filteredProducts = products.filter((p) => {
        const term = productSearch.trim().toLowerCase();
        if (!term) return true;
        return (
            String(p.name || '').toLowerCase().includes(term) ||
            String(p.category || '').toLowerCase().includes(term) ||
            String(p.dosage || '').toLowerCase().includes(term)
        );
    });

    const getBuckets = (range) => {
        const now = new Date();
        if (range === 'day') {
            // 24 hours
            return Array.from({ length: 24 }, (_, i) => {
                const d = new Date(now);
                d.setHours(i, 0, 0, 0);
                return { label: `${i}:00`, start: new Date(d), end: new Date(d.getTime() + 3600 * 1000) };
            });
        }

        if (range === 'week') {
            // last 7 days (Mon-Sun)
            const buckets = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                d.setHours(0, 0, 0, 0);
                const end = new Date(d);
                end.setDate(d.getDate() + 1);
                buckets.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), start: new Date(d), end });
            }
            return buckets;
        }

        if (range === 'month') {
            // last 30 days
            const buckets = [];
            for (let i = 29; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                d.setHours(0, 0, 0, 0);
                const end = new Date(d);
                end.setDate(d.getDate() + 1);
                buckets.push({ label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), start: new Date(d), end });
            }
            return buckets;
        }

        // year
        if (range === 'year') {
            const buckets = [];
            for (let m = 0; m < 12; m++) {
                const d = new Date(now.getFullYear(), m, 1);
                const end = new Date(now.getFullYear(), m + 1, 1);
                buckets.push({ label: d.toLocaleDateString(undefined, { month: 'short' }), start: d, end });
            }
            return buckets;
        }
        return [];
    };

    const aggregateOrders = (ordersList, range) => {
        const buckets = getBuckets(range);
        const values = buckets.map(() => 0);
        ordersList.forEach((o) => {
            const created = new Date(o.createdAt || o.created_at || o.updatedAt || Date.now());
            for (let i = 0; i < buckets.length; i++) {
                if (created >= buckets[i].start && created < buckets[i].end) {
                    values[i] += o.totalAmount || 0; // revenue
                    break;
                }
            }
        });
        return { buckets, values };
    };

    return (
        <div className="min-h-screen mesh-bg py-10 px-8 relative overflow-hidden">
            <SEO title="Neural Command - MΞDSHOP Admin" description="Master control for medical inventory and global fulfillment nodes." />

            <div className="max-w-[1600px] mx-auto relative z-10">
                <div className={`glass rounded-[3rem] p-8 border-white/60 shadow-xl relative z-50 ${showAdminMenu ? 'mb-24' : 'mb-10'}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Admin Dashboard</h1>
                            <p className="text-slate-500 font-bold mt-2">Centralized control for orders, inventory, and analytics.</p>
                        </div>
                        <div className="relative z-50">
                            <button
                                onClick={() => setShowAdminMenu((prev) => !prev)}
                                className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest w-fit flex items-center gap-2"
                            >
                                Admin 
                                <ChevronDown className={`w-4 h-4 transition-transform ${showAdminMenu ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showAdminMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                                        className="absolute right-0 mt-3 w-64 glass rounded-2xl p-3 border border-white/60 shadow-2xl z-[100]"
                                    >
                                        <div className="px-3 py-2 mb-2 border-b border-slate-100/70">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Account</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{user?.email || 'admin@medshop.com'}</p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setShowProfileModal(true);
                                                setShowAdminMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all"
                                        >
                                            <Pencil className="w-4 h-4" /> Edit Profile
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowAdminMenu(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Command Center */}
                    <div className="lg:w-80 space-y-6">
                        <div className="glass p-10 rounded-[3.5rem] border-white/60 space-y-4 shadow-2xl">
                            <div className="px-4 mb-6">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">System <span className="text-primary-600 block">Command</span></h2>
                                <div className="mt-2 text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> Core Online
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                                    { id: 'products', icon: Package, label: 'Product Mgmt' },
                                    { id: 'users', icon: User, label: 'User Mgmt' },
                                    { id: 'orders', icon: ShoppingCart, label: 'Orders' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        disabled={tab.disabled}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] font-black tracking-tight transition-all duration-500 ${activeTab === tab.id
                                            ? 'bg-slate-900 text-white shadow-2xl scale-[1.05]'
                                            : 'text-slate-500 hover:bg-white/50 disabled:opacity-30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[11px]">
                                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary-400' : 'text-slate-400'}`} />
                                            {tab.label}
                                        </div>
                                        {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-primary-400" />}
                                    </button>
                                ))}
                            </nav>

                            <div className="pt-8 mt-8 border-t border-slate-200">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Neural Pulse</h4>
                                <div className="p-4 bg-slate-900 rounded-[2rem] overflow-hidden">
                                    <svg viewBox="0 0 320 100" className="w-full h-12">
                                        <motion.path
                                            d={trendPath}
                                            fill="transparent"
                                            stroke="#16a34a"
                                            strokeWidth="3"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                        />
                                    </svg>
                                    <div className="flex justify-between mt-2 px-2">
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">99.8% Efficiency</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Log Node */}
                        <div className="glass p-8 rounded-[3rem] border-white/60">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <History className="w-4 h-4 text-primary-500" /> Recent Activity
                                </h3>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                            </div>
                            <div className="space-y-4">
                                {logs.map((log) => (
                                    <div key={log.id} className="relative pl-6 pb-2 border-l-2 border-slate-100 last:border-0 last:pb-0">
                                        <div className={`absolute left-[-5px] top-0 w-2 h-2 rounded-full ${log.type === 'system' ? 'bg-primary-500' :
                                            log.type === 'order' ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`} />
                                        <p className="text-[11px] font-black text-slate-800 leading-tight">{log.action}</p>
                                        <p className="text-[10px] font-bold text-slate-400 flex justify-between uppercase tracking-tighter mt-1">
                                            <span>{log.node}</span>
                                            <span className="opacity-60">{log.time}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Interface */}
                    <div className="flex-1 space-y-10">
                        {/* Global stock alerts shown immediately after login */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass p-6 rounded-[2rem] border border-amber-200/70 bg-amber-50/60">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Low Stock</h4>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-black">
                                        {lowStockProducts.length}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {lowStockProducts.slice(0, 5).map((p) => (
                                        <div key={p._id} className="flex items-center justify-between text-sm font-bold text-slate-700">
                                            <span className="truncate pr-4">{p.name}</span>
                                            <span className="text-amber-700">{p.stock} left</span>
                                        </div>
                                    ))}
                                    {lowStockProducts.length === 0 && (
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No low-stock products.</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className="text-xs font-black uppercase tracking-widest text-amber-700 hover:text-amber-800"
                                >
                                    View in Product Management
                                </button>
                            </div>

                            <div className="glass p-6 rounded-[2rem] border border-red-200/70 bg-red-50/60">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-red-600" />
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Out of Stock</h4>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black">
                                        {outOfStockProducts.length}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {outOfStockProducts.slice(0, 5).map((p) => (
                                        <div key={p._id} className="flex items-center justify-between text-sm font-bold text-slate-700">
                                            <span className="truncate pr-4">{p.name}</span>
                                            <span className="text-red-700">Out</span>
                                        </div>
                                    ))}
                                    {outOfStockProducts.length === 0 && (
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No out-of-stock products.</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className="text-xs font-black uppercase tracking-widest text-red-700 hover:text-red-800"
                                >
                                    Restock Products
                                </button>
                            </div>
                        </div>

                        {/* Global Intelligence Stats - show only on Analytics tab */}
                        {activeTab === 'analytics' && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {stats.map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass p-8 rounded-[3rem] border-white/60 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                                                <stat.icon className="w-7 h-7" />
                                            </div>
                                            <span className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                        <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1 leading-none">{stat.value}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>

                                        {/* Hover Sparkle Effect */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-primary-500/10 transition-colors"></div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Dynamic Viewport */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass rounded-[4rem] border-white/60 overflow-hidden shadow-2xl"
                                >
                                    <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/30">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Fulfillment Nodes</h3>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time order synchronization</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleExport}
                                                className="flex items-center gap-2 px-6 py-4 bg-white rounded-2xl border border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                <Download className="w-5 h-5" /> Export Manifest
                                            </button>
                                            <button onClick={fetchData} className="p-4 bg-primary-600 text-white rounded-2xl transition-all shadow-xl shadow-primary-500/30">
                                                <RefreshCcw className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-900/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                <tr>
                                                    <th className="px-10 py-6">Protocol ID</th>
                                                    <th className="px-10 py-6">Recipient Identity</th>
                                                    <th className="px-10 py-6">Quantum Total</th>
                                                    <th className="px-10 py-6">Sync Status</th>
                                                    <th className="px-10 py-6 text-center">Protocol Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 font-bold">
                                                {orders.map((order) => (
                                                    <tr key={order._id} className="hover:bg-white/50 transition-all group">
                                                        <td className="px-10 py-8 text-primary-600 text-sm font-black">#NODE-{order._id.slice(-6).toUpperCase()}</td>
                                                        <td className="px-10 py-8">
                                                            <div className="font-black text-slate-900 leading-tight">{order.customerName}</div>
                                                            <div className="text-xs text-slate-400 italic lowercase tracking-tight">{order.email}</div>
                                                        </td>
                                                        <td className="px-10 py-8 font-black text-slate-900 text-lg">₹{order.totalAmount}</td>
                                                        <td className="px-10 py-8">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${order.status === 'Pending' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                                                                    order.status === 'Confirmed' ? 'bg-primary-100 text-primary-600 border-primary-200' :
                                                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                                                                            order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-600 border-indigo-200' :
                                                                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
                                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-600 border-red-200' :
                                                                            'bg-slate-100 text-slate-600 border-slate-200'
                                                                    }`}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Confirmed">Confirmed</option>
                                                                <option value="Processing">Processing</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-10 py-8 text-center">
                                                            <button className="p-4 bg-slate-900 text-white rounded-2xl group-hover:bg-primary-600 transition-all shadow-lg active:scale-90">
                                                                <ArrowUpRight className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'products' && (
                                <motion.div
                                    key="products"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="glass p-6 rounded-[2rem] border-white/60 flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
                                        <div className="relative w-full md:max-w-md">
                                            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                            <input
                                                value={productSearch}
                                                onChange={(e) => setProductSearch(e.target.value)}
                                                placeholder="Search product by name, category, dosage..."
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                                {filteredProducts.length} of {products.length} products
                                            </span>
                                            <button
                                                onClick={() => setShowAddModal(true)}
                                                className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all"
                                            >
                                                + Add Product
                                            </button>
                                        </div>
                                    </div>

                                    {/* Low Stock Alerts Node */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {products.filter(p => p.stock < 15).map(lowP => (
                                            <motion.div
                                                key={`alert-${lowP._id}`}
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2.5rem] flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                                                        <AlertTriangle className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Critical Stock</h4>
                                                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{lowP.name} is nearly depleted.</p>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-black text-red-600">{lowP.stock} <span className="text-[10px] uppercase">Units</span></div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="grid xl:grid-cols-2 gap-8">
                                        {filteredProducts.map((product) => (
                                            <div key={product._id} className="glass p-8 rounded-[3.5rem] border-white/60 flex gap-8 items-center group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                                <div className="w-32 h-32 bg-slate-900/5 rounded-3xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 relative">
                                                    <Package className="text-slate-300 w-12 h-12 group-hover:scale-125 transition-transform duration-700" />
                                                    {product.stock < 15 && <Zap className="absolute top-2 right-2 w-4 h-4 text-red-500 fill-red-500 animate-pulse" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{product.name}</h4>
                                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${product.stock < 20 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                            Stock: {product.stock}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-4 mb-6">
                                                        <span className="text-[10px] font-black text-slate-400 underline">ID: {product._id.slice(-8).toUpperCase()}</span>
                                                        {product.requiresPrescription && <span className="text-[10px] font-black text-amber-500 flex items-center gap-1 uppercase italic">Prescription Required</span>}
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <input
                                                            type="number"
                                                            id={`stock-${product._id}`}
                                                            className="w-24 px-5 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 text-sm font-black text-center"
                                                            defaultValue={product.stock}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const val = document.getElementById(`stock-${product._id}`).value;
                                                                handleUpdateStock(product._id, parseInt(val));
                                                            }}
                                                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl active:scale-95 shadow-slate-900/10 hover:shadow-primary-500/20"
                                                        >
                                                            Update Stock
                                                        </button>
                                                    </div>
                                                    <div className="flex gap-3 mt-3">
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct({
                                                                    _id: product._id,
                                                                    name: product.name || '',
                                                                    category: product.category || '',
                                                                    price: product.price ?? 0,
                                                                    stock: product.stock ?? 0,
                                                                    dosage: product.dosage || '',
                                                                    requiresPrescription: !!product.requiresPrescription
                                                                });
                                                                setShowEditModal(true);
                                                            }}
                                                            className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Pencil className="w-4 h-4" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product._id, product.name)}
                                                            className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <div className="xl:col-span-2 glass p-10 rounded-[2rem] border border-slate-200 text-center">
                                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">No products found for this search.</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="border-4 border-dashed border-slate-200 rounded-[3.5rem] p-12 flex flex-col items-center justify-center gap-6 hover:border-primary-400 hover:bg-primary-50 transition-all text-slate-400 hover:text-primary-600 group"
                                        >
                                            <div className="w-20 h-20 rounded-[2rem] border-4 border-current flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                                                <Plus className="w-10 h-10" />
                                            </div>
                                            <span className="font-black text-sm uppercase tracking-[0.3em]">Materialize Node</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'users' && (
                                <motion.div
                                    key="users"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass rounded-[4rem] border-white/60 overflow-hidden shadow-2xl"
                                >
                                    <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/30">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">User Management</h3>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Manage application users and permissions</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={fetchData} className="p-4 bg-primary-600 text-white rounded-2xl transition-all shadow-xl shadow-primary-500/30">
                                                <RefreshCcw className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-900/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                <tr>
                                                    <th className="px-10 py-6">User ID</th>
                                                    <th className="px-10 py-6">Name</th>
                                                    <th className="px-10 py-6">Email</th>
                                                    <th className="px-10 py-6">Role</th>
                                                    <th className="px-10 py-6 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 font-bold">
                                                {users.map((u) => (
                                                    <tr key={u._id} className="hover:bg-white/50 transition-all group">
                                                        <td className="px-10 py-8 text-primary-600 text-sm font-black">#USR-{u._id.slice(-6).toUpperCase()}</td>
                                                        <td className="px-10 py-8">
                                                            <div className="font-black text-slate-900 leading-tight">{u.name || '—'}</div>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <div className="text-xs text-slate-400 italic lowercase tracking-tight">{u.email}</div>
                                                        </td>
                                                        <td className="px-10 py-8 font-black text-slate-900 text-lg">{u.role || 'user'}</td>
                                                        <td className="px-10 py-8 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <button onClick={() => handleToggleAdmin(u._id, u.role !== 'admin')} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all">
                                                                    {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                                                                </button>
                                                                <button onClick={() => handleDeleteUser(u._id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'analytics' && (
                                <motion.div
                                    key="analytics"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-10"
                                >
                                    <div className="glass p-12 rounded-[4rem] border-white/60">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-4 bg-primary-500 text-white rounded-[1.5rem] shadow-xl shadow-primary-500/30">
                                                <BarChart3 className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Neural Insights</h3>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Performance metrics across sub-networks</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h4 className="text-xs font-black text-slate-400 tracking-[0.4em] uppercase">Orders Analytics</h4>
                                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Revenue by {analyticsRange}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {['day', 'week', 'month', 'year'].map(r => (
                                                        <button key={r} onClick={() => setAnalyticsRange(r)} className={`px-3 py-2 text-xs font-black rounded-lg ${analyticsRange === r ? 'bg-slate-900 text-white' : 'bg-white/50 text-slate-700'}`}>
                                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Compute buckets and values */}
                                            {(() => {
                                                const { buckets, values } = aggregateOrders(orders, analyticsRange);
                                                const max = Math.max(...values, 1);
                                                const width = Math.max(600, buckets.length * 24);
                                                return (
                                                    <div className="space-y-6">
                                                        <div className="overflow-x-auto">
                                                            <svg viewBox={`0 0 ${width} 200`} className="w-full h-40">
                                                                <g transform="translate(20,10)">
                                                                    {values.map((v, i) => {
                                                                        const w = Math.max(6, (width - 40) / values.length - 8);
                                                                        const x = i * ((width - 40) / values.length) + 4;
                                                                        const h = (v / max) * 140;
                                                                        return (
                                                                            <g key={i}>
                                                                                <rect x={x} y={150 - h} width={w} height={h} rx={6} fill="#0f172a" opacity={0.9} />
                                                                                <text x={x + w / 2} y={167} fontSize="8" textAnchor="middle" fill="#475569">{buckets[i].label}</text>
                                                                            </g>
                                                                        );
                                                                    })}
                                                                </g>
                                                            </svg>
                                                        </div>

                                                        <div className="grid md:grid-cols-3 gap-4">
                                                            <div className="p-6 bg-white/50 rounded-2xl">
                                                                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Revenue</div>
                                                                <div className="text-2xl font-black text-slate-900">₹{values.reduce((a, b) => a + b, 0).toFixed(2)}</div>
                                                            </div>
                                                            <div className="p-6 bg-white/50 rounded-2xl">
                                                                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Peak Bucket</div>
                                                                <div className="text-2xl font-black text-slate-900">{buckets[values.indexOf(Math.max(...values))]?.label || '—'}</div>
                                                            </div>
                                                            <div className="p-6 bg-white/50 rounded-2xl">
                                                                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Buckets</div>
                                                                <div className="text-2xl font-black text-slate-900">{buckets.length}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl relative"
                        >
                            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>

                            <div className="p-12">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Materialize <span className="text-primary-600">Node</span></h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10 italic">Define new medical inventory parameters</p>

                                <form onSubmit={handleAddProduct} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Molecule Name</label>
                                            <input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" placeholder="e.g. Paxlovid" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Classification</label>
                                            <input required value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" placeholder="e.g. Antiviral" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Unit Price</label>
                                            <input required type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" placeholder="₹" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Initial Stock</label>
                                            <input required type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" placeholder="Qty" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dosage Profile</label>
                                            <input required value={newProduct.dosage} onChange={(e) => setNewProduct({ ...newProduct, dosage: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" placeholder="e.g. 500mg" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                                        <input
                                            type="checkbox"
                                            id="rx"
                                            className="w-6 h-6 accent-amber-500 cursor-pointer"
                                            checked={newProduct.requiresPrescription}
                                            onChange={(e) => setNewProduct({ ...newProduct, requiresPrescription: e.target.checked })}
                                        />
                                        <label htmlFor="rx" className="text-xs font-black text-amber-900 uppercase tracking-widest cursor-pointer">Restricted Substance (RX Required)</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-6 mt-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-primary-600 transition-all shadow-2xl"
                                    >
                                        Execute Materialization
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Product Modal */}
            <AnimatePresence>
                {showEditModal && editingProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl relative"
                        >
                            <button onClick={() => { setShowEditModal(false); setEditingProduct(null); }} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>

                            <div className="p-12">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Edit <span className="text-primary-600">Product</span></h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10 italic">Update product details and inventory</p>

                                <form onSubmit={handleEditProduct} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Molecule Name</label>
                                            <input required value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Classification</label>
                                            <input required value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Unit Price</label>
                                            <input required type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Stock</label>
                                            <input required type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dosage Profile</label>
                                            <input required value={editingProduct.dosage} onChange={(e) => setEditingProduct({ ...editingProduct, dosage: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 font-bold" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                                        <input
                                            type="checkbox"
                                            id="edit-rx"
                                            className="w-6 h-6 accent-amber-500 cursor-pointer"
                                            checked={editingProduct.requiresPrescription}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, requiresPrescription: e.target.checked })}
                                        />
                                        <label htmlFor="edit-rx" className="text-xs font-black text-amber-900 uppercase tracking-widest cursor-pointer">Restricted Substance (RX Required)</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-6 mt-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-primary-600 transition-all shadow-2xl"
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
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
        </div>
    );
};

export default AdminDashboard;
