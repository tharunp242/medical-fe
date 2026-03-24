import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, MapPin, Truck, CheckCircle, Package, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const SERVICEABLE_ERODE_AREAS = [
    'erode',
    'perundurai',
    'bhavani',
    'gobichettipalayam',
    'sathyamangalam',
    'anthiyur',
    'chennimalai',
    'modakurichi',
    'kodumudi'
];

const isServiceableErodeAddress = (address = '') => {
    const normalizedAddress = String(address).toLowerCase();
    return SERVICEABLE_ERODE_AREAS.some((area) => normalizedAddress.includes(area));
};

const OrderSummary = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart, prescriptionVerified } = useCart();
    const totalINR = cartTotal;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const needsPrescription = cartItems.some(item => item.requiresPrescription);
    const canCheckout = !needsPrescription || prescriptionVerified;

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    const [ordered, setOrdered] = useState(false);

    const handleOrderSubmit = async (razorpayDetails = null) => {
        if (!canCheckout) {
            toast.error('Prescription verification required for some items');
            return;
        }

        if (!formData.phone || !formData.address) {
            toast.error('Please complete address and phone details');
            return;
        }

        if (!isServiceableErodeAddress(formData.address)) {
            toast.error('Delivery is available only in Erode district and surrounding areas');
            return;
        }

        try {
            const orderData = {
                customerName: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                items: cartItems.map(item => ({
                    productId: item._id || "64f1a2b3c4d5e6f7a8b9c0d1",
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalINR,
                paymentStatus: razorpayDetails ? 'Paid' : 'Pending',
                razorpayOrderId: razorpayDetails?.razorpay_order_id,
                razorpayPaymentId: razorpayDetails?.razorpay_payment_id,
                razorpaySignature: razorpayDetails?.razorpay_signature
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData);
            setOrdered(true);
            clearCart();
            toast.success('Medical order confirmed!');
        } catch (err) {
            console.error('Order failed', err);
            toast.error('Failed to process order');
        }
    };

    const handleRazorpayPayment = async () => {
        if (!canCheckout) {
            toast.error('Prescription verification required for some items');
            return;
        }

        if (!formData.phone || !formData.address) {
            toast.error('Please complete address and phone details');
            return;
        }

        if (!isServiceableErodeAddress(formData.address)) {
            toast.error('Delivery is available only in Erode district and surrounding areas');
            return;
        }

        try {
            // Create Razorpay order
            const { data: order } = await axios.post(`${import.meta.env.VITE_API_URL}/api/razorpay/create-order`, {
                amount: totalINR,
                currency: 'INR'
            });

            const options = {
                key: 'rzp_test_SJrQ3uU4puTMrI',
                amount: order.amount,
                currency: order.currency,
                name: 'MedShop',
                description: `Order for ${cartItems.length} medical items`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // Verify payment
                        await axios.post(`${import.meta.env.VITE_API_URL}/api/razorpay/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // Place order
                        await handleOrderSubmit(response);
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: '#3b82f6'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            toast.error('Failed to initiate payment');
        }
    };


    if (cartItems.length === 0 && !ordered) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
                <div className="w-32 h-32 bg-primary-50 rounded-[3rem] flex items-center justify-center mb-8">
                    <ShoppingBag className="w-12 h-12 text-primary-300" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your cart is empty</h2>
                <p className="text-slate-500 mb-10 font-bold">Add some medicines to start your health journey.</p>
                <button onClick={() => navigate('/store')} className="btn-medical px-12">
                    Start Shopping
                </button>
            </div>
        );
    }

    if (ordered) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass p-16 rounded-[4rem] shadow-2xl text-center border-white/60 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="bg-emerald-500 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/40 rotate-12">
                        <CheckCircle className="text-white w-12 h-12" />
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Order Verified!</h2>
                    <p className="text-lg text-slate-600 mb-12 font-bold leading-relaxed">Your medical package is being prepared in our Arctic-controlled facility. Delivery expected in 45 minutes.</p>
                    <button onClick={() => navigate('/')} className="btn-primary w-full shadow-xl">
                        Back to Portal
                    </button>
                    <div className="mt-8 flex justify-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest items-center">
                        <ShieldCheck className="w-4 h-4" /> Secure Arctic Processing
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mesh-bg py-24 px-6 overflow-x-hidden">
            <SEO title="Checkout - Premium Arctic MedShop" description="Finalize your medical order with secure payment and cold-chain delivery tracking." />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
                {/* Cart Items Column */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Medical <span className="text-gradient-primary">Cart</span></h2>
                        <span className="px-5 py-2 bg-slate-100 rounded-full text-xs font-black text-slate-900 uppercase tracking-widest">{cartItems.length} Items Selected</span>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass p-6 rounded-[2.5rem] flex items-center justify-between border-white/40 group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-8">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 mb-1">{item.name}</h3>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                                            <p className="text-lg font-black text-primary-600 mt-2">₹{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 hover:bg-white rounded-xl transition-all"><Minus className="w-4 h-4 text-slate-600" /></button>
                                            <span className="w-8 text-center font-black text-slate-900">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 hover:bg-white rounded-xl transition-all"><Plus className="w-4 h-4 text-slate-600" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="p-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="glass p-12 rounded-[4rem] space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Delivery Intelligence</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Recipient Name</label>
                                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-white/50 border border-white rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-bold" placeholder="e.g. John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Mobile Access</label>
                                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 bg-white/50 border border-white rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-bold" placeholder="+91 XXXX XXXX" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Precise Address</label>
                            <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-6 py-4 bg-white/50 border border-white rounded-[1.5rem] focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-bold" rows="3" placeholder="Apartment, Street, Landmark..." />
                            <p className="text-xs font-bold text-slate-500">Delivery available only in Erode district and surrounding areas.</p>
                            {!!formData.address && !isServiceableErodeAddress(formData.address) && (
                                <p className="text-sm font-bold text-red-600">This address is outside our Erode delivery zone.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Checkout Column */}
                <div className="lg:col-span-5 sticky top-32">
                    <div className="glass bg-slate-900 rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                            <CreditCard className="text-primary-400" /> Neural Checkout
                        </h3>

                        <div className="space-y-6 mb-12">
                            <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                <span>Subtotal</span>
                                <span className="text-white text-lg">₹{totalINR.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                <span>Cold-Chain Delivery</span>
                                <span className="text-emerald-400 text-lg">SECURED (FREE)</span>
                            </div>
                            <div className="h-[1px] bg-white/10 my-4"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[12px] mb-2">Grand Total</span>
                                <span className="text-6xl font-black text-white tracking-tighter leading-none">₹{totalINR.toFixed(2)}</span>
                            </div>
                        </div>

                        {!formData.phone || !formData.address ? (
                            <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 text-primary-200 text-sm font-bold flex items-center gap-4 italic opacity-80">
                                <MapPin className="w-6 h-6 shrink-0" /> Support: Complete address & phone to activate biometric payment.
                            </div>
                        ) : !canCheckout ? (
                            <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] text-center space-y-6">
                                <FileText className="w-12 h-12 text-red-400 mx-auto" />
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black text-white">Prescription Required</h4>
                                    <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-widest">Your cart contains restricted medical items. Please upload a verified prescription to proceed.</p>
                                </div>
                                <button
                                    onClick={() => navigate('/prescription')}
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                                >
                                    Verify Now
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <button
                                    onClick={handleRazorpayPayment}
                                    disabled={!canCheckout}
                                    className="w-full py-6 bg-primary-600 text-white rounded-full font-black text-lg hover:bg-primary-700 active:scale-95 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Pay with Razorpay
                                </button>
                                <button
                                    onClick={() => handleOrderSubmit()}
                                    className="w-full py-6 bg-white text-slate-900 rounded-full font-black text-lg hover:bg-primary-50 active:scale-95 transition-all shadow-2xl"
                                >
                                    Proceed with Cash
                                </button>
                            </div>
                        )}


                        <div className="mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Truck className="text-primary-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Arrival</p>
                                <p className="text-white font-black tracking-tight">Today • 35-50 Mins</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
