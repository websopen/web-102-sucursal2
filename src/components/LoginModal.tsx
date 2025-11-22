import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext.tsx';
import { api } from '../services/api.ts';

type LoginStep = 'initial' | 'verify_whatsapp' | 'prompt_name';

export const LoginModal: React.FC = () => {
    const { login } = useAppContext();
    const [step, setStep] = useState<LoginStep>('initial');
    const [phoneOrCode, setPhoneOrCode] = useState('');
    const [whatsappCode, setWhatsappCode] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInitialSubmit = async () => {
        if (!phoneOrCode) {
            setStatus('Por favor, ingresa un valor.');
            return;
        }
        setIsLoading(true);
        setStatus('Procesando...');
        
        const result = await api.unifiedLogin(phoneOrCode);
        
        setIsLoading(false);
        if (result.status === 'needs_whatsapp_verification') {
            setStatus('Te hemos enviado un código por WhatsApp. Ingrésalo aquí:');
            setStep('verify_whatsapp');
        } else {
            // FIX: Corrected unsafe type assertion by casting to 'unknown' first. This is necessary because the type inferred from the mock API response doesn't fully represent all possible response shapes, causing a type error.
            setStatus((result as unknown as { message: string }).message || 'Error desconocido.');
        }
    };

    const handleVerifySubmit = async () => {
        if (!whatsappCode) {
            setStatus('Por favor, ingresa el código.');
            return;
        }
        setIsLoading(true);
        setStatus('Verificando código...');

        const result = await api.verifyWhatsappCode(phoneOrCode, whatsappCode);

        setIsLoading(false);
        if (result.status === 'success') {
            // FIX: Corrected unsafe type assertion by casting to 'unknown' first. This is necessary because the type inferred from the mock API response doesn't fully represent all possible response shapes, causing a type error.
            const successResult = result as unknown as { phone: string; name: string };
            login(successResult.phone, successResult.name);
        } else if (result.status === 'needs_name') {
            setStatus('¡Excelente! Para terminar, por favor dinos tu nombre.');
            setStep('prompt_name');
        } else {
            // FIX: Corrected unsafe type assertion by casting to 'unknown' first. This is necessary because the type inferred from the mock API response doesn't fully represent all possible response shapes, causing a type error.
            setStatus((result as unknown as { message: string }).message || 'Código incorrecto.');
        }
    };
    
    const handleNameSubmit = async () => {
        if (!name) {
            setStatus('Por favor, ingresa tu nombre.');
            return;
        }
        setIsLoading(true);
        setStatus('Guardando...');

        const result = await api.updateClientInfo(phoneOrCode, name);
        setIsLoading(false);
        if (result.status === 'success') {
            login(result.phone, result.name);
        } else {
            setStatus('No se pudo guardar tu nombre. Intenta de nuevo.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-tg-bg p-6 rounded-lg w-full max-w-md text-center flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Bienvenido</h2>
                
                {step === 'initial' && (
                    <>
                        <p className="text-tg-hint">Ingresa tu número de celular para comprar.</p>
                        <input 
                            type="tel" 
                            value={phoneOrCode}
                            onChange={(e) => setPhoneOrCode(e.target.value)}
                            placeholder="Número de celular"
                            className="w-full p-3 rounded-lg border border-tg-hint bg-tg-secondary-bg text-tg-text"
                            disabled={isLoading}
                        />
                        <button onClick={handleInitialSubmit} disabled={isLoading} className="w-full bg-tg-button text-tg-button-text p-3 rounded-lg font-semibold disabled:bg-tg-hint">
                            {isLoading ? 'Procesando...' : 'Continuar'}
                        </button>
                    </>
                )}

                {step === 'verify_whatsapp' && (
                     <>
                        <p className="text-tg-hint">{status}</p>
                        <input 
                            type="text" 
                            value={whatsappCode}
                            onChange={(e) => setWhatsappCode(e.target.value)}
                            placeholder="Código de 6 dígitos"
                            className="w-full p-3 rounded-lg border border-tg-hint bg-tg-secondary-bg text-tg-text"
                            disabled={isLoading}
                        />
                        <button onClick={handleVerifySubmit} disabled={isLoading} className="w-full bg-tg-button text-tg-button-text p-3 rounded-lg font-semibold disabled:bg-tg-hint">
                            {isLoading ? 'Verificando...' : 'Verificar'}
                        </button>
                    </>
                )}

                 {step === 'prompt_name' && (
                     <>
                        <p className="text-tg-hint">{status}</p>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre y Apellido"
                            className="w-full p-3 rounded-lg border border-tg-hint bg-tg-secondary-bg text-tg-text"
                            disabled={isLoading}
                        />
                        <button onClick={handleNameSubmit} disabled={isLoading} className="w-full bg-tg-button text-tg-button-text p-3 rounded-lg font-semibold disabled:bg-tg-hint">
                           {isLoading ? 'Guardando...' : 'Guardar y Entrar'}
                        </button>
                    </>
                )}

                <p className="text-danger min-h-[20px]">{!isLoading && status.startsWith('Error') ? status : ''}</p>
            </div>
        </div>
    );
};