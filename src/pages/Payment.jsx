import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ShieldCheck, Truck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

const Payment = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, cartTotal, clearCart, prescriptionVerified } = useCart();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: ''
    });
    const [phoneError, setPhoneError] = useState('');

    const validatePhone = (phone) => {
        if (!phone) return false;
        const cleaned = phone.replace(/\s|-/g, '');
        // Accept formats: 10 digits starting with 6-9, optional +91 or 91 prefix
        const re = /^(?:\+91|91)?[6-9]\d{9}$/;
        return re.test(cleaned);
    };

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

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">No items to pay for</h2>
                <p className="text-slate-500 mb-10 font-bold">Add items to cart first.</p>
                <button onClick={() => navigate('/store')} className="btn-medical px-12">
                    Go to Store
                </button>
            </div>
        );
    }

    const placeOrder = async (razorpayDetails = null) => {
        if (!canCheckout) {
            toast.error('Prescription verification required for some items');
            return;
        }

        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            toast.error('Please fill all delivery details');
            return;
        }

        if (!validatePhone(formData.phone)) {
            toast.error('Please enter a valid phone number');
            return;
        }

        try {
            const orderData = {
                customerName: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                items: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalINR,
                paymentStatus: razorpayDetails ? 'Paid' : 'Pending',
                razorpayOrderId: razorpayDetails?.razorpay_order_id,
                razorpayPaymentId: razorpayDetails?.razorpay_payment_id,
                razorpaySignature: razorpayDetails?.razorpay_signature
            };

            await axios.post('http://localhost:5000/api/orders', orderData);
            clearCart();
            toast.success('Order placed successfully');
            navigate('/');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to process order');
        }
    };

    const handleRazorpayPayment = async () => {
        if (!canCheckout) {
            toast.error('Prescription verification required for some items');
            return;
        }

        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            toast.error('Please fill all delivery details');
            return;
        }

        if (!validatePhone(formData.phone)) {
            toast.error('Please enter a valid phone number');
            return;
        }

        try {
            // Create Razorpay order
            const { data: order } = await axios.post('http://localhost:5000/api/razorpay/create-order', {
                amount: totalINR,
                currency: 'INR'
            });

            const options = {
                key: 'rzp_test_SJrQ3uU4puTMrI',
                amount: order.amount,
                currency: order.currency,
                name: 'MedShop',
                description: `Order for ${cartItems.length} items`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // Verify payment
                        await axios.post('http://localhost:5000/api/razorpay/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // Place order
                        await placeOrder(response);
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

    return (
        <div className="min-h-screen mesh-bg py-24 px-6">
            <SEO title="Payment - MedShop" description="Secure payment and order placement for your medicines." />

            <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7 glass p-10 rounded-[3rem]">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Delivery & Payment</h2>

                    <div className="space-y-5">
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-white/50 border border-white rounded-[1.2rem] focus:outline-none font-bold" placeholder="Recipient Name" />
                        <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 bg-white/50 border border-white rounded-[1.2rem] focus:outline-none font-bold" placeholder="Email" />
                        <input
                            value={formData.phone}
                            onChange={(e) => {
                                const v = e.target.value;
                                setFormData({ ...formData, phone: v });
                                if (v === '') {
                                    setPhoneError('');
                                } else if (!validatePhone(v)) {
                                    setPhoneError('Enter a valid 10-digit Indian mobile number');
                                } else {
                                    setPhoneError('');
                                }
                            }}
                            aria-invalid={!!phoneError}
                            className={`w-full px-6 py-4 bg-white/50 rounded-[1.2rem] focus:outline-none font-bold border ${phoneError ? 'border-red-500' : 'border-white'}`}
                            placeholder="Phone"
                        />
                        {phoneError && <p className="text-sm font-bold text-red-600 mt-2">{phoneError}</p>}
                        <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-6 py-4 bg-white/50 border border-white rounded-[1.2rem] focus:outline-none font-bold" rows="3" placeholder="Address" />
                    </div>

                    {!canCheckout && (
                        <div className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm font-bold text-red-700">
                            Prescription verification is required for restricted medicines.
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 sticky top-28">
                    <div className="glass bg-slate-900 rounded-[3rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]">
                        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                            <CreditCard className="text-primary-400" /> Payment
                        </h3>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                <span>Items</span>
                                <span className="text-white text-base">{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                <span>Grand Total</span>
                                <span className="text-white text-3xl font-black">₹{totalINR.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleRazorpayPayment}
                                disabled={!canCheckout}
                                className="w-full py-4 bg-primary-600 text-white rounded-full font-black text-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Pay with Razorpay
                            </button>

                            <button
                                onClick={() => placeOrder()}
                                className="w-full py-4 bg-white text-slate-900 rounded-full font-black text-lg hover:bg-primary-50 transition-all"
                            >
                                Cash on Delivery
                            </button>
                        </div>

                        <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                            <Truck className="text-primary-400" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</p>
                                <p className="text-white font-black tracking-tight">Today • 35-50 mins</p>
                            </div>
                        </div>

                        <div className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
