

import React, { useState, useEffect, useCallback } from 'react';
// FIX: Imported `CartItem` to use for type casting.
import { CheckoutData, CartItem } from '../types.ts';
import { useAppContext } from '../hooks/useAppContext.tsx';
import { api } from '../services/api.ts';
import { Icons } from './Icons.tsx';
import { ProofUploadModal } from './Modals.tsx';

type CheckoutStep = 'cart' | 'delivery';

export const CheckoutModal: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const { cart, cartSubtotal, updateQuantity, clearCart, setView } = useAppContext();
    const [step, setStep] = useState<CheckoutStep>('cart');
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState('pickup');
    const [selectedPayment, setSelectedPayment] = useState('virtual');
    const [paymentFormData, setPaymentFormData] = useState<{paidWith?: string; cashAmount?: string; comments?: string}>({});
    const [isExactCash, setIsExactCash] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [pendingOrderPayload, setPendingOrderPayload] = useState<any>(null);

    const { deliveryCost, surcharge, total } = React.useMemo(() => {
        let deliveryCost = 0;
        if (checkoutData && selectedDelivery.startsWith('address_')) {
            const index = parseInt(selectedDelivery.split('_')[1]);
            deliveryCost = checkoutData.addresses[index]?.costo_envio || 0;
        }
        let surcharge = selectedPayment === 'virtual' ? cartSubtotal * 0.05 : 0;
        const total = cartSubtotal + deliveryCost + surcharge;
        return { deliveryCost, surcharge, total };
    }, [cartSubtotal, checkoutData, selectedDelivery, selectedPayment]);

    const handleNextStep = async () => {
        setIsLoading(true);
        try {
            const response = await api.fetchCheckoutData();
            if (response.status === 'success') {
                setCheckoutData(response.data);
                setStep('delivery');
            } else {
                alert('No se pudieron cargar los datos del checkout.');
            }
        } catch (error) {
            alert('Error de red al cargar datos.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = () => {
        const payload = { cart, delivery: selectedDelivery, payment: selectedPayment, paymentDetails: paymentFormData, total };
        setPendingOrderPayload(payload);
        if (selectedPayment === 'virtual' || selectedPayment === 'mixto') {
            setShowProofModal(true);
        } else {
            finalizeOrder(payload);
        }
    };
    
    const finalizeOrder = useCallback(async (payload: any, receiptPath?: string) => {
        setIsSubmitting(true);
        if (receiptPath) {
            payload.receiptPath = receiptPath;
        }
        try {
            const result = await api.initiateOrder(payload);
            if (result.status === 'success') {
                alert(`Pedido #${result.order_id} creado con éxito.`);
                clearCart();
                onClose();
                setView({ type: 'ORDER_STATUS', orderId: result.order_id });
            } else {
                alert('Hubo un problema al crear tu pedido.');
            }
        } catch {
            alert('Error de conexión al crear el pedido.');
        } finally {
            setIsSubmitting(false);
            setShowProofModal(false);
        }
    }, [clearCart, onClose, setView]);
    
    // FIX: Cast result of Object.values(cart) to CartItem[] to ensure type safety.
    const cartItems = Object.values(cart) as CartItem[];

    return (
        <>
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-end" onClick={onClose}>
            <div className="bg-tg-bg w-full max-w-2xl max-h-[90vh] rounded-t-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-tg-secondary-bg">
                    {step === 'delivery' && <button onClick={() => setStep('cart')} className="text-xl">←</button>}
                    <h2 className="text-xl font-bold text-center flex-grow">{step === 'cart' ? '🛒 Tu Carrito' : '📦 Envío y Pago'}</h2>
                    <button onClick={onClose} className="text-2xl w-8 h-8">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {step === 'cart' && (
                        <div className="p-4 flex flex-col gap-3">
                            {cartItems.length > 0 ? cartItems.map(item => (
                                <div key={item.product_id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{item.product_name}</p>
                                        <p className="text-sm text-tg-hint">{item.quantity} x ${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-tg-button text-tg-button-text rounded-full p-1">
                                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-7 h-7">-</button>
                                        <span className="font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-7 h-7">+</button>
                                    </div>
                                </div>
                            )) : <p className="text-center text-tg-hint py-8">Tu carrito está vacío.</p>}
                        </div>
                    )}
                    {step === 'delivery' && checkoutData && (
                        <div className="p-4 space-y-4">
                            {/* Delivery Options */}
                             <div className="space-y-2">
                                <h3 className="font-bold text-lg">🚚 Elige Entrega</h3>
                                <div className="flex flex-col gap-2">
                                     <label className={`p-3 border-2 rounded-lg cursor-pointer ${selectedDelivery === 'pickup' ? 'border-tg-button' : 'border-tg-secondary-bg'}`}>
                                        <input type="radio" name="delivery" value="pickup" checked={selectedDelivery === 'pickup'} onChange={e => setSelectedDelivery(e.target.value)} className="hidden" />
                                        <strong>🏪 Retirar en el local</strong>
                                        <p className="text-sm text-tg-hint">{checkoutData.delivery_config.business_address}</p>
                                     </label>
                                      {checkoutData.addresses.map((addr, i) => (
                                         <label key={i} className={`p-3 border-2 rounded-lg cursor-pointer ${selectedDelivery === `address_${i}` ? 'border-tg-button' : 'border-tg-secondary-bg'}`}>
                                            <input type="radio" name="delivery" value={`address_${i}`} checked={selectedDelivery === `address_${i}`} onChange={e => setSelectedDelivery(e.target.value)} className="hidden"/>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <strong>🏠 {addr.address_corregida}</strong>
                                                    <p className="text-sm text-tg-hint">{addr.description}</p>
                                                </div>
                                                <span className="font-semibold">${addr.costo_envio.toFixed(2)}</span>
                                            </div>
                                         </label>
                                      ))}
                                </div>
                             </div>
                             {/* Payment Options */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg">💳 Método de Pago</h3>
                                {/* ... Payment method UI ... */}
                            </div>
                            <textarea placeholder="Comentarios..." className="w-full p-2 border border-tg-secondary-bg rounded-lg bg-tg-secondary-bg"></textarea>
                        </div>
                    )}
                     {step === 'delivery' && !checkoutData && <div className="p-4 text-center text-tg-hint">Cargando datos...</div>}
                </div>

                <div className="p-4 border-t border-tg-secondary-bg">
                    <div className="text-right mb-4">
                        <p>Subtotal: ${cartSubtotal.toFixed(2)}</p>
                        {step === 'delivery' && <p>Envío: ${deliveryCost.toFixed(2)}</p>}
                        {step === 'delivery' && surcharge > 0 && <p>Recargo: ${surcharge.toFixed(2)}</p>}
                        <p className="font-bold text-xl">TOTAL: ${total.toFixed(2)}</p>
                    </div>
                    {step === 'cart' ? (
                        <button onClick={handleNextStep} disabled={isLoading || cartItems.length === 0} className="w-full bg-success text-white p-3 rounded-lg font-bold disabled:bg-tg-hint">
                            {isLoading ? 'Cargando...' : 'Continuar →'}
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-success text-white p-3 rounded-lg font-bold disabled:bg-tg-hint">
                           {isSubmitting ? 'Enviando...' : '✅ Enviar Pedido'}
                        </button>
                    )}
                </div>
            </div>
        </div>
        {showProofModal && <ProofUploadModal orderPayload={pendingOrderPayload} onFinalize={finalizeOrder} onClose={() => finalizeOrder(pendingOrderPayload)}/>}
      </>
    );
};