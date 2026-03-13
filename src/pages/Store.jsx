import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Filter, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Store = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryFilter = queryParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'All Products');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
                setProducts(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        setSelectedCategory(categoryFilter || 'All Products');
    }, [categoryFilter]);

    const categoryOptions = ['All Products', ...new Set(products.map((product) => product.category).filter(Boolean))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All Products' ? true : product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (product) => {
        if (!user) {
            toast.error('Please login to order products');
            navigate('/login');
            return;
        }
        addToCart(product);
        toast.success(`${product.name} added to cart!`, {
            icon: '🛒',
            style: {
                borderRadius: '1rem',
                background: '#16a34a',
                color: '#fff',
                fontWeight: 'bold'
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <SEO
                title="Online Pharmacy Store - MΞDSHOP"
                description="Browse and buy medicines online from our verified stock. Genuine products across multiple categories with fast delivery."
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        {categoryFilter && (
                            <button onClick={() => navigate('/store')} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all group">
                                <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-900" />
                            </button>
                        )}
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            {selectedCategory === 'All Products' ? 'Our' : selectedCategory} <span className="text-primary-600">Products</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-bold italic opacity-80">
                        {selectedCategory === 'All Products' ? 'Explore all products in Sri Durga Medicals.' : `Viewing ${selectedCategory} products.`}
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-600 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-bold placeholder:text-slate-300"
                            placeholder="Search molecule identity..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
                {categoryOptions.map((category) => (
                    <button
                        key={category}
                        onClick={() => {
                            setSelectedCategory(category);
                            navigate(category === 'All Products' ? '/store' : `/store?category=${encodeURIComponent(category)}`);
                        }}
                        className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                            selectedCategory === category
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-32">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Synchronizing Inventory...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -12 }}
                                className="glass p-2 rounded-[3.5rem] border-white/60 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all overflow-hidden group"
                            >
                                <div className="p-8 pb-10">
                                    <div className="mb-6">
                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-slate-200">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2">{product.name}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.dosage || 'Standard Unit'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">₹{product.price}</p>
                                        </div>
                                    </div>

                                    {product.requiresPrescription && (
                                        <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest italic leading-none">Protocol RX Req</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black tracking-[0.1em] text-[11px] uppercase shadow-2xl hover:bg-primary-600 hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-3 group/btn"
                                    >
                                        Authorize Purchase <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredProducts.length === 0 && (
                        <div className="col-span-full py-32 text-center">
                            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.2em]">No Molecule Identified</h3>
                            <p className="text-slate-400 font-bold mt-2">Adjust your neural filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Store;
