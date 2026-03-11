import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hospital,
    Stethoscope,
    Calendar,
    Clock,
    MapPin,
    Star,
    ArrowRight,
    Search,
    ChevronRight,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const Appointments = () => {
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingStep, setBookingStep] = useState(1); // 1: Hospital, 2: Doctor, 3: Success

    const hospitals = [
        {
            id: 1,
            name: "Arctic General Hospital",
            location: "North Central, 1.2km",
            rating: 4.8,
            speciality: "Multi-Speciality",
            image: "https://images.unsplash.com/photo-1587350859728-117622bc937e?q=80&w=400",
            doctors: [
                { id: 101, name: "Dr. Sarah Mitchell", spec: "Cardiologist", exp: "12 yrs" },
                { id: 102, name: "Dr. James Wilson", spec: "Neurologist", exp: "15 yrs" }
            ]
        },
        {
            id: 2,
            name: "Neural Care Institute",
            location: "East Wing, 2.5km",
            rating: 4.9,
            speciality: "Neurological Science",
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400",
            doctors: [
                { id: 201, name: "Dr. Elena Frost", spec: "Neurosurgeon", exp: "20 yrs" },
                { id: 202, name: "Dr. Marcus Thorne", spec: "Psychiatrist", exp: "8 yrs" }
            ]
        },
        {
            id: 3,
            name: "Vanguard Children's Hub",
            location: "South District, 3.1km",
            rating: 4.7,
            speciality: "Pediatrics",
            image: "https://images.unsplash.com/photo-1538108197022-ed320986751c?q=80&w=400",
            doctors: [
                { id: 301, name: "Dr. Lily Chen", spec: "Pediatrician", exp: "10 yrs" }
            ]
        }
    ];

    const handleHospitalSelect = (hosp) => {
        setSelectedHospital(hosp);
        setBookingStep(2);
    };

    const handleDoctorSelect = (doc) => {
        setSelectedDoctor(doc);
        setTimeout(() => {
            setBookingStep(3);
            toast.success("Appointment Scheduled with " + doc.name);
        }, 1000);
    };

    return (
        <div className="min-h-screen mesh-bg py-24 px-6 relative overflow-hidden">
            <SEO
                title="Arctic Appointments - Nearby Hospitals"
                description="Book instant consultations with top-rated medical experts in your local area."
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Area */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-end gap-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-200">
                                    Instant Consultation
                                </div>
                                <Hospital className="w-4 h-4 text-primary-500" />
                            </div>
                            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                                Find Local <span className="text-gradient-primary">Experts.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-bold tracking-tight">Access verified top-tier healthcare facilities within your vicinity.</p>
                        </div>

                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                className="w-full pl-16 pr-6 py-5 bg-white rounded-[2rem] border border-slate-100 shadow-xl focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-bold"
                                placeholder="Search hospitals or specialized doctors..."
                            />
                        </div>
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {bookingStep === 1 && (
                        <motion.div
                            key="hospitals"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="grid lg:grid-cols-3 gap-10"
                        >
                            {hospitals.map((hosp, i) => (
                                <motion.div
                                    key={hosp.id}
                                    whileHover={{ y: -15, scale: 1.02 }}
                                    className="glass-card rounded-[3.5rem] overflow-hidden group cursor-pointer"
                                    onClick={() => handleHospitalSelect(hosp)}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img src={hosp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={hosp.name} />
                                        <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-black text-slate-900">{hosp.rating}</span>
                                        </div>
                                    </div>
                                    <div className="p-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{hosp.name}</h3>
                                            <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                                                <Hospital className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8">
                                            <MapPin className="w-4 h-4" /> {hosp.location}
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{hosp.speciality}</div>
                                            <ChevronRight className="text-primary-600" />
                                        </div>
                                        <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black group-hover:bg-primary-600 transition-all uppercase tracking-widest text-xs">
                                            View Doctors
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {bookingStep === 2 && (
                        <motion.div
                            key="doctors"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="max-w-4xl mx-auto"
                        >
                            <button
                                onClick={() => setBookingStep(1)}
                                className="mb-10 flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-primary-600 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Hospitals
                            </button>

                            <div className="glass p-12 rounded-[4rem] border-white/60 mb-10">
                                <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter">Available Experts at <span className="text-primary-600">{selectedHospital.name}</span></h3>
                                <div className="space-y-6">
                                    {selectedHospital.doctors.map((doc) => (
                                        <motion.div
                                            key={doc.id}
                                            whileHover={{ x: 10 }}
                                            onClick={() => handleDoctorSelect(doc)}
                                            className="p-8 bg-white/40 hover:bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-xl"
                                        >
                                            <div className="flex items-center gap-8">
                                                <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                                                    <Stethoscope className="w-10 h-10" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-slate-900 mb-1">{doc.name}</h4>
                                                    <p className="text-sm font-bold text-primary-500 uppercase tracking-widest">{doc.spec}</p>
                                                    <div className="flex gap-4 mt-2">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{doc.exp} EXP</span>
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md italic">Available Now</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-900 text-white rounded-2xl group-hover:bg-primary-600 transition-all shadow-lg">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {bookingStep === 3 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto py-20"
                        >
                            <div className="glass p-16 rounded-[4rem] text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-6">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter line-height-none">Spot Secured!</h2>
                                <p className="text-lg text-slate-500 font-bold mb-12 italic opacity-80 leading-relaxed">Your neural reservation has been synchronized with <span className="text-primary-600">{selectedHospital.name}</span>. The receptionist is awaiting your arrival.</p>
                                <div className="space-y-4 mb-12 text-left bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultant</span>
                                        <span className="text-sm font-black text-slate-900">{selectedDoctor.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</span>
                                        <span className="text-sm font-black text-primary-600">Today • 2:30 PM - 3:15 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</span>
                                        <span className="text-sm font-black text-slate-900">ANK-982-PL</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setBookingStep(1)}
                                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                                >
                                    Dismiss Portal
                                </button>
                                <div className="mt-8 flex justify-center items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                    <ShieldCheck className="w-4 h-4" /> HIPAA Compliant Connection
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Appointments;
