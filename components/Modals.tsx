
import React, { useState } from 'react';
import { Icons } from './Icons.tsx';

interface ProofUploadModalProps {
    orderPayload: any;
    onFinalize: (payload: any, receiptPath?: string) => void;
    onClose: () => void;
}

export const ProofUploadModal: React.FC<ProofUploadModalProps> = ({ orderPayload, onFinalize, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        // Mock upload
        await new Promise(res => setTimeout(res, 1500));
        const mockFilePath = `/uploads/proof-${Date.now()}.jpg`;
        setIsUploading(false);
        onFinalize(orderPayload, mockFilePath);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-tg-bg p-5 rounded-lg w-full max-w-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Subir Comprobante</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                <p className="text-sm text-tg-hint">Para agilizar tu pedido, por favor adjunta el comprobante de tu pago.</p>
                
                <label htmlFor="proof-input" className="cursor-pointer p-6 flex flex-col items-center justify-center rounded-lg bg-tg-secondary-bg border-2 border-dashed border-tg-hint">
                    <Icons.Attachment className="w-10 h-10 text-tg-text mb-2"/>
                    <span className="text-sm font-medium text-tg-text truncate max-w-full">{file ? file.name : 'Toca para seleccionar imagen'}</span>
                    <input type="file" id="proof-input" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
                
                <button onClick={handleUpload} disabled={!file || isUploading} className="w-full bg-success text-white p-3 rounded-lg font-bold disabled:bg-tg-hint">
                    {isUploading ? 'Enviando...' : 'Enviar Comprobante'}
                </button>
            </div>
        </div>
    );
};

// You can add the SurveyModal component here as well if needed