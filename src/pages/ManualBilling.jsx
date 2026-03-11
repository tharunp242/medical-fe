import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Printer, User, Calendar, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const ManualBilling = () => {
    const [customerName, setCustomerName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([
        { id: 1, name: '', quantity: 1, price: 0 }
    ]);

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        } else {
            toast.error("At least one item is required");
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const handlePrint = () => {
        if (!customerName) {
            toast.error("Please enter customer name");
            return;
        }
        window.print();
    };

    return (
        <div className="min-h-screen mesh-bg py-24 px-6 relative overflow-hidden">
            <SEO
                title="Bill Calculator - Premium Pharmacy Billing"
                description="Professional manual billing calculator for pharmacy sales. Generate and print instant medical invoices."
            />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center no-print"
                >
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                        Pharmacy <span className="text-gradient-primary">Calculator</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-bold tracking-tight">Generate premium instant invoices with ease.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-[3rem] p-1 shadow-2xl overflow-hidden border border-white/40"
                >
                    <div className="bg-white/40 backdrop-blur-2xl p-10 lg:p-14">
                        {/* Input Area (Hidden on Print) */}
                        <div className="no-print space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <User className="w-3.5 h-3.5" /> Customer Name
                                    </label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full px-6 py-4 bg-white/50 border border-white rounded-2xl focus:ring-4 focus:ring-primary-400/20 focus:outline-none transition-all font-bold text-slate-800"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <Calendar className="w-3.5 h-3.5" /> Billing Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-6 py-4 bg-white/50 border border-white rounded-2xl focus:ring-4 focus:ring-primary-400/20 focus:outline-none transition-all font-bold text-slate-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                        <ClipboardList className="w-6 h-6 text-primary-500" />
                                        Invoice Items
                                    </h3>
                                    <button
                                        onClick={addItem}
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all text-sm shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" /> Add Item
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {items.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="grid grid-cols-12 gap-4 p-4 bg-white/30 rounded-[1.5rem] border border-white group"
                                            >
                                                <div className="col-span-12 md:col-span-5">
                                                    <input
                                                        placeholder="Medicine Name"
                                                        value={item.name}
                                                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white/50 border border-white rounded-xl focus:outline-none font-bold text-slate-700"
                                                    />
                                                </div>
                                                <div className="col-span-4 md:col-span-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                        className="w-full px-4 py-3 bg-white/50 border border-white rounded-xl focus:outline-none font-bold text-slate-700 text-center"
                                                    />
                                                </div>
                                                <div className="col-span-5 md:col-span-3">
                                                    <input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-4 py-3 bg-white/50 border border-white rounded-xl focus:outline-none font-bold text-slate-700 text-right"
                                                    />
                                                </div>
                                                <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/60 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="text-center md:text-left">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Estimated Total</p>
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter">₹{calculateTotal().toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn-medical w-full md:w-auto shadow-primary-500/30"
                                >
                                    <Printer className="w-6 h-6" /> Generate & Print Bill
                                </button>
                            </div>
                        </div>

                        {/* Printable Invoice Section (Visible only on print) */}
                        <div className="print-only hidden p-10 bg-white">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 mb-2">MEDSHOP</h1>
                                    <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Premium Medical Solutions</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-xl font-black text-slate-900 mb-1">TAX INVOICE</h2>
                                    <p className="text-slate-500 font-bold">#{Math.floor(Date.now() / 1000)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10 mb-16 pb-10 border-b-2 border-slate-100">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer Details</p>
                                    <p className="text-xl font-black text-slate-800">{customerName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date of Issue</p>
                                    <p className="text-xl font-black text-slate-800">{new Date(date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <table className="w-full mb-16">
                                <thead>
                                    <tr className="border-b-2 border-slate-900">
                                        <th className="py-4 text-left font-black text-slate-900 uppercase text-xs tracking-widest">Description</th>
                                        <th className="py-4 text-center font-black text-slate-900 uppercase text-xs tracking-widest">Qty</th>
                                        <th className="py-4 text-right font-black text-slate-900 uppercase text-xs tracking-widest">Price</th>
                                        <th className="py-4 text-right font-black text-slate-900 uppercase text-xs tracking-widest">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-100">
                                            <td className="py-6 font-bold text-slate-700">{item.name || 'Medicine Item'}</td>
                                            <td className="py-6 text-center font-bold text-slate-700">{item.quantity}</td>
                                            <td className="py-6 text-right font-bold text-slate-700">₹{parseFloat(item.price).toFixed(2)}</td>
                                            <td className="py-6 text-right font-black text-slate-900">₹{(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end pt-10 border-t-4 border-slate-900">
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Grand Total</p>
                                    <p className="text-5xl font-black text-slate-900">₹{calculateTotal().toFixed(2)}</p>
                                    <p className="text-[10px] font-black text-slate-500 mt-4 tracking-widest opacity-50 uppercase">Certified & Verified Medical Transaction</p>
                                </div>
                            </div>

                            <div className="mt-32 text-center">
                                <div className="inline-block p-10 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <p className="text-lg font-black text-slate-900 mb-2 italic">"Thank you for choosing MedShop for your healthcare needs."</p>
                                    <p className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">Healthy Life • Happy Life</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .mesh-bg { background: white !important; }
                    nav { display: none !important; }
                    main { padding-top: 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default ManualBilling;
