import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, FileText, CheckCircle2, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Prescription = () => {
    const [filePreview, setFilePreview] = useState(null);
    const { addToCart, setPrescriptionVerified } = useCart();
    const [analyzing, setAnalyzing] = useState(false);

    const [results, setResults] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFilePreview(URL.createObjectURL(uploadedFile));
            startAnalysis(uploadedFile);
        }
    };

    const startAnalysis = async (uploadedFile) => {
        setAnalyzing(true);
        try {
            const {
                data: { text: extractedText }
            } = await Tesseract.recognize(uploadedFile, 'eng');

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/analyze-prescription`, {
                text: extractedText || ''
            });

            setTimeout(() => {
                setResults(response.data);
                setAnalyzing(false);
            }, 3000);
        } catch (error) {
            console.error('Analysis failed', error);
            toast.error('Failed to analyze prescription. Please try again.');
            setAnalyzing(false);
        }
    };

    const handleOrder = () => {
        if (!user) {
            toast.error('Please login to process prescription');
            navigate('/login');
            return;
        }

        results.detectedMedicines.forEach(med => {
            // Mapping from prescription format to product format
            addToCart({
                _id: med.productId || "64f1a2b3c4d5e6f7a8b9c0d1",
                name: med.name,
                price: med.price || 15,
                category: med.category || 'Prescription',
                dosage: med.dosage,
                requiresPrescription: med.requiresPrescription ?? true
            });
        });

        setPrescriptionVerified(true);
        toast.success(`Verified! Added ${results.detectedMedicines.length} medicines to cart!`);
        navigate('/order-summary');
    };




    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SEO
                title="Prescription Analysis - MedShop"
                description="Upload your prescription and let our AI-powered system identify and add medicines to your order instantly and accurately."
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Prescription Analysis</h2>
                <p className="text-slate-600">Upload your prescription and let our AI handle the rest with precision.</p>
            </motion.div>

            {!filePreview && !analyzing && (
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="relative h-[400px] border-2 border-dashed border-slate-300 rounded-[2.5rem] bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                >
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={handleUpload}
                        accept="image/*"
                    />
                    <div className="bg-primary-50 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Upload className="text-primary-600 w-12 h-12" />
                    </div>
                    <p className="text-xl font-bold text-slate-800 mb-2">Drag and drop or click to upload</p>
                    <p className="text-slate-500">Supports JPG, PNG, PDF up to 10MB</p>
                </motion.div>
            )}

            {filePreview && analyzing && (
                <div className="relative h-[500px] glass rounded-[2.5rem] flex flex-col items-center justify-center p-8">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent pointer-events-none"
                        animate={{ height: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                    <img src={filePreview} alt="Preview" className="w-48 h-48 object-cover rounded-2xl mb-8 opacity-40 grayscale shadow-2xl" />
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                    <h3 className="text-2xl font-bold text-slate-800 animate-pulse">Analyzing Medical Record...</h3>
                    <p className="text-slate-500 mt-2">Identifying medicines and dosages</p>

                    <div className="mt-12 flex gap-4">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="bg-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold text-primary-700 flex items-center gap-2"
                        >
                            <Sparkles className="w-3 h-3" /> Scanning OCR
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                            className="bg-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold text-primary-700 flex items-center gap-2"
                        >
                            <FileText className="w-3 h-3" /> Parsing Metadata
                        </motion.div>
                    </div>
                </div>
            )}

            {results && !analyzing && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-[2.5rem] overflow-hidden"
                >
                    <div className="bg-primary-600 p-8 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6" /> Analysis Complete
                            </h3>
                            <p className="opacity-90">We detected {results.detectedMedicines.length} medicines in your prescription.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium uppercase tracking-wider opacity-70">Confidence Score</span>
                            <div className="text-3xl font-black">{(results.confidence * 100).toFixed(0)}%</div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h4 className="text-xl font-bold text-slate-800 mb-6">Detected Medicines</h4>
                        <div className="grid gap-4">
                            {results.detectedMedicines.map((med, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center"
                                >
                                    <div>
                                        <span className="font-bold text-lg text-slate-800">{med.name}</span>
                                        <div className="flex gap-3 mt-1">
                                            <span className="text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-md font-medium">{med.dosage}</span>
                                            <span className="text-sm bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">{med.frequency}</span>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="text-green-500 w-6 h-6" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end gap-4">
                            <button onClick={() => { setFilePreview(null); setResults(null) }} className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-full transition-colors">
                                Retake
                            </button>
                            <button onClick={handleOrder} className="btn-primary">
                                Add to Cart & Order <ShoppingBag className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Prescription;
