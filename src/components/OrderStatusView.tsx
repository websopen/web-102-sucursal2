

import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.ts';
import { Icons } from './Icons.tsx';
import { useAppContext } from '../hooks/useAppContext.tsx';

declare const L: any; // Leaflet is loaded from CDN

interface StatusTimelineProps {
    status: string;
    orderType: 'delivery' | 'pickup';
}
const StatusTimeline: React.FC<StatusTimelineProps> = ({ status, orderType }) => {
    const deliverySteps = ['EN_PREPARACION', 'EN_CAMINO', 'ENTREGADO'];
    const pickupSteps = ['EN_PREPARACION', 'LISTO_PARA_RETIRAR', 'ENTREGADO'];
    const steps = orderType === 'delivery' ? deliverySteps : pickupSteps;
    const stepText: Record<string, string> = {
        'EN_PREPARACION': 'En Preparación',
        'EN_CAMINO': 'En Camino',
        'LISTO_PARA_RETIRAR': 'Listo para Retirar',
        'ENTREGADO': 'Entregado'
    };
    
    const currentIndex = steps.indexOf(status);

    return (
        <div className="relative flex justify-between items-start w-full px-4 pt-4">
            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-tg-secondary-bg rounded-full">
                <div className="absolute top-0 left-0 h-full bg-success rounded-full transition-all duration-500" style={{width: `${(currentIndex / (steps.length - 1)) * 100}%`}}></div>
            </div>
            {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center text-center z-10">
                    <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${index <= currentIndex ? 'border-success bg-tg-bg' : 'border-tg-secondary-bg bg-tg-bg'}`}>
                        {index < currentIndex && <div className="w-2 h-2 bg-success rounded-full"></div>}
                    </div>
                    <span className={`mt-2 text-xs font-semibold ${index <= currentIndex ? 'text-tg-text' : 'text-tg-hint'}`}>{stepText[step]}</span>
                </div>
            ))}
        </div>
    );
};


export const OrderStatusView: React.FC<{ orderId: string }> = ({ orderId }) => {
    const { setView } = useAppContext();
    const [statusData, setStatusData] = useState<any>(null);
    const [error, setError] = useState('');
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await api.fetchOrderStatus(orderId);
                setStatusData(data);
                if (data.status === 'ENTREGADO' || data.status === 'CANCELADO') {
                    clearInterval(interval);
                }
            } catch (e) {
                setError('No se pudo cargar el estado del pedido.');
                clearInterval(interval);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 7000);
        return () => clearInterval(interval);
    }, [orderId]);

    useEffect(() => {
        if (statusData && mapRef.current === null) {
            const mapEl = document.getElementById('delivery-map');
            if (mapEl) {
                mapRef.current = L.map('delivery-map').setView([-34.60, -58.38], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
            }
        }
        if (mapRef.current && statusData?.location?.lat) {
            const { lat, lon } = statusData.location;
             mapRef.current.setView([lat, lon], 16);
            if(markerRef.current) {
                markerRef.current.setLatLng([lat, lon]);
            } else {
                markerRef.current = L.marker([lat, lon]).addTo(mapRef.current);
            }
        }
    }, [statusData]);

    if (error) return <div className="p-4 text-center text-danger">{error}</div>;
    if (!statusData) return <div className="p-4 text-center text-tg-hint">Cargando estado del pedido...</div>;

    return (
        <div className="bg-tg-bg min-h-screen flex flex-col">
            <div className="p-4 flex-grow flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-4 text-center bg-tg-secondary-bg p-3 rounded-lg">
                    <div>
                        <div className="text-sm text-tg-hint">ID de Pedido</div>
                        <b className="text-lg font-bold">{statusData.order_id}</b>
                    </div>
                    <div>
                        <div className="text-sm text-tg-hint">Código de Retiro</div>
                        <b className="text-lg font-bold">{statusData.pickupCode}</b>
                    </div>
                </div>
                <div className="order-section">
                    <h3 className="text-xl font-bold text-center">Seguimiento de tu Pedido</h3>
                    <StatusTimeline status={statusData.status} orderType={statusData.orderType} />
                    <div id="delivery-map" className="w-full h-56 rounded-lg border border-tg-hint bg-tg-secondary-bg mt-4"></div>
                </div>
                <div className="mt-auto pt-4 border-t border-tg-secondary-bg space-y-3">
                     <button onClick={() => setView({type: 'CATALOG'})} className="w-full bg-tg-button text-tg-button-text p-3 rounded-lg font-bold">Volver al Inicio</button>
                    <p className="text-xs text-tg-hint text-center">© 2024. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
};