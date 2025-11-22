import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { AuthState, Cart, CartItem, Product, UserInfo, View } from '../types.ts';
import { api } from '../services/api.ts';

interface AppContextType {
    auth: AuthState;
    login: (phone: string, name: string) => void;
    logout: () => void;
    initializeAuth: () => void;
    
    cart: Cart;
    addToCart: (productId: number, product: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, newQuantity: number, product?: Product) => void;
    clearCart: () => void;
    cartCount: number;
    cartSubtotal: number;

    theme: 'light' | 'dark';
    toggleTheme: () => void;

    view: View;
    setView: (view: View) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, loading: true, userIdentifier: null, role: null, userInfo: null });
    const [cart, setCart] = useState<Cart>({});
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('kioscoTheme') as 'light' | 'dark') || 'light');
    const [view, setView] = useState<View>({ type: 'CATALOG' });

    const initializeAuth = useCallback(() => {
        setAuth(prev => ({ ...prev, loading: true }));
        const userIdentifier = localStorage.getItem('kioscoUserIdentifier');
        const role = localStorage.getItem('kioscoUserRole') as 'cliente' | null;
        const userInfoStr = localStorage.getItem('kioscoClientInfo');
        let userInfo = null;

        if (userInfoStr) {
            try {
                userInfo = JSON.parse(userInfoStr);
            } catch (error) {
                console.error("Failed to parse user info from localStorage:", error);
                localStorage.removeItem('kioscoClientInfo'); // Clear corrupted data
            }
        }
        
        if (userIdentifier && role === 'cliente') {
            setAuth({ isAuthenticated: true, loading: false, userIdentifier, role, userInfo });
            setView({ type: 'CATALOG' });
        } else {
            setAuth({ isAuthenticated: false, loading: false, userIdentifier: null, role: null, userInfo: null });
        }
    }, []);

    const login = (phone: string, name: string) => {
        const userInfo = { name, phone };
        localStorage.setItem('kioscoUserIdentifier', phone);
        localStorage.setItem('kioscoUserRole', 'cliente');
        localStorage.setItem('kioscoClientInfo', JSON.stringify(userInfo));
        setAuth({ isAuthenticated: true, loading: false, userIdentifier: phone, role: 'cliente', userInfo });
        setView({ type: 'CATALOG' });
    };

    const logout = () => {
        localStorage.removeItem('kioscoUserIdentifier');
        localStorage.removeItem('kioscoUserRole');
        localStorage.removeItem('kioscoClientInfo');
        setAuth({ isAuthenticated: false, loading: false, userIdentifier: null, role: null, userInfo: null });
        setView({ type: 'CATALOG' });
    };

    const addToCart = (productId: number, product: Omit<CartItem, 'quantity'>) => {
        setCart(prev => ({
            ...prev,
            [productId]: { ...product, quantity: (prev[productId]?.quantity || 0) + 1 }
        }));
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[productId]) {
                if (newCart[productId].quantity > 1) {
                    newCart[productId].quantity -= 1;
                } else {
                    delete newCart[productId];
                }
            }
            return newCart;
        });
    };

    const updateQuantity = (productId: number, newQuantity: number, product?: Product) => {
        if (newQuantity <= 0) {
            setCart(prev => {
                const newCart = { ...prev };
                delete newCart[productId];
                return newCart;
            });
        } else {
            setCart(prev => {
                const existingItem = prev[productId];
                // Item exists, just update quantity.
                if (existingItem) {
                    return { ...prev, [productId]: { ...existingItem, quantity: newQuantity } };
                }
                // Item does not exist, add it using the provided product data.
                if (product) {
                    return { ...prev, [productId]: { ...product, quantity: newQuantity } };
                }
                // Should not happen if called correctly from UI, but a safeguard.
                console.error("Attempted to add new product to cart without providing product details.");
                return prev;
            });
        }
    };
    
    const clearCart = () => setCart({});

    // FIX: Cast `item` to `CartItem` to access its properties, as `Object.values` can return `unknown[]`.
    const cartCount = useMemo(() => Object.values(cart).reduce((sum, item) => sum + (item as CartItem).quantity, 0), [cart]);
    // FIX: Cast `item` to `CartItem` to access its properties, as `Object.values` can return `unknown[]`.
    const cartSubtotal = useMemo(() => Object.values(cart).reduce((sum, item) => sum + (item as CartItem).price * (item as CartItem).quantity, 0), [cart]);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('kioscoTheme', newTheme);
            return newTheme;
        });
    };

    const value = {
        auth, login, logout, initializeAuth,
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartSubtotal,
        theme, toggleTheme,
        view, setView,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};