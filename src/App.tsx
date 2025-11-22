
import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './hooks/useAppContext.tsx';
import { CatalogView } from './components/CatalogView.tsx';
import { OrderStatusView } from './components/OrderStatusView.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { Icons } from './components/Icons.tsx';
import { initHubAuth } from './utils/hubAuth';

const AppContent: React.FC = () => {
    const { auth, theme, initializeAuth, setView, view } = useAppContext();

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        // Inicializar recepción de tokens desde Hub
        initHubAuth({
            onTokenReceived: async (tokenData) => {
                console.log('[Kiosco Cliente] Token recibido desde Hub');
                console.log('[Kiosco Cliente] Owner ID:', tokenData.owner_id);
                if (tokenData.owner_id) {
                    localStorage.setItem('owner_id', tokenData.owner_id);
                }
            }
        });

        const orderIdFromUrl = new URLSearchParams(window.location.search).get('order_id');
        if (orderIdFromUrl) {
            setView({ type: 'ORDER_STATUS', orderId: orderIdFromUrl });
        } else {
            initializeAuth();
        }
    }, [initializeAuth, setView]);

    if (auth.loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-tg-secondary-bg text-tg-hint">
                <Icons.Spinner className="animate-spin mr-3 h-8 w-8" />
                Cargando...
            </div>
        );
    }

    if (!auth.isAuthenticated && view.type !== 'ORDER_STATUS') {
        return <LoginModal />;
    }

    switch (view.type) {
        case 'ORDER_STATUS':
            return <OrderStatusView orderId={view.orderId} />;
        case 'CATALOG':
        default:
            return <CatalogView />;
    }
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <div className="bg-tg-secondary-bg text-tg-text">
                <AppContent />
            </div>
        </AppProvider>
    );
};

export default App;