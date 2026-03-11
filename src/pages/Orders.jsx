import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Truck, CreditCard, MapPin, Calendar, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (user?.email) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user?.email) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders?email=${user.email}`);
            setOrders(response.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return <CheckCircle className="w-5 h-5 text-primary-500" />;
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-blue-500" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-amber-500" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Package className="w-5 h-5 text-slate-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-primary-50 text-primary-700 border-primary-200';
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'shipped':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'processing':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-emerald-50 text-emerald-700';
            case 'pending':
                return 'bg-amber-50 text-amber-700';
            case 'failed':
                return 'bg-red-50 text-red-700';
            default:
                return 'bg-slate-50 text-slate-700';
        }
    };

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

    if (loading) {
        return (
            <div className="min-h-screen mesh-bg flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
                    />
                    <p className="text-slate-600 font-bold">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mesh-bg py-24 px-6">
            <SEO title="My Orders - MedShop" description="View your order history and track deliveries." />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                        My <span className="text-gradient-primary">Orders</span>
                    </h1>
                    <p className="text-slate-600 font-bold">Track and manage your medical orders</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
                                filter === status
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-[3rem] p-16 text-center"
                    >
                        <div className="w-32 h-32 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-16 h-16 text-primary-300" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4">No orders found</h3>
                        <p className="text-slate-600 font-bold mb-8">
                            {filter === 'all' 
                                ? "You haven't placed any orders yet" 
                                : `No ${filter} orders found`}
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-[3rem] p-8 hover:shadow-2xl transition-all duration-500"
                            >
                                {/* Order Header */}
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-slate-900">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </h3>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.status)} border font-bold text-xs uppercase tracking-widest`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-3xl font-black text-slate-900">₹{order.totalAmount.toFixed(2)}</p>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getPaymentStatusColor(order.paymentStatus)} text-xs font-black uppercase tracking-wide mt-2`}>
                                            <CreditCard className="w-3 h-3" />
                                            {order.paymentStatus}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Items Ordered</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900">{item.productId?.name || 'Product'}</p>
                                                        <p className="text-xs font-bold text-slate-500">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-black text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="flex items-start gap-3 p-5 bg-primary-50/50 rounded-2xl">
                                    <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Delivery Address</p>
                                        <p className="font-bold text-slate-900">{order.customerName}</p>
                                        <p className="text-sm text-slate-600 font-medium">{order.address}</p>
                                        <p className="text-sm text-slate-600 font-medium">{order.phone}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
