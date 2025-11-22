
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext.tsx';
import { Icons } from './Icons.tsx';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const { auth, logout, theme, toggleTheme } = useAppContext();
    const [notify, setNotify] = useState(true);

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que quieres cerrar la sesión?')) {
            logout();
            onClose();
        }
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div className={`fixed top-0 left-0 h-full w-11/12 max-w-sm bg-tg-bg z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center p-3 gap-3 border-b border-tg-secondary-bg flex-shrink-0">
                    <button onClick={onClose} className="w-11 h-11 flex items-center justify-center text-tg-text">
                        <Icons.Close className="w-8 h-8" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-cover bg-center bg-tg-secondary-bg" style={{backgroundImage: "url('https://i.imgur.com/3JTl4k3.png')"}}></div>
                    <span className="font-semibold text-lg text-tg-text">Tu Kiosco Online</span>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <img src="https://i.imgur.com/uG9pQ8q.jpeg" alt="Banner del Kiosco" className="w-full h-auto object-cover" />
                    <div className="p-4">
                        <div className="pb-4">
                            <h3 className="text-xl font-bold mb-3">{auth.userInfo?.name ? `Hola, ${auth.userInfo.name.split(' ')[0]}`: '¡Bienvenido!'}</h3>
                            <div className="flex flex-col gap-2.5 text-sm">
                                <div className="flex items-center gap-2 text-tg-text">
                                    <Icons.User className="w-4 h-4 text-tg-hint"/>
                                    <span>Dirección no disponible</span>
                                </div>
                                 <div className="flex items-center gap-2 text-tg-text">
                                    <Icons.Phone className="w-4 h-4 text-tg-hint"/>
                                    <span>{auth.userInfo?.phone || 'No registrado'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                           <label htmlFor="whatsapp-notify-switch">Notificar por WhatsApp</label>
                           <label className="relative inline-flex items-center cursor-pointer">
                               <input type="checkbox" id="whatsapp-notify-switch" className="sr-only peer" checked={notify} onChange={() => setNotify(!notify)} />
                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success"></div>
                           </label>
                        </div>
                        <div className="flex justify-between items-center py-2">
                           <label htmlFor="night-mode-switch">Modo Oscuro</label>
                           <label className="relative inline-flex items-center cursor-pointer">
                               <input type="checkbox" id="night-mode-switch" className="sr-only peer" checked={theme === 'dark'} onChange={toggleTheme}/>
                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success"></div>
                           </label>
                        </div>
                    </div>
                     <div className="p-4 border-t border-tg-secondary-bg flex flex-col gap-3">
                         <a href="#" className="flex items-center gap-4 p-3 bg-tg-secondary-bg rounded-lg font-medium text-tg-text">
                            <Icons.Phone className="w-6 h-6 text-green-500"/> <span>Contactar Asistente</span>
                         </a>
                         <a href="#" className="flex items-center gap-4 p-3 bg-tg-secondary-bg rounded-lg font-medium text-tg-text">
                            <Icons.Location className="w-6 h-6 text-blue-500"/> <span>Nuestra Ubicación</span>
                         </a>
                         <a href="#" onClick={handleLogout} className="flex items-center gap-4 p-3 bg-tg-secondary-bg rounded-lg font-medium text-tg-text">
                            <Icons.Logout className="w-6 h-6 text-danger"/> <span>Cerrar Sesión</span>
                         </a>
                     </div>
                </div>
                <div className="p-4 mt-auto border-t border-tg-secondary-bg">
                    <div className="p-2 rounded-lg flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        <a href="#" target="_blank" className="bg-black/80 text-white p-2 rounded-md z-10">
                            <img src="https://i.imgur.com/r63K4dO.png" alt="Data Fiscal AFIP" className="h-9 w-auto" />
                        </a>
                        <p className="text-xs text-white/90 text-center mt-1.5 z-10">Las imágenes son a modo ilustrativo.</p>
                    </div>
                    <p className="text-xs text-tg-hint text-center mt-2">© 2024. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    );
};