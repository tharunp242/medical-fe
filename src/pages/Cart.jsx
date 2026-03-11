import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const totalINR = cartTotal;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
                <div className="w-32 h-32 bg-primary-50 rounded-[3rem] flex items-center justify-center mb-8">
                    <ShoppingBag className="w-12 h-12 text-primary-300" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your cart is empty</h2>
                <p className="text-slate-500 mb-10 font-bold">Add medicines from the store to continue.</p>
                <button onClick={() => navigate('/store')} className="btn-medical px-12">
                    Go to Store
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen mesh-bg py-24 px-6">
            <SEO title="Cart - MedShop" description="Review medicines in your cart before payment." />

            <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-8 space-y-4">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6">Your Cart</h2>

                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="glass p-6 rounded-[2.5rem] flex items-center justify-between border-white/40"
                        >
                            <div>
                                <h3 className="text-xl font-black text-slate-900 mb-1">{item.name}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                                <p className="text-lg font-black text-primary-600 mt-2">₹{item.price.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1">
                                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 hover:bg-white rounded-xl transition-all">
                                        <Minus className="w-4 h-4 text-slate-600" />
                                    </button>
                                    <span className="w-8 text-center font-black text-slate-900">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 hover:bg-white rounded-xl transition-all">
                                        <Plus className="w-4 h-4 text-slate-600" />
                                    </button>
                                </div>
                                <button onClick={() => removeFromCart(item._id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4 sticky top-28">
                    <div className="glass bg-slate-900 rounded-[3rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]">
                        <h3 className="text-2xl font-black text-white mb-8">Order Total</h3>
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Grand Total</span>
                            <span className="text-5xl font-black text-white tracking-tighter">₹{totalINR.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => navigate('/payment')}
                            className="w-full py-4 bg-white text-slate-900 rounded-full font-black text-lg hover:bg-primary-50 transition-all"
                        >
                            Continue to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
