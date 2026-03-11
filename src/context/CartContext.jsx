import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [prescriptionVerified, setPrescriptionVerified] = useState(false);
    const [serverCartReady, setServerCartReady] = useState(false);
    const { user } = useAuth();
    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        const storedCart = localStorage.getItem('medshop_cart');
        const storedVerify = localStorage.getItem('medshop_pres_verified');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        if (storedVerify === 'true') {
            setPrescriptionVerified(true);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('medshop_cart', JSON.stringify(cartItems));
        localStorage.setItem('medshop_pres_verified', prescriptionVerified.toString());
    }, [cartItems, prescriptionVerified]);

    useEffect(() => {
        const loadServerCart = async () => {
            if (!user?.email) {
                setServerCartReady(true);
                return;
            }
            try {
                const response = await axios.get(`${API_BASE}/cart`, {
                    params: { email: user.email }
                });

                const serverItems = (response.data?.items || []).map((item) => ({
                    _id: item.productId,
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    image: item.image,
                    dosage: item.dosage,
                    requiresPrescription: item.requiresPrescription,
                    quantity: item.quantity
                }));

                setCartItems(serverItems);
            } catch (error) {
                console.error('Failed to load server cart', error);
            } finally {
                setServerCartReady(true);
            }
        };

        setServerCartReady(false);
        loadServerCart();
    }, [user?.email]);

    useEffect(() => {
        const syncServerCart = async () => {
            if (!user?.email || !serverCartReady) return;
            try {
                await axios.put(`${API_BASE}/cart`, {
                    email: user.email,
                    items: cartItems.map((item) => ({
                        productId: item._id,
                        quantity: item.quantity || 1
                    }))
                });
            } catch (error) {
                console.error('Failed to sync server cart', error);
            }
        };

        syncServerCart();
    }, [cartItems, user?.email, serverCartReady]);


    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev => prev.map(item =>
            item._id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);

        if (user?.email) {
            axios.delete(`${API_BASE}/cart`, { params: { email: user.email } })
                .catch((error) => console.error('Failed to clear server cart', error));
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            prescriptionVerified,
            setPrescriptionVerified
        }}>

            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
